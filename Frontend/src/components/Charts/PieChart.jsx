import React from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = (props) => {
  const chartData = {
    series: props.series,
    options: {
      chart: {
        type: "donut",
      },
      labels: props.labels,
      responsive: [
        {
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="p-3">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        width={600}
        height={320}
      />
    </div>
  );
};

export default PieChart;
