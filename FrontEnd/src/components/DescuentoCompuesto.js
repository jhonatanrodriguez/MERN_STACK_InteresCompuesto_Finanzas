import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
const COLORS = ["#F46D29", "#3A5862", "#34BDCF", "#C9CCCC", "#949190", "#3A5862"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
function DescuentoCompuesto() {
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);

    const dataFetch = async () => {
        try {
            const response = await fetch("http://localhost:3000/descom");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error(error);
        }
    };

    const dataFetch2 = async () => {
        try {
            const response = await fetch("http://localhost:3000/valpre");
            const result = await response.json();
            setData2(result);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        dataFetch();
        dataFetch2();
    }, []);
    return (
        <div>
            <NavBar />
            <div class="flex flex-row bg-gray-100 ">
                <div class="m-4">
                    <h1 class="text-gray-500 text-5xl font-bold">DESCUENTO</h1>
                    <h1 class="text-[#949190] text-3xl">COMPUESTO</h1>
                </div>
                <div class="text-[#34BDCF] text-8xl font-extrabold flex flex-row items-start justify-start">
                    <h1>4</h1>
                </div>
            </div>
            <div class="flex flex-row justify-center bg-blue-50">
                <div class="flex flex-col justify-center items-center w-3/4 pl-10">
                              <h1 class="mb-5 font-semibold text-[#3A5862] ">VALORES PRESENTES VS TIEMPO</h1>
                     <ResponsiveContainer width={"100%"} height={200}>
                         <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="año" />
                             <YAxis />
                             <Tooltip />
                             <Legend />
                             <Bar dataKey="resultado" fill="#F46D29" name="valores Presentes por cada periodo" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div class="flex flex-col justify-center items-center w-1/2">
                    <PieChart width={400} height={400}>
                        <Pie data={data} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel} name="Valor Presente"
                            outerRadius={120} fill="#8884d8" dataKey="resultado" isAnimationActive={false}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>
            <div class="flex flex-row">
                    <table class="w-screen text-sm text-center rtl:text-right text-gray-500 ">
                        <thead class="text-xs text-white font-medium uppercase bg-[#3A5862]">
                            <tr>
                                <th scope="col" class="px-6 py-3">Banco</th>
                                <th scope="col" class="px-6 py-3">Inversion</th>
                                <th scope="col" class="px-6 py-3">Tasa Nominal</th>
                                <th scope="col" class="px-6 py-3">Monto</th>
                                <th scope="col" class="px-6 py-3">Valores Presentes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, i) => {
                                return (
                                    <tr key={i + 1} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td class="px-6 py-4">{item.nombreBanco} </td>
                                        <td class="px-6 py-4">$ {item.inversion}</td>
                                        <td class="px-6 py-4">{`${Math.floor(item.tasaNominal * 100)} ( % )`}</td>
                                        <td class="px-6 py-4">$ {item.monto}</td>
                                        <td class="px-6 py-4">$ {item.resultado.toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            </div>
            <div class="flex flex-row">
                <div class="flex flex-row w-[73%] justify-end items-center mr-5">
                    <p>Suma de valores presentes:</p>
                </div>
                <div class="flex flex-row w-[27%]">
                    <table class="w-screen text-sm text-center rtl:text-right text-gray-500">
                        <thead class="text-xs text-white font-medium uppercase bg-[#3A5862]">
                            <tr>
                                <th scope="col" class=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data2?.map((item, i) => {
                                return (
                                    <tr key={i + 1} class="bg-white border-b dark:bg-gray-800 border-gray-200">
                                        <td class="px-6 py-4">$ {item.sumaValoresPresentes.toFixed(2)} </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
            </div>
            <Footer />
        </div>
    );
}
export default DescuentoCompuesto;