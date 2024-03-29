import React, { useState, useEffect } from "react";
import Comments from "../ProjectComponents/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../assets/css/styles.css";
import "../ProjectComponents/Projects/index.css";

import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import ColumnChart from "./ColumnChart";
import LineChart from "./LineChart";

import {
  getExcel,
  getProjectById,
  getProjectUser,
  updateProject,
} from "../../redux/slices/projectSlice";

import Select from "react-select";
import { Button, Form } from "react-bootstrap";
import {
  checkIsNaN,
  getFieldDataFromJSON,
  getDonutChartData,
} from "../../utils/chartUtils";
import { normalAlert } from "../../utils/Swal";

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const projectId = location.pathname.split("/")[2];

  const { excel, projectUser, currentProject } = useSelector(
    (state) => state.project
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");
  const [selectedField, setSelectedField] = useState({ x: null, y: null });
  const [options, setOptions] = useState([]);
  const [isNumber, setIsNumber] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [toShow, setToShow] = useState(true);

  // use effect for all dispatches
  useEffect(() => {
    dispatch(getExcel(projectId));
    dispatch(getProjectUser(projectId));
    dispatch(getProjectById(projectId));
  }, [dispatch, location, projectId]);

  // use effect for getting excel data
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

  //   use effect for getting the chart from backend
  useEffect(() => {
    if (currentProject?.data?.chart) {
      setSelectedChart(currentProject.data.chart.type);
      setSelectedField({
        x: currentProject.data.chart.xField,
        y: currentProject.data.chart.yField,
      });

      if (currentProject.data.chart.type === "donut") {
        const donutData = getDonutChartData(
          excel.data,
          currentProject.data.chart.xField
        );
        setChartData({
          ...chartData,
          labels: donutData.keysArray,
          series: donutData.valuesArray,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject.data]);

  useEffect(() => {
    if (selectedChart) {
      setToShow(false);
    }
  }, [selectedChart]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const chartOptions = [
    { value: "line", label: "Line Chart" },
    { value: "donut", label: "Donut Chart" },
    { value: "bar", label: "Bar Chart" },
    { value: "column", label: "Column Chart" },
  ];
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

    if (selectedChart === "donut") {
      const donutData = getDonutChartData(excel.data, selectedField.x);
      setChartData({
        ...chartData,
        labels: donutData.keysArray,
        series: donutData.valuesArray,
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

    let toCall = false;

    if (
      selectedChart !== currentProject?.data?.chart?.type ||
      selectedField.x !== currentProject?.data?.chart?.xField ||
      (selectedChart !== "donut" &&
        selectedField.y !== currentProject?.data?.chart?.yField) ||
      chartData?.title !== currentProject?.data?.chart?.title
    ) {
      toCall = true;
    }

    if (toCall) {
      const resp =
        selectedChart === "donut"
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

      if (resp.meta.requestStatus === "fulfilled") {
        normalAlert("Chart Saved !!", "", "success");
        dispatch(getProjectById(projectId));
      }
    }
  };

  const selectFieldStyle = {
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
  };

  return (
    <div className="container-fluid">
      <div>
        <div className="d-flex flex-row justify-content-between">
          <h2 className="m-1 mt-3">{currentProject?.data?.name}</h2>
          <div style={{ position: "relative" }}>
            <Button
              style={{ zIndex: 500 }}
              size="sm"
              className="mx-2 mt-3 dashboardButton"
              onClick={handleSidebarToggle}
            >
              Comments
            </Button>
            {isSidebarOpen && <Comments onClose={handleSidebarToggle} />}
            <Button
              className="mx-2 mt-3 dashboardButton"
              size="sm"
              onClick={() => {
                window.open(`/project/${projectId}/get-excel`, "_blank");
              }}
            >
              View Excel Data
            </Button>
            <Button
              className="mx-2 mt-3 dashboardButton"
              size="sm"
              onClick={() => navigate(`/project/${projectId}/edit`)}
            >
              {projectUser?.data?.role === "owner"
                ? "Edit Project"
                : "All Users"}
            </Button>
          </div>
        </div>
        <h6
          className="m-1"
          style={{
            maxWidth: "60%",
          }}
        >
          {currentProject?.data?.description}
        </h6>
      </div>
      {projectUser?.data?.role === "owner" ||
      projectUser?.data?.role === "editor" ? (
        <>
          <div className="d-flex" >
            <div style={{marginTop : "3%"}} className="col-md-3 bg-light mx-3">
              <div>
                <h4> Select Chart Type : </h4>

                <Select
                  value={chartOptions.find(
                    (option) => option.value === selectedChart
                  )}
                  options={chartOptions}
                  className="mt-2"
                  isDisabled={
                    projectUser?.data?.role === "commenter" ||
                    projectUser?.data?.role === "viewer"
                  }
                  onChange={handleChartChange}
                  styles={selectFieldStyle}
                />
                {selectedChart === "donut"
                  ? selectedChart && (
                      <div className="mt-3">
                        <label>Selected Field : </label>
                        <Select
                          className="mt-2"
                          styles={selectFieldStyle}
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
                  : !(selectedChart === "donut") &&
                    selectedChart && (
                      <div className="mt-3">
                        <label>Selected Field X : </label>
                        <Select
                          className="mt-2"
                          menuPortalTarget={document.body}
                          styles={selectFieldStyle}
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
                                  width: "250px",
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
                      style={{ width: "250px" }}
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
                {currentProject?.data?.chart?.user?.username && (
                  <div className="mt-3">
                    {selectedChart !== currentProject?.data?.chart?.type ||
                    selectedField.x !== currentProject?.data?.chart?.xField ||
                    (selectedChart !== "donut" &&
                      selectedField.y !==
                        currentProject?.data?.chart?.yField) ||
                    chartData?.title !== currentProject?.data?.chart?.title ? (
                      <div>
                        <p style={{ color: "red" }}>* Unsaved Changes</p>
                      </div>
                    ) : (
                      <div>
                        <span style={{ color: "green" }}>Last saved by : </span>
                        {currentProject?.data?.chart?.user?.id ===
                        projectUser?.data?.user ? (
                          <span style={{ color: "green" }}>You</span>
                        ) : (
                          <h6 style={{ color: "green" }}>
                            {currentProject?.data?.chart?.user?.username}
                          </h6>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="d-flex">
                  <Button
                    className="mt-3 dashboardButton"
                    size="sm"
                    onClick={handleGenerateChart}
                    disabled={
                      (selectedChart === "donut" && selectedField.x === null) ||
                      (selectedChart !== "donut" &&
                        (selectedField.x === null || selectedField.y === null))
                    }
                  >
                    Generate
                  </Button>
                  <Button
                    className="mt-3 mx-5 dashboardButton"
                    size="sm"
                    onClick={handleSaveChart}
                    disabled={
                      (selectedChart === "donut" && selectedField.x === null) ||
                      (selectedChart !== "donut" &&
                        (selectedField.x === null || selectedField.y === null))
                    }
                  >
                    Save Chart
                  </Button>
                </div>
              </div>
            </div>
            <div
              style={{
                marginLeft: "2%",
                width : "100%"
              }}
            >
              {toShow && (
                <h5
                  style={{
                    marginLeft: "5%",
                    marginTop: "1%",
                    marginBottom: "10%",
                  }}
                >
                  Select chart type and fields to generate chart !!
                </h5>
              )}

              {selectedChart === "donut"
                ? chartData &&
                  chartData.labels &&
                  chartData.series && (
                    <DonutChart
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
                        chartData?.title ||
                        `${selectedField.x} vs ${selectedField.y}`
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
                        chartData?.title ||
                        `${selectedField.x} vs ${selectedField.y}`
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
                        chartData?.title ||
                        `${selectedField.x} vs ${selectedField.y}`
                      }
                    />
                  )
                : null}
            </div>
          </div>
        </>
      ) : (
        <>
          {currentProject?.data?.chart?.type ? (
            <div className="d-flex mt-5">
              <div className="col-md-3 bg-light mx-3">
                <div>
                  <h3> Chart Details : </h3>
                  <p>Selected Chart : {selectedChart || ""} </p>
                  {selectedChart === "donut" ? (
                    <p>Selected Field : {selectedField?.x || ""}</p>
                  ) : (
                    <>
                      <p>Selected Field X-Axis : {selectedField?.x || ""}</p>
                      <p>Selected Field Y-Axis : {selectedField?.y || ""}</p>
                    </>
                  )}
                  {currentProject?.data?.chart?.user?.username && (
                    <p className="mt-3">
                      <span style={{ color: "green" }}>Last saved by : </span>
                      <span style={{ color: "green" }}>
                        {currentProject?.data?.chart?.user?.username}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div
                style={{
                  marginLeft: "2%",
                }}
              >
                {selectedChart === "donut"
                  ? chartData &&
                    chartData.labels &&
                    chartData.series && (
                      <DonutChart
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
                          chartData?.title ||
                          `${selectedField.x} vs ${selectedField.y}`
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
                          chartData?.title ||
                          `${selectedField.x} vs ${selectedField.y}`
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
                          chartData?.title ||
                          `${selectedField.x} vs ${selectedField.y}`
                        }
                      />
                    )
                  : null}
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <h2 className="mt-5">Chart Not Saved Yet !!</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default ProjectDashboard;
