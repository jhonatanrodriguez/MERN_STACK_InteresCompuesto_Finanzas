import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
const COLORS = ["#F46D29", "#3A5862", "#34BDCF", "#C9CCCC", "#949190", "#3A5862"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({cx,cy,midAngle,innerRadius,outerRadius,percent,index}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
 function InteresCompuesto() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const dataFetch = async () => {
            try {
                const response = await fetch("http://localhost:3000/intcom");
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error(error);
            }
        }; dataFetch()
    }, []);
     return (
         <div>
             <NavBar />
             <div class="flex flex-row bg-gray-100 ">
                 <div class="m-4">
                     <h1 class="text-gray-500 text-5xl font-bold">INTERES</h1>
                     <h1 class="text-[#949190] text-3xl">COMPUESTO</h1>
                 </div>
                 <div class="text-[#34BDCF] text-8xl font-extrabold flex flex-row items-start justify-start">
                     <h1>3</h1>
                 </div>
             </div>
             <div class="flex flex-row justify-center bg-blue-50">
                 <div class="flex flex-col justify-center items-center w-3/4 pl-10">
                              <h1 class="mb-5 font-semibold text-[#3A5862] ">CLIENTE VS INTERES</h1>
                     <ResponsiveContainer width={"100%"} height={200}>
                         <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="nombre" />
                             <YAxis />
                             <Tooltip />
                             <Legend />
                             <Bar dataKey="monto" fill="#F46D29" name="Monto" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                             <Bar dataKey="interes" fill="#3A5862" name="Interes" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                             <Bar dataKey="capital" fill="#34BDCF" name="Capital" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                         </BarChart>
                     </ResponsiveContainer>
                 </div>
                 <div class="flex flex-col justify-center items-center w-1/2">
                     <PieChart width={400} height={400}>
                         <Pie data={data} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel} name="interes"
                             outerRadius={120} fill="#8884d8" dataKey="interes" isAnimationActive={false}>
                             {data.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                         </Pie>
                         <Tooltip />
                     </PieChart>
                 </div>
             </div>
             <table class="w-screen text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-xs text-white font-medium uppercase bg-[#3A5862]">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-center">Nombre</th>
                            <th scope="col" class="px-6 py-3 text-center">Cedula</th>
                            <th scope="col" class="px-6 py-3 text-center">Capital</th>
                            <th scope="col" class="px-6 py-3 text-center">Tasa Nominal ( % )</th>
                            <th scope="col" class="px-6 py-3 text-center">Plazo</th>
                            <th scope="col" class="px-6 py-3 text-center">Tiempo ( Unidad )</th>
                            <th scope="col" class="px-6 py-3 text-center">Interes</th>
                            <th scope="col" class="px-6 py-3 text-center">Monto</th>
                            <div class="flex flex-row">
                            </div>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, i) => {
                            return (
                                <tr key={i + 1} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <td class="px-6 py-4 text-center">{item.nombre} </td>
                                    <td class="px-6 py-4 text-center">{item.cedula} </td>
                                    <td class="px-6 py-4 text-center">$ {item.capital} </td>
                                    <td class="px-6 py-4 text-center">{`${Math.floor( item.tasaNominal * 100)} ( % )`} </td>
                                    <td class="px-6 py-4 text-center">{item.plazo}</td>
                                    <td class="px-6 py-4 text-center">{item.unidad}</td>
                                    <td class="px-6 py-4 text-center">$ {item.interes.toFixed(2)} </td>
                                    <td class="px-6 py-4 text-center">$ {item.monto.toFixed(2)} </td>
                                </tr>
                            );
                        })};
                </tbody>
            </table>
            <Footer/>
        </div>
    );
}
export default InteresCompuesto;


