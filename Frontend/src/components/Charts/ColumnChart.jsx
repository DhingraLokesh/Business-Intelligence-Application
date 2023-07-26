import React from "react";
import ReactApexChart from "react-apexcharts";

const ColumnChart = (props) => {
  const chartData = {
    series: [
      {
        name: props.yField,
        data: props.yFieldData,
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: props.xFieldData,
      },
      title: {
        text: props.title,
        align: "left",
        style: {
          fontSize: "20px",
        }
      },
      fill: {
        opacity: 1,
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

export default ColumnChart;
