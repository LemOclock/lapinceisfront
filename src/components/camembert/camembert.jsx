import { Pie } from "react-chartjs-2";
import React from "react";
import { Chart, Tooltip, Legend, ArcElement } from "chart.js";
import data from "./camembertData";

Chart.register(Tooltip, Legend, ArcElement);




export default function Camembert() {

const options = {
}
    return (
        <Pie data={data} options={options} />    
    );


}