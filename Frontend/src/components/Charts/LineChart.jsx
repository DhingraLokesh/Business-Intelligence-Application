import React from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = (props) => {
  const chartData = {
    series: [
      {
        name: props.yField,
        data: props.yFieldData,
      },
    ],
    options: {
      chart: {
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: props.title,
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: props.xFieldData,
      },
    },
  };

  return (
    <div className="p-3">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        width={600}
        height={320}
      />
    </div>
  );
};

export default LineChart;
