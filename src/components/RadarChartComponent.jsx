import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Box, Card, VStack } from "@chakra-ui/react";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function RadarChartComponent(data) {
    const obj = {
        labels: Object.keys(data.prediction),
        datasets: [
            {
                data: Object.values(data.prediction),
                backgroundColor: "rgba(26, 32, 44, 0.9)",
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        pointRadius: 0.5,
        borderWidth: 5,
        scales: {
            r: {
                grid: {
                    color: "gray", // Set the grid line color (red with transparency)
                },
                angleLines: {
                  color: "gray", // Custom color for axis lines (blue with transparency)
                },
                ticks: {
                    display: false, // Hides the radial scale values (numbers)
                    stepSize: 20,   // Sets interval steps to structure the background layers
                },
                pointLabels: {
                    display: true,  
                    color: 'white'
                },
            },
        },
        plugins: {
            legend: { display: false },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <Card bg={"gray.800"} width={{ base: "auto", xl: "50%"}} p={5}>
            <Box mx={'auto'} width={{base: "400px", lg: "500px", xl: "400px"}} height={{base: "300px", lg: "400px", xl: "300px"}}>
                <Radar data={obj} options={options} />
            </Box>
        </Card>
    );
}

export default RadarChartComponent
