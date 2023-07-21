import React, { useState } from "react";
import Comments from "../Comments";
import Charts from "../../Charts/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../../assets/css/styles.css";
import "./index.css";

const ProjectDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const projectId = location.pathname.split("/")[2];
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [toShow, setToShow] = useState(true);

  const { currentProject } = useSelector((state) => state.project);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-flex justify-content-between">
          <h2 className="m-1">{currentProject?.data?.name}</h2>
          {/* <h2 className="m-3">hi</h2> */}
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
              Edit Project
            </Button>
          </div>
        </div>
        <div className="d-flex">
          <div className="col-md-3 bg-light">
            <Charts setToShow={setToShow} />
          </div>
         {toShow && <h5 style={{
            marginLeft: "10%",
          }}>Select chart type and fields to generate chart !!</h5>}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
