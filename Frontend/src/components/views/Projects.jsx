import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import "../../assets/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjectsOfUser } from "../../redux/slices/projectSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUserProjects } = useSelector((state) => state.project);

  const [isMyProjects, setIsMyProjects] = useState(true);

  useEffect(() => {
    dispatch(getAllProjectsOfUser());
  }, []);

  return (
    <>
      <div className="mt-3">
        <Container fluid>
          <div className="d-flex justify-content-between">
            <h3 className="text-center">
              {isMyProjects ? "My Projects" : "Other Projects"}
            </h3>
            <Button
              variant="primary"
              size="sm"
              className="ml-3"
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
              <Row>
                {allUserProjects?.data
                  ?.filter((projUser) => {
                    if (isMyProjects) {
                      return projUser.role === "owner";
                    } else {
                      return projUser.role !== "owner";
                    }
                  })
                  ?.map((projUser) => (
                    <Col className="mt-3">
                      <Card style={{ width: "15rem", height: "13rem" }}>
                        <Card.Body>
                          <Card.Title>{projUser.project.name}</Card.Title>
                          {!isMyProjects && (
                            <Card.Subtitle className="mt-2 mb-2 text-muted">
                              owner: {projUser?.project?.owner?.username}
                            </Card.Subtitle>
                          )}
                          <Card.Subtitle className="mt-2 mb-2 text-muted">
                            {!isMyProjects && "you:"} {projUser.role}
                          </Card.Subtitle>
                          <Card.Text>
                            {projUser.project.description.slice(0, 30)}
                            {projUser.project.description.length > 30
                              ? "..."
                              : ""}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              navigate(
                                `/project/${projUser.project.id}/dashboard`
                              );
                            }}
                          >
                            View
                          </Button>
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
                    {isMyProjects
                      ? "You have no projects"
                      : "No other projects"}
                  </h5>
                </div>
              ) : null}
            </>
          )}
        </Container>
      </div>
    </>
  );
}

export default Projects;
