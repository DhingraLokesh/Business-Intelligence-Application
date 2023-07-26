import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = (props) => {
  const chartData = {
    series: [
      {
        data: props.yFieldData,
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      title: {
        text: props.title,
        align: "left",
        style: {
          fontSize: "20px",
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
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
        type="bar"
        width={600}
        height={320}
      />
    </div>
  );
};

export default BarChart;
