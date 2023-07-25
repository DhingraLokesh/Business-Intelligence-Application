import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import "../../../assets/css/styles.css";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjectsOfUser } from "../../../redux/slices/projectSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";
import { getUser } from "../../../redux/slices/authSlice";

function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUserProjects } = useSelector((state) => state.project);

  const [isMyProjects, setIsMyProjects] = useState(true);

  useEffect(() => {
    dispatch(getAllProjectsOfUser());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className="mt-3">
      <Container fluid>
        <div className="d-flex justify-content-between">
          <h3 className="text-center">
            {isMyProjects ? "My Projects" : "Other Projects"}
          </h3>
          <Button
            variant="primary"
            size="sm"
            className="ml-3 dashboardButton"
            onClick={() => setIsMyProjects(!isMyProjects)}
          >
            {isMyProjects ? "Other Projects" : "My Projects"}
          </Button>
        </div>
        <br />
        {allUserProjects.loading ? (
          <Loader message={allUserProjects.loadingMessage} />
        ) : (
          <>
            <Row className="d-flex">
              {allUserProjects?.data
                ?.filter((projUser) => {
                  if (isMyProjects) {
                    return projUser.role === "owner";
                  } else {
                    return projUser.role !== "owner";
                  }
                })
                ?.map((projUser) => (
                  <Col className="col-3 mt-3">
                    <Card
                      className="card1"
                      style={ isMyProjects ? {
                        height: "90%",
                        width: "15rem",
                      } : {
                        height: "90%",
                        width: "15rem",
                      }}
                    >
                      <Card.Body>
                        <Card.Title
                          className="text1"
                          style={{
                            fontSize: "20px",
                          }}
                        >
                          {projUser.project.name}
                        </Card.Title>
                        {!isMyProjects && (
                          <Card.Subtitle className="text1 small mt-2 mb-2">
                            owner: {projUser?.project?.owner?.username}
                          </Card.Subtitle>
                        )}
                        <Card.Subtitle className="text1 small mt-2 mb-2">
                          {!isMyProjects && "you:"} {projUser.role}
                        </Card.Subtitle>
                        <p
                          className="text2"
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          {projUser.project.description.slice(0, 20)}
                          {projUser.project.description.length > 20
                            ? "..."
                            : ""}
                        </p>
                        <div className="go-corner">
                          <p className="go-arrow"></p>
                        </div>
                      </Card.Body>
                      <Card.Footer
                        style={{
                          marginTop: "auto",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <span>
                          <Button
                            className="but"
                            size="sm"
                            onClick={() => {
                              navigate(
                                `/project/${projUser.project.id}/dashboard`
                              );
                            }}
                          >
                            View
                          </Button>
                          <Button
                            className="but mx-2"
                            size="sm"
                            onClick={() => {
                              navigate(`/project/${projUser.project.id}/edit`);
                            }}
                          >
                            Users
                          </Button>
                        </span>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
            </Row>
            {(isMyProjects &&
              allUserProjects?.data?.filter(
                (projUser) => projUser.role === "owner"
              ).length === 0) ||
            (!isMyProjects &&
              allUserProjects?.data?.filter(
                (projUser) => projUser.role !== "owner"
              ).length === 0) ? (
              <div className="d-flex justify-content-center mt-3">
                <h5 className="text-center">
                  {isMyProjects ? "You have no projects" : "No other projects"}
                </h5>
              </div>
            ) : null}
          </>
        )}
      </Container>
    </div>
  );
}

export default Projects;
