import React from "react";
import ReactApexChart from "react-apexcharts";

const DonutChart = (props) => {
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
      title : {
        text: props.title,
        align : "left"
      }
    },
  };

  return (
    <div className="p-3">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        title={chartData.title}
        type="donut"
        width={600}
        height={320}
      />
    </div>
  );
};

export default DonutChart;
