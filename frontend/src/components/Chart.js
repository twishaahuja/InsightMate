import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ChartComponent = ({ chartData }) => {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Values',
                data: chartData.data,
                backgroundColor: 'rgba(245, 222, 179, 0.8)', // Beige
                borderColor: 'rgba(218, 165, 32, 1)', // Darker beige border
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    color: 'rgba(0, 0, 0, 0.8)', // Darker text color
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    color: 'rgba(0, 0, 0, 0.8)', // Darker text color
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.dataset.label + ': ' + tooltipItem.formattedValue;
                    }
                }
            }
        },
    };

    return (
        <div style={{ height: '250px', width: '600px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ChartComponent;
