import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getExcel,
  getProjectById,
  getProjectUser,
  updateProject,
} from "../../redux/slices/projectSlice";
import Select from "react-select";
import "./index.css";
import "../ProjectComponents/Projects/index.css";
import { Button, Form } from "react-bootstrap";
import {
  checkIsNaN,
  getFieldDataFromJSON,
  getPieChartData,
} from "../../utils/chartUtils";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import ColumnChart from "./ColumnChart";

const Charts = ({ setToShow }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const projectId = location.pathname.split("/")[2];
    dispatch(getExcel(projectId));
    dispatch(getProjectUser(projectId));
    dispatch(getProjectById(projectId));
  }, [dispatch, location]);

  const [selectedChart, setSelectedChart] = useState("");
  const [selectedField, setSelectedField] = useState({ x: null, y: null });
  const [options, setOptions] = useState([]);

  const { excel, projectUser, currentProject } = useSelector(
    (state) => state.project
  );
  const [isNumber, setIsNumber] = useState(null);

  const [chartData, setChartData] = useState(null);

  const chartOptions = [
    { value: "line", label: "Line Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "bar", label: "Bar Chart" },
    { value: "column", label: "Column Chart" },
  ];

  useEffect(() => {
    if (excel.data?.length > 0) {
      setOptions(
        Object.keys(excel.data[0])
          .slice(1)
          .map((key) => ({ value: key, label: key }))
      );
      setIsNumber(checkIsNaN(excel.data));
    }
  }, [excel]);

  useEffect(() => {
    if (currentProject?.data?.chart) {
      setSelectedChart(currentProject.data.chart.type);
      setSelectedField({
        x: currentProject.data.chart.xField,
        y: currentProject.data.chart.yField,
      });

      if (currentProject.data.chart.type === "pie") {
        const pieData = getPieChartData(
          excel.data,
          currentProject.data.chart.xField
        );
        setChartData({
          ...chartData,
          labels: pieData.keysArray,
          series: pieData.valuesArray,
          title: currentProject.data.chart.title,
        });
      } else {
        const xDataLine = getFieldDataFromJSON(
          excel.data,
          currentProject.data.chart.xField
        );
        const yDataLine = getFieldDataFromJSON(
          excel.data,
          currentProject.data.chart.yField
        );

        setChartData({
          ...chartData,
          xFieldData: xDataLine,
          yFieldData: yDataLine,
          yField: selectedField.y,
          title: currentProject.data.chart.title,
        });
      }
    }
  }, [currentProject.data]);

  const handleChartChange = (selectedOption) => {
    setSelectedChart(selectedOption.value);
  };

  const handleFieldChange = (selectedOption, isX) => {
    isX
      ? setSelectedField({ ...selectedField, x: selectedOption })
      : setSelectedField({ ...selectedField, y: selectedOption });
  };

  const handleGenerateChart = () => {
    setToShow(false);

    if (selectedChart === "pie") {
      const pieData = getPieChartData(excel.data, selectedField.x);
      setChartData({
        ...chartData,
        labels: pieData.keysArray,
        series: pieData.valuesArray,
      });
    } else {
      const xData = getFieldDataFromJSON(excel.data, selectedField.x);
      const yData = getFieldDataFromJSON(excel.data, selectedField.y);

      setChartData({
        ...chartData,
        xFieldData: xData,
        yFieldData: yData,
        yField: selectedField.y,
      });
    }
  };

  const handleSaveChart = async () => {
    const projectId = location.pathname.split("/")[2];

    const resp =
      selectedChart === "pie"
        ? await dispatch(
            updateProject({
              projectId,
              chart: {
                type: selectedChart,
                title: chartData?.title || `${selectedField.x}`,
                xField: selectedField.x,
                yField: null,
              },
            })
          )
        : await dispatch(
            updateProject({
              projectId,
              chart: {
                type: selectedChart,
                title:
                  chartData?.title ||
                  `${selectedField.x} vs ${selectedField.y}`,
                xField: selectedField.x,
                yField: selectedField.y,
              },
            })
          );

    if (resp.meta.requestStatus === "fulfilled")
      dispatch(getProjectById(projectId));
  };

  return (
    <div className="d-flex justify-content-between mt-3">
      <div>
        <label> Select Chart Type : </label>

        <Select
          value={chartOptions.find((option) => option.value === selectedChart)}
          options={chartOptions}
          className="mt-2"
          isDisabled={
            projectUser?.data?.role === "commenter" ||
            projectUser?.data?.role === "viewer"
          }
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
        {selectedChart === "pie"
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
                  value={options.find(
                    (option) => option.value === selectedField.x
                  )}
                  options={options}
                  onChange={(e) => {
                    handleFieldChange(e.value, true);
                  }}
                />
              </div>
            )
          : !(selectedChart === "pie") &&
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
                  value={options.find(
                    (option) => option.value === selectedField.x
                  )}
                  options={options.filter((option) => {
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
                      value={options.find(
                        (option) => option.value === selectedField.y
                      )}
                      options={options.filter((option) => {
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

        <div className="d-flex justify-content-around">
          <Button
            className="mt-3 dashboardButton"
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
          <Button
            className="mt-3 dashboardButton"
            size="sm"
            onClick={handleSaveChart}
            disabled={
              (selectedChart === "pie" && selectedField.x === null) ||
              (selectedChart !== "pie" &&
                (selectedField.x === null || selectedField.y === null))
            }
          >
            Save Chart
          </Button>
        </div>
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
              <PieChart
                title={chartData?.title || `${selectedField.x}`}
                labels={chartData.labels}
                series={chartData.series}
              />
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
