import { useState } from "react";
import {useNavigate} from 'react-router-dom'
export default function LoginPage(){
    const navigate = useNavigate();
    //init buat data kirim
    const [loginData,setLogin] = useState({
        email:"",
        password:""
    })
    //init buat error
    const [loginError,setError] = useState({
        email:"",
        password:""
    })
      //init state buat modal
    const [activeModal,setActive] = useState(false)

    //login
    async function handleLogin(e) {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:3000/api/auth/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(loginData),
                credentials:'include'
            })
            //res.status adalah synchrus jadi langsung aja diakses beda dengan res.json dengan await harus
            if(response.status == 422){
                const data = await response.json()
                //update error
                setError(data.fieldErrors);
                console.log(loginError)
                return;
            }else if (response.status == 409){
                setActive(true);
                return;
            }else{
                navigate('/product')
            }
        }catch(error){
            console.log(error)

        }
        
    }
    //resend
    async function handleResend() {
        try {
            const response = await fetch('http://localhost:3000/api/auth/resend',{
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({email:loginData.email})
            })
            setActive(false);
        } catch (error) {
            console.log(error)
            
        }

        
    }
    return (
        <>
            <form onSubmit={handleLogin} className="h-[50vh] w-full  flex flex-col justify-start items-center ">
                <div className=" mt-2 w-full h-[15%] -100 gap-2 flex items-center px-2">
                    <label className="w-[40%]" >Email <span>:</span></label>
                    <input 
                        className="w-[90%] h-[85%] border border-black rounded-xl"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLogin({...loginData,email:e.target.value})}
                    />
                </div>
                <p className="w-full h-[5%]  text-red-500 flex items-center justify-end px-5 md:text-sm text-[8pt]">{loginError.email}</p>

                <div className=" mt-2 w-full h-[15%] -100 gap-2 flex items-center px-2">
                    <label className="w-[40%]" >Password :  </label>
                    <input 
                        className="w-[90%] h-[85%] border border-black rounded-xl"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLogin({...loginData,password:e.target.value})}
                    />
                </div>
                <p className="w-full h-[5%]  text-red-500 flex items-center justify-end px-5 md:text-sm text-[8pt]">{loginError.password}</p>
                
                <div className=" mt-2 w-full h-[15%] -100 gap-2 flex items-center justify-center px-2">
                    <button type='submit' className="flex rounded-xl transform transition-all border border-blue-500 border-bold  duration-300 hover:scale-110 items-center justify-center text-sm w-1/4 h-[50%] bg-white-600">Login</button>
                </div>
               
               
                
            </form>
               {
                activeModal && (
                <div className="fixed w-screen h-screen bg-black/50 inset-0 z-50 flex items-center justify-center">
                    <div className="md:(w-3/4 h-1/2) h-1/4 w-3/4  bg-white flex items-center flex-col justify-center gap-5">
                        <h1 className="text-center text-sm md:(text-xl)">Email anda belum verifikasi, Silahkan buka email anda untuk verifikasi</h1>
                        <button onClick={handleResend} className="border border-black rounded-xl md:(w-[10%] h-[5vh]) w-[30%]  hover:(bg-black text-white)">Resend</button>
                    
                    </div>
                </div>)
                }
        
        
        </>
    )
}