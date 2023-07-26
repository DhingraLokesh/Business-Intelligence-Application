import React, { useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProject, uploadExcel } from "../../../redux/slices/projectSlice";
import { hasNullOrUndefinedEmptyString } from "../../../utils/chartUtils";
import Loader from "../../Loader";
import { normalAlert } from "../../../utils/Swal";
import "./index.css";

function ProjectCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { newProject } = useSelector((state) => state.project);

  const [excelShowData, setExcelShowData] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
  });

  const handleFileUpload = (event) => {
    if (event.target.files?.length === 0) return;

    const fileObj = event.target.files[0];
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const { rows } = resp;

        if (hasNullOrUndefinedEmptyString(rows)) {
          normalAlert(
            "Upload another file !!",
            "Uploaded file contains null, undefined, or empty string fields.",
            "error"
          );

          return;
        }

        setExcelShowData(rows.slice(0, 6));
        setExcelData(fileObj);
      }
    });
  };

  const handleChange = ({ currentTarget: input }) => {
    setProjectData({ ...projectData, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp1 = await dispatch(createProject(projectData));
    const formData = new FormData();
    formData.append("file", excelData);
    const resp2 = await dispatch(
      uploadExcel({ formData, projectId: resp1.payload.id })
    );

    if (
      resp1.meta.requestStatus === "fulfilled" &&
      resp2.meta.requestStatus === "fulfilled"
    ) {
      navigate(`/project/${resp1.payload.id}/dashboard`);
    }
  };

  return (
    <>
      {newProject.loading ? (
        <Loader message={newProject.loadingMessage} />
      ) : (
        <Container fluid>
          <Row>
            <Col md="8" className="mx-auto">
              <Card className="mt-4">
                <Card.Header>
                  <Card.Title as="h4">Create Project</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col className="pr-1" md="6">
                        <Form.Group>
                          <label>Name</label>
                          <Form.Control
                            className="mt-1"
                            value={projectData.name || ""}
                            placeholder="Project Name"
                            name="name"
                            onChange={handleChange}
                            type="text"
                            required
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md="12">
                        <Form.Group>
                          <label>Description</label>
                          <Form.Control
                            cols="80"
                            className="mt-1"
                            value={projectData.description || ""}
                            name="description"
                            onChange={handleChange}
                            placeholder="Project Description"
                            rows="4"
                            as="textarea"
                            required
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md="12">
                        <Form.Group>
                          <label>Excel File</label>
                          <Form.Control
                            type="file"
                            className="mt-1"
                            required
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {excelShowData && (
                      <Row className="mt-3 overflow-auto">
                        <Col md="12">
                          <Table striped bordered>
                            <thead>
                              <tr>
                                {excelShowData[0].map((column, columnIndex) => (
                                  <th key={columnIndex}>{column}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {excelShowData.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    )}

                    <div className="mt-3 text-center">
                      <Button
                        className="btn-fill pull-right dashboardButton"
                        type="submit"
                        variant="success"
                        disabled={
                          !excelData ||
                          !projectData.name ||
                          !projectData.description
                        }
                      >
                        Create
                      </Button>
                    </div>
                  </Form>
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
