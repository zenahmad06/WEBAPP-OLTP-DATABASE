import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import {addItem, changeStatus} from '../Context/CartSlice'
import {useDispatch} from 'react-redux'
import { useNavigate } from "react-router-dom"
import { useState } from "react"
export default function DetailedPage(){
    //baca params (/) di url
    const {menu_id} = useParams()
    //load sesuai dengan menu_id
    const {data,isLoading,isError} = useQuery({
        queryKey:['pruduct',menu_id],
        queryFn:async() => {
            const res = await fetch(`http://localhost:3000/api/product/${menu_id}`,{
                credentials:'include'
            })
            return res.json()
        },
        staleTime:10000 * 60 * 15,
        cacheTime:10000 * 60 * 20
    })
    const [isErrorQty,setErrorQty] = useState("")
    const [qty,setQty] = useState("")
    const [total,setTotal] = useState(null)
    // useDispatch
    const dispatch = useDispatch();
    //navigate back
    const navigate = useNavigate()
    //function
    function addCart(){
         if(qty > data.stock){
            setErrorQty('pesanan melebihi stok');
            return;
        // jika yang di input bukan angka string isNaN is Not a Number, jika a diketika maka hasil isNaN true
        }else if(isNaN(qty)){
            setErrorQty("data invalid")
            return;
        }else if(qty == "0"){
            setErrorQty("minimal 1 item dipesan")
            return;

        }else if(!qty){
            setErrorQty("tidak boleh kosong")
            return;
        }
        //ke react reduct nambah key qty
        dispatch(addItem({...data,qty:qty,total:qty * data.price}));
        navigate('/product')

    }
    // fungsi beli

    //active modal
    const [confirmModal, setModal] = useState(false)
    function confirmItem(){
        if(qty > data.stock){
            setErrorQty('pesanan melebihi stok');
            return;
        // jika yang di input bukan angka string isNaN is Not a Number, jika a diketika maka hasil isNaN true
        }else if(isNaN(qty)){
            setErrorQty("data invalid")
            return;
        }else if(qty == "0"){
            setErrorQty("minimal 1 item dipesan")
            return;

        }else if(!qty){
            setErrorQty("tidak boleh kosong")
            return;
        }
        setModal(true)
        setTotal(Number(qty) * data?.price)
    }
    // fungsi beliITem
    async function beliItem() {
        try {
            //const repsonse mengirim data ke backend
            const response = await fetch('http://localhost:3000/api/order',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                //ngirim qty
                body:JSON.stringify({
                    //jadikan satu key yag dipasang tapi menggunakan List berisi array of object
                    items : [
                        {menu_id:data?.menu_id,amount:qty,total:total}
                    ]
                }),
                credentials:'include'
            });
            //navigate ke menu
            setQty("")
            dispatch(changeStatus(true))
            navigate('/product')
            
        } catch (error) {
            console.log(error)
            
        }
        
    }
    return (
        <div>
            <div className="mx-auto md:(w-[35%] h-[85vh]) w-[85%] h-[85vh] rounded-lg shadow-lg py-2 gap-2 mt-5 border border-black flex flex-col items-center">
                {/* kalau sumber eksternal gunakan optional chaining */}
                <h1 className="md:text-3xl text-xl">{data?.item_name}</h1>
                <div className="md:(h-[35%] w-[40%] rounded-full border border-black)"></div>
                 <h1 className="md:text-xl text-lg text-green-500 font-bold">{data?.price}</h1>
                <p className="mx-auto text-center">
                    hidangan klasik Italia-Amerika yang terdiri dari pasta spaghetti yang disajikan dengan saus tomat kaya rasa, ditambah bola-bola daging (meatballs) yang empuk dan gurih. Saus biasanya dimasak dengan bawang putih, bawang bombay, tomat, dan bumbu rempah seperti basil dan oregano, sehingga menghasilkan cita rasa hangat dan menggugah selera.
                </p>
                  <p>Beli item ini sebanyak : <input
                    className="border border-black w-1/4"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                 
                 />
                 </p>
                 <button onClick={addCart} className="md:(w-1/2 h-[3vh] text-[12pt]) w-1/2 h-[4vh] text-[8pt] rounded-xl text-lg bg-green-200">Tambahkan ke daftar pesanan +</button>
                 <h1>Atau </h1>
             
                <button onClick={confirmItem} className="md:(w-1/4 h-[3vh] text-[12pt]) w-1/2 h-[4vh] rounded-xl text-[8pt] bg-yellow-200">Pesan</button>
                  
                 <p className="w-[80%] h-5  flex items-center justify-center">{
                       isErrorQty.length > 0 && <p className="text-red-500 font-bold">{isErrorQty}</p>

                       
                    
                    }</p>

            </div>
            {
                confirmModal && 
                    <div className="w-screen h-screen z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-3/4 h-1/2 bg-white flex items-center justify-center gap-2 flex-col">

                            <h1>Confirmasi Pembelian</h1>
                            <p>{data.item_name} dengan jumlah {qty}</p>
                            <p> Total</p>
                            <h1 className="text-xl">{total}</h1>

                            <button onClick={beliItem} className="w-[5%] bg-green-300 h-[4vh">Beli</button>
                        </div>
                    </div>
            }
        </div>
    )
}

