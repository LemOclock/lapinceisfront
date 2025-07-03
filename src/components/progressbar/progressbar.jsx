import { Bar } from "react-chartjs-2";
import React from "react";
import { Chart, Tooltip, Legend, BarElement, CategoryScale, LinearScale, scales, plugins } from "chart.js";
import data from "./progressbarData";

Chart.register(Tooltip, Legend, BarElement, CategoryScale, LinearScale);




export default function ProgressBar() {

    const options = {
        indexAxis: 'y',
        plugins: {
        legend: {
            display: false,
        },
    },
        scales: {
            y: {
                display: false,
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false,
                }
            },
            x: {
                display: false,
                grid: {
                    drawOnChartArea: false,
                }
            }
        },
    }
    return (
        <Bar data={data} options={options} />
    );


}