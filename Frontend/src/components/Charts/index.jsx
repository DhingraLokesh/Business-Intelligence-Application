import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getExcel } from "../../redux/slices/projectSlice";
import Select from "react-select";
import "./index.css";
import { Button, Form } from "react-bootstrap";
import {
  checkIsNaN,
  getFieldDataFromJSON,
  getPieChartData,
} from "../../utils/chartUtils";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import ColumnChart from "./ColumnChart";

const Charts = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const projectId = location.pathname.split("/")[2];
    dispatch(getExcel(projectId));
  }, [dispatch, location]);
  const [selectedChart, setSelectedChart] = useState("");
  const [selectedField, setSelectedField] = useState({ x: null, y: null });
  const [columnsOptions, setColumnsOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);

  const { excel } = useSelector((state) => state.project);
  const [isNumber, setIsNumber] = useState(null);

  const [chartData, setChartData] = useState(null);

  const chartOptions = [
    { value: "line", label: "Line Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "bar", label: "Bar Chart" },
    { value: "column", label: "Column Chart" },
  ];

  const handleChartChange = (selectedOption) => {
    setSelectedChart(selectedOption.value);
    setColumnsOptions(
      excel?.data?.length > 0 ? getColumnOptions(excel.data) : []
    );
    setLineOptions(excel?.data?.length > 0 ? getLineOptions(excel.data) : []);
    setIsNumber(checkIsNaN(excel.data));
  };

  const getColumnOptions = (data) => {
    return Object.keys(data[0])
      .slice(1)
      .map((key) => ({ value: key, label: key }));
  };


  const getLineOptions = (data) => {
    return Object.keys(data[0])
      .slice(1)
      .map((key) => ({ value: key, label: key }));
  };

  const handleFieldChange = (selectedOption, isX) => {
    isX
      ? setSelectedField({ ...selectedField, x: selectedOption })
      : setSelectedField({ ...selectedField, y: selectedOption });
  };

  const isPieChart = selectedChart === "pie";
  const xFieldOptions = selectedChart === "bar" ? columnsOptions : lineOptions;
  const yFieldOptions = selectedChart === "line" ? columnsOptions : lineOptions;

  const handleGenerateChart = () => {
    switch (selectedChart) {
      case "pie":
        const pieData = getPieChartData(excel.data, selectedField.x);
        setChartData({
          ...chartData,
          labels: pieData.keysArray,
          series: pieData.valuesArray,
        });
        break;
      case "line":
        const xDataLine = getFieldDataFromJSON(excel.data, selectedField.x);
        const yDataLine = getFieldDataFromJSON(excel.data, selectedField.y);

        setChartData({
          ...chartData,
          xFieldData: xDataLine,
          yFieldData: yDataLine,
          yField: selectedField.y,
        });
        break;
      case "bar":
        const xDataBar = getFieldDataFromJSON(excel.data, selectedField.x);
        const yDataBar = getFieldDataFromJSON(excel.data, selectedField.y);

        setChartData({
          ...chartData,
          xFieldData: xDataBar,
          yFieldData: yDataBar,
          yField: selectedField.y,
        });
        break;
      case "column":
        const xDataColumn = getFieldDataFromJSON(excel.data, selectedField.x);
        const yDataColumn = getFieldDataFromJSON(excel.data, selectedField.y);

        setChartData({
          ...chartData,
          xFieldData: xDataColumn,
          yFieldData: yDataColumn,
          yField: selectedField.y,
        });
        break;

      default:
        break;
    }
  };

  console.log(excel);
  console.log(isNumber);
  return (
    <div className="d-flex justify-content-between">
      <div>
        <label> Select Chart Type : </label>

        <Select
          value={chartOptions.find((option) => option.value === selectedChart)}
          options={chartOptions}
          onChange={handleChartChange}
          styles={{
            control: (provided) => ({
              ...provided,
              width: "250px",
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            menu: (base) => ({
              ...base,
              width: "200px",
            }),
          }}
        />
        {isPieChart
          ? selectedChart && (
              <div className="mt-3">
                <label>Selected Field : </label>
                <Select
                  className="mt-2"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: "250px",
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    menu: (base) => ({
                      ...base,
                      width: "200px",
                    }),
                  }}
                  value={xFieldOptions.find(
                    (option) => option.value === selectedField.x
                  )}
                  options={xFieldOptions}
                  onChange={(e) => {
                    handleFieldChange(e.value, true);
                  }}
                />
              </div>
            )
          : !isPieChart &&
            selectedChart && (
              <div className="mt-3">
                <label>Selected Field X : </label>
                <Select
                  className="mt-2"
                  menuPortalTarget={document.body}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: "250px", // Adjust the width as desired
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999, // Set a higher value if needed
                    }),
                    menu: (base) => ({
                      ...base,
                      width: "200px", // Adjust the width as desired
                    }),
                  }}
                  value={xFieldOptions.find(
                    (option) => option.value === selectedField.x
                  )}
                  options={xFieldOptions.filter((option) => {
                    return option.value !== selectedField.y;
                  })}
                  onChange={(e) => {
                    handleFieldChange(e.value, true);
                  }}
                />
                {selectedField.x && (
                  <div className="mt-3">
                    <label>Selected Field Y : </label>
                    <Select
                      className="mt-2"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          width: "250px", // Adjust the width as desired
                        }),
                      }}
                      value={yFieldOptions.find(
                        (option) => option.value === selectedField.y
                      )}
                      options={yFieldOptions.filter((option) => {
                        return (
                          option.value !== selectedField.x &&
                          isNumber.some((item) => item === option.value)
                        );
                      })}
                      onChange={(e) => {
                        handleFieldChange(e.value, false);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

        {selectedField.x && (
          <div className="mt-3">
            <Form.Label htmlFor="inputTitle">Enter Title :</Form.Label>
            <Form.Control
              type="text"
              id="inputTitle"
              value={chartData?.title || ""}
              onChange={(e) =>
                setChartData({
                  ...chartData,
                  title: e.target.value,
                })
              }
            />
          </div>
        )}

        <Button
          variant="primary"
          className="mt-3"
          size="sm"
          onClick={handleGenerateChart}
          disabled={
            (selectedChart === "pie" && selectedField.x === null) ||
            (selectedChart !== "pie" &&
              (selectedField.x === null || selectedField.y === null))
          }
        >
          Generate
        </Button>
      </div>
      <div
        style={{
          marginLeft: "35%",
        }}
      >
        {selectedChart === "pie"
          ? chartData &&
            chartData.labels &&
            chartData.series && (
              <PieChart labels={chartData.labels} series={chartData.series} />
            )
          : selectedChart === "line"
          ? chartData &&
            chartData.xFieldData &&
            chartData.yFieldData && (
              <LineChart
                xFieldData={chartData.xFieldData}
                yFieldData={chartData.yFieldData}
                yField={chartData?.yField || ""}
                title={
                  chartData?.title || `${selectedField.x} vs ${selectedField.y}`
                }
              />
            )
          : selectedChart === "bar"
          ? chartData &&
            chartData.xFieldData &&
            chartData.yFieldData && (
              <BarChart
                xFieldData={chartData.xFieldData}
                yFieldData={chartData.yFieldData}
                yField={chartData?.yField || ""}
                title={
                  chartData?.title || `${selectedField.x} vs ${selectedField.y}`
                }
              />
            )
          : selectedChart === "column"
          ? chartData &&
            chartData.xFieldData &&
            chartData.yFieldData && (
              <ColumnChart
                xFieldData={chartData.xFieldData}
                yFieldData={chartData.yFieldData}
                yField={chartData?.yField || ""}
                title={
                  chartData?.title || `${selectedField.x} vs ${selectedField.y}`
                }
              />
            )
          : null}
      </div>
    </div>
  );
};

export default Charts;
