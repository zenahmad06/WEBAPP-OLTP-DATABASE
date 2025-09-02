import { useNavigate } from "react-router-dom"

export default function Item(props){
    const navigate = useNavigate()
    return (
                <div 
                    className="min-h-[35vh] md:(w-[20%] text-lg) py-1 text-[10pt] transform hover:scale-105 transition-transform duration-300 w-[46%] border border-black rounded-xl shadow-xl gap-5 flex flex-col items-center"
                    onClick={() => navigate(`/product/${props.indexClick}`)}
                >
                    {props.name}
                    <div className="md:(w-[60%] h-[60%]) w-[70%] h-[50%] rounded-full border border-black"></div>
                    <h1 className="font-bold text-green-500">{props.price}</h1>
                </div>
    )
}