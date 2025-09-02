import { useState } from "react";

export default function SignUpPage(){
    //init state
    const [regisData,setRegis] = useState({
        name:"",
        email:"",
        password:"",
        gender:"",
        dates:""

    })
    //init state buat modal
    const [activeModal,setActive] = useState(false)

    // ini buat error
    const [errors,setErrors] = useState({
        name:"",
        email:"",
        password:"",
        gender:"",
        dates:""
    })
  
    async function handleRegist(e) {
        e.preventDefault()


        try {
            const response = await fetch('http://localhost:3000/api/auth/register',{
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify(regisData)
            })
            // if jika status code selain  200
            if (!response.ok){
                const data = await response.json();
                //update error
                setErrors(data.fieldErrors);
                return ;  // biar behenti disini karena js bisa melanjutkan diluar if
            }
            
            //set activeModal == true
            setActive(true);
            //reset form

            setRegis({
                name:"",
                email:"",
                password:"",
                gender:'',
                dates:""
            })
            //reset error
            setErrors({
                name:"",
                email:"",
                password:"",
                gender:'',
                dates:""
            })


        } catch (error) {
            console.log(error)
        }
        
    }
    return (
        <>
            <form onSubmit={handleRegist} className="h-[50vh] w-full  flex flex-col justify-start items-center ">
                <div className=" mt-2 w-full h-[15%] -100 gap-2 flex items-center px-2">
                    <label className="w-[40%]" >Name <span>:</span></label>
                    <input 
                        type='text' 
                        value= {regisData.name} 
                        onChange={(e) => setRegis({...regisData,name:e.target.value})} 
                        className="w-[90%] h-[85%] border border-black rounded-xl"
                    />
                   
                </div>
                {/* buat error status*/}
                 <p className="w-full h-[5%]  text-red-500 flex items-center justify-end px-5 text-sm">{errors.name}</p>
                <div className="  w-full h-[15%] -100 gap-2 flex items-center px-2">
                    <label className="w-[40%]" >Email <span>:</span></label>
                    <input 
                        type='email' 
                        value= {regisData.email} 
                        onChange={(e) => setRegis({...regisData,email:e.target.value})} 
                        className="w-[90%] h-[85%] border border-black rounded-xl"
                    />
                </div>
                <p className="w-full h-[5%]  text-red-500 flex items-center justify-end px-5 text-sm">{errors.email}</p>
                <div className="  w-full h-[15%]  gap-2 flex items-center px-2">
                    <label className="w-[40%]" >Password :  </label>
                    <input 
                        type='password' 
                        value= {regisData.password} 
                        onChange={(e) => setRegis({...regisData,password:e.target.value})} 
                        className="w-[90%] h-[85%] border border-black rounded-xl"
                    />
                </div>
                 {/* buat error status*/}
                <p className="w-full h-[5%]  text-red-500 flex items-center justify-end px-5 md:text-sm text-[8pt]">{errors.password}</p>
                <div className=" mt-2 w-full h-[15%] -100 gap-2 flex items-center px-2">
                    <label className="w-[40%]" >Gender :  </label>
                    <select 
                        className="w-[90%] h-[85%] border border-black rounded-xl"
                        value={regisData.gender}
                        onChange={(e) => setRegis({...regisData,gender:e.target.value})}
                    >
                        <option value="">--Pilih gender--</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>


                    </select>
                </div>
                 <p className="w-full h-[5%]  text-red-500 flex items-center justify-end px-5 text-sm">{errors.dates}</p>
                <div className="  w-full h-[15%]  gap-2 flex items-center px-2">
                    <label className="w-[40%]" >Tanggal lahir :  </label>
                    <input 
                        type='date' 
                        value= {regisData.dates} 
                        onChange={(e) => setRegis({...regisData,dates:e.target.value})} 
                        className="w-[90%] h-[85%] border border-black rounded-xl"
                    />
                </div>
                
                <p className="w-full h-[5%]  text-red-500 flex items-center justify-end px-5 text-sm">{errors.dates}</p>

                <div className=" mt-2 w-full h-[15%] -100 gap-2 flex items-center justify-center px-2">
                    <button type='submit' className="flex rounded-xl transform transition-all border border-blue-500 border-bold duration-300 hover:scale-110 items-center justify-center text-sm w-1/4 h-[50%] bg-white-600">Sign Up</button>
                </div>

               
                
            </form>
            {
                activeModal && (
                <div className="fixed w-screen h-screen bg-black/50 inset-0 z-50 flex items-center justify-center">
                    <div className="md:(w-3/4 h-1/2) h-1/4 w-3/4  bg-white flex items-center flex-col justify-center gap-5">
                        <h1 className="text-center text-sm md:(text-xl)">Anda berhasil mendaftarkan akun anda, Silahkan buka email anda untuk verifikasi</h1>
                        <button onClick={() => setActive(false)} className="border border-black rounded-xl md:(w-[10%] h-[5vh]) w-[30%]  hover:(bg-black text-white)">Cancel</button>
                    
                    </div>
                </div>)
            }
        
        
        </>
    )
}