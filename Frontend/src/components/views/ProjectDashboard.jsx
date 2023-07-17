import React, { useState } from "react";
import Charts from "../Charts";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../assets/css/styles.css";
const ProjectDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[2];
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 bg-light">
          <Charts />
        </div>
        <div className="col-md-9">
          <div style={{ position: "relative" }}>
            <button
              style={{ zIndex: 500 }}
              className="btn btn-primary text-black"
              onClick={handleSidebarToggle}
            >
              Toggle Sidebar
            </button>
            {isSidebarOpen && <Comments onClose={handleSidebarToggle} />}
            <button
              className="m-2 btn btn-primary text-black"
              onClick={() => {
                window.open(`/project/${projectId}/get-excel`, "_blank");
              }}
            >
              View Excel Data
            </button>
            <button
              className="m-2 btn btn-primary text-black"
              onClick={() => navigate(`/project/${projectId}/edit`)}
            >
              Edit Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
