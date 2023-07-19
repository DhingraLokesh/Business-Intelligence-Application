import React, { useState } from "react";
import Charts from "../Charts";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
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
        <div className="d-flex justify-content-between">
          <h2 className="m-3">Chart Section</h2>
          <div style={{ position: "relative" }}>
            <Button
              style={{ zIndex: 500 }}
              variant="primary"
              size="sm"
              className="mx-2 mt-3"
              onClick={handleSidebarToggle}
            >
              Comments
            </Button>
            {isSidebarOpen && <Comments onClose={handleSidebarToggle} />}
            <Button
              variant="primary"
              className="mx-2 mt-3"
              size="sm"
              onClick={() => {
                window.open(`/project/${projectId}/get-excel`, "_blank");
              }}
            >
              View Excel Data
            </Button>
            <Button
              variant="primary"
              className="mx-2 mt-3"
              size="sm"
              onClick={() => navigate(`/project/${projectId}/edit`)}
            >
              Edit Project
            </Button>
          </div>
        </div>
        <div className="col-md-3 bg-light">
          <Charts />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
