import Item from "../components/Item";
import { useEffect, useState } from "react";
import {Link, Outlet, useSearchParams} from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
export default function DashBoard(){
    //  handle init nama user
    const [userName,setUser] = useState("");
    const [email,setEmail] = useState("")
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
                console.log(email)
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
    const navigate = useNavigate()
    async function logoutAccount() {
        try{
            await fetch('http://localhost:3000/api/auth/logout',{
                method:'POST',
                credentials:'include'
            })
            //navigate ke login
            // replacee true biar back ke webappnya nggak bekerja
            navigate('/login',{replace:true})
        }catch(error){
            console.log(error)
        }
        
    }
    return (
        <>
            {/*header*/}
            <div className="md:(max-w-[80%] h-[10vh] ]) mx-auto  h-[8vh] max-w-[90%] mt-2 rounded-xl flex items-center justify-between border border-blue-400 px-5">
                <div className="h-full min-w-[15%] border border black flex flex-col justify-center items-center">
                    <h1>{userName}</h1>
                    <h2>{email}</h2>
                </div>
                <div className="flex items-center gap-5 no-underlines">
                     <Link to='cart' className="no-underline hover:text-blue-500 font-bold">Cart</Link>
                     <Link to='product' className="no-underline hover:text-blue-500 font-bold">Product</Link>
                     <button onClick={logoutAccount} className="w-[50%] h-[10%] font-bold hover:text-blue-500">Log Out</button>
                </div>
               

                
            </div>
            <div>
                <Outlet/>
            </div>

        
        </>
    )
}