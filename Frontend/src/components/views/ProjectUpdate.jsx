import React, { useEffect, useState } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateUser } from "../../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import UserTable from "./UserTable";
import {
  addProjectUser,
  getAllUsersOfProject,
  getProjectById,
  updateProject,
} from "../../redux/slices/projectSlice";
import { getAllRequests, sendRequest } from "../../redux/slices/requestSlice";
import Loader from "../Loader";

const animatedComponents = makeAnimated();

function ProjectUpdate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const projectId = location.pathname.split("/")[2];
    token && dispatch(getAllUsersOfProject(projectId));
    token && dispatch(getProjectById(projectId));
    token && dispatch(getAllUsers());
    token && dispatch(getAllRequests());
  }, []);

  const [data, setData] = useState({
    projectId: "",
    name: "",
    description: "",
  });

  const { allUsers } = useSelector((state) => state.auth);
  const { currentProject, allProjectUsers } = useSelector(
    (state) => state.project
  );
  const { allRequests, sendRequestSlice } = useSelector(
    (state) => state.request
  );

  const [options, setOptions] = useState([]);
  const [addUser, setAddUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("viewer");

  useEffect(() => {
    setOptions(
      allUsers?.data
        ?.filter((user) => {
          const isUserInProject = allProjectUsers?.data?.some(
            (projUser) => projUser.user.id == user.id
          );
          const isUserInSentRequests = allRequests?.sentRequests?.some(
            (reqUser) => reqUser.to.id == user.id && reqUser.state == "pending"
          );
          return !isUserInProject && !isUserInSentRequests;
        })
        .map((user) => ({ value: user.id, label: user.username }))
    );
  }, [allUsers, allProjectUsers, allRequests]);

  useEffect(() => {
    setData({
      projectId: currentProject?.data?.id,
      name: currentProject?.data?.name,
      description: currentProject?.data?.description,
    });
  }, [currentProject]);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await dispatch(updateProject(data));

    if (resp.meta.requestStatus === "fulfilled") {
      window.location.reload();
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const resp = await dispatch(
      sendRequest({
        projectId: currentProject?.data?.id,
        receiver: addUser,
        role: selectedRole,
      })
    );

    if (resp.meta.requestStatus === "fulfilled") {
      window.location.reload();
    }
  };

  return (
    <>
      {allProjectUsers.loading ||
      currentProject.loading ||
      sendRequestSlice.loading ? (
        <Loader
          message={
            allProjectUsers.loadingMessage ||
            currentProject.loadingMessage ||
            sendRequestSlice.loadingMessage
          }
        />
      ) : (
        <Container fluid>
          <Row>
            <Col md="6">
              <Card className="mt-4">
                <Card.Header>
                  <Card.Title as="h4">Edit Project</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col className="pr-1" md="6">
                        <Form.Group>
                          <label>Name</label>
                          <Form.Control
                            defaultValue={data.name || ""}
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
                            defaultValue={data.description || ""}
                            name="description"
                            onChange={handleChange}
                            placeholder="Project Description"
                            rows="4"
                            as="textarea"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="mt-3 text-center">
                      <Button
                        className="btn-fill pull-right"
                        type="submit"
                        variant="success"
                      >
                        Update
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md="6">
              <Card className="card-user mt-4">
                <Card.Header>
                  <Card.Title as="h4">Add User</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: "60%",
                      }}
                    >
                      <Select
                        components={animatedComponents}
                        placeholder="Select User ..."
                        options={options}
                        onChange={(e) => {
                          setAddUser(e.value);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: "30%",
                      }}
                    >
                      <Select
                        components={animatedComponents}
                        defaultValue={{ label: "viewer", value: "viewer" }}
                        options={[
                          {
                            value: "commentor",
                            label: "commentor",
                          },
                          {
                            value: "editor",
                            label: "editor",
                          },
                          {
                            value: "viewer",
                            label: "viewer",
                          },
                        ]}
                        onChange={(e) => {
                          setSelectedRole(e.value);
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    className="btn-fill mt-3"
                    variant="success"
                    onClick={handleAddUser}
                  >
                    Add
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card className="card-user mt-4">
                <Card.Header>
                  <Card.Title as="h4">All Users</Card.Title>
                </Card.Header>
                <Card.Body>
                  <UserTable />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default ProjectUpdate;
