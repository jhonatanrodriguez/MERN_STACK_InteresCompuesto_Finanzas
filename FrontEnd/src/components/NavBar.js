import react from "react";
import { Link } from "react-router-dom";
function NavBar(){
    return(
        <div>
             <nav class="bg-[#3A5862] w-100 h-[50px] flex flex-row justify-end items-center">
                 <div class="mr-5">
                    <ul class="text-white flex flex-row font-light">
                        <li class="mr-4 hover:font-normal">
                            <Link to={"/"}>Interes Simple</Link>
                        </li>
                        <li class="mr-4 hover:font-normal">
                            <Link to={"/descuentoSimple"}>Descuento Simple</Link>
                        </li>
                        <li class="mr-4 hover:font-normal">
                            <Link to={"/interesCompuesto"}>Interes Compuesto</Link>
                        </li>
                        <li class="mr-4 hover:font-normal">
                            <Link to={"/descuentoCompuesto"}>Descuento Compuesto</Link>
                        </li>
                    </ul>

                 </div>
             </nav>
        </div>
    )
}
export default NavBar;
