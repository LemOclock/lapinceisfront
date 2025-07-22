import { Doughnut } from "react-chartjs-2";
import React from "react";
import { Chart, Tooltip, Legend, ArcElement } from "chart.js";
import Data from "./doughnutData";
import { useEffect, useState } from "react";

Chart.register(Tooltip, Legend, ArcElement);




export default function Doughnut() {
const data = Data();


const [legendPosition, setLegendPosition] = useState('right');
  
  // Fonction pour vérifier la taille de l'écran
  const checkScreenSize = () => {
    setLegendPosition(window.innerWidth < 600 ? 'bottom' : 'right');
  };

  useEffect(() => {
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);


    const options = {
        plugins: {
            legend: {
                display: true,
                position : legendPosition,
                labels: {
                    // Personnalisation des labels
                    usePointStyle: true, // Utilise des cercles au lieu de rectangles
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 16,
                        family: "'RocaRegular', 'Arial', sans-serif",
                    },
                    generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map(function(label, i) {
                                const meta = chart.getDatasetMeta(0);
                                const style = meta.controller.getStyle(i);
                                
                                // Formater les valeurs
                                const value = chart.data.datasets[0].data[i];
                                const formattedValue = value.toLocaleString('fr-FR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }) + ' €';
                                
                                return {
                                    text: `${label}: ${formattedValue}`,
                                    fillStyle: style.backgroundColor,
                                    strokeStyle: style.borderColor,
                                    lineWidth: style.borderWidth,
                                };
                            });
                        }
                        return [];
                    }
                },
            },
        }
    }
    return (
        <Doughnut data={data} options={options} />
    );


}