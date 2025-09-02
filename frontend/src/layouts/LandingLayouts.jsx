import {Link, Outlet} from 'react-router-dom'

export default function LandingLayout(){
    return (
        <>
            <div className="md:(flex flex-row) flex flex-col max-w-screen h-screen">
                <div className="md:( block max-w-1/2 h-screen) hidden w-full h-1/2 "></div>
                <div className="md:( max-w-1/2 h-screen)  w-full h-full  flex items-center justify-center">
                    <div className="h-3/4 w-3/4 border rounded-xl border-black md:(w-[60%]) bg-white shadow-xl flex flex-col items-center">
                        <h1 className="font-arial text-blue-500 my-5 text-xl font-bold">Welcome to this App</h1>
                        <nav className="w-full h-[10%] border border black flex flex-row items-center">
                            <Link  className = 'no-underline text-black hover:font-bold transtition-all duration-200 w-1/2 h-full flex items-center justify-center ' to='login'><h1>Login</h1></Link>
                            <Link  className = ' no-underline text-black hover:font-bold transtition-all duration-200 w-1/2 h-full flex items-center justify-center ' to='register'><h1>Sign Up</h1></Link>

                        </nav>
                        <div className="w-full min-h-0">
                            <Outlet/>
                        </div>
                    
                    </div>

                
                </div>


            </div>
        
        </>
    )
}