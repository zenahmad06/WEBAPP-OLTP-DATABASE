import Item from "../components/Item";
import { useEffect, useState } from "react";
import {Link, useSearchParams} from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus } from "../Context/CartSlice";
export default function ProductPage(){
    //  handle init nama user
    const [userName,setUser] = useState("");
    const [email,setEmail] = useState("")
    //model buat succesMessage
    const [succes,setModalSucces] = useState(false)
    const confirm  = useSelector((state) => state.cart.confirm)
    useEffect(() => {
        const aktif = () => {
            if(confirm == true){
                setModalSucces(true)
            }
        }
        aktif();
    },[confirm])
    // API-CALL setiap /dashboard ke load maka otomatis akan apical menggunakan useEffect 
    useEffect( function(){
        const getUser = async() => {
            try {
                const res = await fetch('http://localhost:3000/api/me',{
                    credentials:'include' //mengirim cookie otomatis support beda origin/port
                });
                //data
                const data = await res.json();
                //name
                const name = data.name
                //update state
                setUser(name)
                setEmail(data.email)
            } catch (error) {
                console.log(error.message)
                
            }
        }
        //panggil
        getUser();
    }
    
        
    ,[]) // dependensi kosong karena mau api call ke load ketika dashboard dikunjungi

    // useSearchParmas selalu baca url karena dari luar kia activate "devensive programming"
    const [urlNow] = useSearchParams();
    // terus karen dari luar kita harus mikir "seknario terburuk" jangan true nya saja
    // ?? check apakah null/undefined , penangangn nya mau opsi lain atau show error
    // jika nggak ada maka page nya 1
    // convert ke Number harapan kita 
    let page = Number(urlNow.get('page')) ?? 1;
    // check lag kan user bisa isng isi 'abc;
    //isnAN IS NOT A NUMBER BERNILAI TRUE JIKA PAge itu string
    if(isNaN(page) || page < 1){
        page = 1
    }



    //buat fungsi untuk mengubah url
    function makeUrl(n){
        //buat salinan url dengan new urlSearchParams
        const urlCp = new URLSearchParams(urlNow);
        // defensive progamming jika n == 1
        if(n == 1){
            urlCp.delete('page');
            return urlCp;
        }

      
        //if not jika tidak, update page dengan n terbaru
        urlCp.set('page',String(n));
        return `?${urlCp.toString()}` //return string query
    }

    // ambil data dari table menu
    // data return list
    const {data,isLoading,isError} = useQuery({
        queryKey : ['menus',page], // nama kotak penyimpanan di cache, chache sesuai dengan page
        queryFn: async() => {
            const res = await fetch(`http://localhost:3000/api/menu?page=${page}`,{
                credentials:'include'
            });
        
            return res.json(); // masuk ke data diatas
        },
        keepPreviousData:true,
        staleTime:1000*60*5, // 5 menit 
        cacheTime:1000*60*10 // 10 menit
    })
    const dispatch = useDispatch()
    function closeModal(){
        setModalSucces(false);
        //change ke false
        dispatch(changeStatus(false));
    }
    return (
        <>
          
            {/*container item */}
            <div className=" h-auto mt-2 w-[85%] md:(gap-[6.66%] gap-y-4 ) gap-[5.9%]  flex flex-wrap gap-y-4 mx-auto  px-[4%] pt-5">
                {data && data?.map((value,index) => (
                    <Item key={index } name={value.item_name} price={value.price} indexClick={value.menu_id}/>
                   
                ))}
                 
            </div>
            {/* navigasi page */}
            <div className="w-3/4 h-[5vh]  mx-auto mt-2 flex items-center gap-5 justify-center">
                <Link to={makeUrl(Math.max(1,page-1))} className="no-underline text-gray-500 hover:text-black">previous</Link>
                {Array.from({length:4},(_,i) => i+1).map((value,index) => (
                    <Link to={makeUrl(value)} className="no-underline text-gray-500 hover:text-black">{value}  </Link>
                ))}
                <Link to={makeUrl(Math.min(4,page+1))}className="no-underline text-gray-500 hover:text-black">next</Link>
             
            </div>
            {
                succes && 

                    <div className="w-screen h-screen z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-1/4 h-1/2 bg-white flex items-center justify-center gap-2 flex-col">

                            <h1 className="text-xl">Transaksi Berhasil</h1>

                            <button onClick={closeModal} className="w-[30%] rounded-lg bg-green-300 h-[4vh">Tutup</button>
                        </div>
                    </div>
            }
        
        </>
    )
}