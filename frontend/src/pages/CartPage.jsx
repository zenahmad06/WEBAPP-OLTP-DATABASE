import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeItem,removeAll,changeStatus } from "../Context/CartSlice"
import { useNavigate } from "react-router-dom"
export default function CartPage(){
    //manggil reducer
    const data = useSelector((state) => state.cart.data)
    //confitm

    const navigate = useNavigate()
    //mangging action
    const dispatch = useDispatch()
    //error
    const [error,setError] = useState("")
    //const total pesanan
    const totalPesanan = data.reduce((val,item) => {
        const quantitityItem = Number(item.amount ?? item.qty);
        return val + (quantitityItem * Number(item.price))
    },0)
    async function beliItems() {
        try {
            //const repsonse mengirim data ke backend
            if(totalPesanan == 0){
                setError("Anda belum memesan barang");
                return;
            }
            const response = await fetch('http://localhost:3000/api/order',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                //ngirim qty
                body:JSON.stringify({
                    //jadikan satu key yag dipasang tapi menggunakan List berisi array of object
                    items : data
                }),
                credentials:'include'
            });
            //navigate ke menu
            dispatch(removeAll())
            //jadi true
            dispatch(changeStatus(true))
            navigate('/product')
            
        } catch (error) {
            console.log(error)
            
        }
        
    }
    return(
        <>
            <div className="h-[50vh] relative w-[80%] mx-auto mt-5 border border-black bg-gray-300 overflow-y-auto">
                <table className="w-full border border-black ">
                    <thead>
                        <tr className="bg-gray-500 text-white"> 
                        <th>Menu_id</th>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                        </tr>

                    </thead>
                    <tbody>
                        {data.map((i,index) => (
                            <tr key={index} className="text-center bg-gray-100">
                                <td>{i?.menu_id}</td>
                                <td>{i?.item_name}</td>
                                <td>{i?.price}</td>
                                <td>{i?.qty}</td>
                                <td>{i?.total}</td>
                                <td>
                                    <button onClick={() => dispatch(removeItem(index))}className="h-1/4 w-[60%] bg-red-500 text-white rounded-xl border border-black">Delete</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table> 
                        
            </div>
            <div className="w-[15%] h-1/4 border border-black bg-white flex flex-col justify-center items-center mt-5 mx-auto ">
                        <h1>Total</h1>
                        <h1>{totalPesanan}</h1>
                
            </div>
            <div className="mx-auto mt-2 w-1/2  text-red-500 font-bold flex justify-center h-10">{error}</div>   
            <div className=" flex justify-center mt-2 ">
                <button onClick={beliItems} className="  w-[10%] bg-green-200 h-[5vh] rounded-xl">Beli</button>
            </div>
        </>
    )
  
}