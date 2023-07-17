import React, { useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getProjectById, getExcel } from "../../redux/slices/projectSlice";
import JSONData from "./JSONData";
import { useLocation } from "react-router-dom";
import Loader from "../Loader";

function ProjectCreate() {
  const location = useLocation();
  useEffect(() => {
    const projectId = location.pathname.split("/")[2];
    dispatch(getProjectById(projectId));
    dispatch(getExcel(projectId));
  }, []);

  const dispatch = useDispatch();
  const { excel } = useSelector((state) => state.project);

  return (
    <>
      {excel.loading ? (
        <Loader message={excel.loadingMessage} />
      ) : (
        <Container fluid>
          <Row>
            <Col md="8" className="mx-auto">
              <Card className="mt-4">
                <Card.Header>
                  <Card.Title as="h4">Excel Data</Card.Title>
                </Card.Header>
                <Card.Body>
                  <JSONData data={excel?.data} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default ProjectCreate;
