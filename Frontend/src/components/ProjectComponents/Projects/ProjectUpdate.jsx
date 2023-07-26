/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getAllUsers } from "../../../redux/slices/authSlice";
import {
  getAllUsersOfProject,
  getProjectById,
  getProjectUser,
  updateProject,
} from "../../../redux/slices/projectSlice";
import {
  getAllRequests,
  sendRequest,
} from "../../../redux/slices/requestSlice";
import UserTable from "./AllUsersTable";
import socket from "../../../utils/socket";
import Loader from "../../Loader";
import ButtonLoader from "../../Loader/ButtonLoader";
import { normalAlert } from "../../../utils/Swal";
import "./index.css";

const animatedComponents = makeAnimated();

function ProjectUpdate() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [toReload, setToReload] = useState(true);
  const [options, setOptions] = useState([]);
  const [addUser, setAddUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [data, setData] = useState({
    projectId: "",
    name: "",
    description: "",
  });

  const { allUsers } = useSelector((state) => state.auth);
  const { currentProject, allProjectUsers, projectUser, editProject } =
    useSelector((state) => state.project);
  const { allRequests, sendRequestSlice } = useSelector(
    (state) => state.request
  );

  useEffect(() => {
    const projectId = location.pathname.split("/")[2];
    dispatch(getAllUsersOfProject(projectId));
    dispatch(getProjectById(projectId));
    dispatch(getProjectUser(projectId));
    dispatch(getAllUsers());
    dispatch(getAllRequests());
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [dispatch, location.pathname]);

  useEffect(() => {
    setOptions(
      allUsers?.data
        ?.filter((user) => {
          const isUserInProject = allProjectUsers?.data?.some(
            (projUser) => projUser.user.id == user.id
          );
          const isUserInSentRequests = allRequests?.sentRequests?.some(
            (reqUser) =>
              reqUser.to.id == user.id &&
              reqUser.state == "pending" &&
              reqUser.project.id == currentProject?.data?.id
          );
          return !isUserInProject && !isUserInSentRequests;
        })
        .map((user) => ({ value: user.id, label: user.username }))
    );
  }, [allUsers, allProjectUsers, allRequests, currentProject?.data?.id]);

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
    if (
      currentProject?.data?.name === data?.name &&
      currentProject?.data?.description === data?.description
    ) {
      return;
    }
    if (data?.description?.length < 3 || data?.descrpition?.length > 100) {
      normalAlert(
        "Error!",
        `description length should be between 3 and 100 characters. Current length is ${data?.description?.length}`,
        "error"
      );
      return;
    }
    const resp = await dispatch(updateProject(data));

    if (resp.meta.requestStatus === "fulfilled") {
      normalAlert("Project Details Updated !", "", "success");
      setToReload(false);
      dispatch(getProjectById(data.projectId));
    }
  };

  const handleAddUser = async (e) => {
    e?.preventDefault();
    const resp = await dispatch(
      sendRequest({
        projectId: currentProject?.data?.id,
        receiver: addUser?.value,
        role: selectedRole,
      })
    );

    if (resp.meta.requestStatus === "fulfilled") {
      normalAlert("Request Sent !", "", "success");
      setAddUser(null);
      dispatch(getAllRequests());
    }
  };

  return (
    <>
      {(allProjectUsers.loading || currentProject.loading) && toReload ? (
        <Loader
          message={
            allProjectUsers.loadingMessage || currentProject.loadingMessage
          }
        />
      ) : (
        <Container fluid>
          {projectUser?.data?.role === "owner" ? (
            <Row>
              <Col md="6">
                <Card className="mt-4">
                  <Card.Header>
                    <Card.Title as="h4">Edit Project</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <fieldset disabled={editProject.loading}>
                        <Row>
                          <Col className="pr-1" md="6">
                            <Form.Group>
                              <label>Name</label>
                              <Form.Control
                                value={data.name || ""}
                                placeholder="Project Name"
                                name="name"
                                onChange={handleChange}
                                type="text"
                                disabled={projectUser?.data?.role !== "owner"}
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
                                value={data.description || ""}
                                name="description"
                                onChange={handleChange}
                                placeholder="Project Description"
                                rows="4"
                                as="textarea"
                                disabled={projectUser?.data?.role !== "owner"}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="mt-3 text-center">
                          <Button
                            className="btn-fill pull-right dashboardButton"
                            type="submit"
                            variant="success"
                            disabled={projectUser?.data?.role !== "owner"}
                          >
                            Update
                            {editProject.loading && <ButtonLoader />}
                          </Button>
                        </div>
                      </fieldset>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="6">
                <Card className="card-user mt-4">
                  <Card.Header>
                    <Card.Title as="h4">Add User</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Send request to user to join project
                    </Card.Subtitle>
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
                          value={addUser}
                          isDisabled={
                            projectUser?.data?.role !== "owner" ||
                            sendRequestSlice.loading
                          }
                          onChange={(e) => setAddUser(e)}
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
                          isDisabled={
                            projectUser?.data?.role !== "owner" ||
                            sendRequestSlice.loading
                          }
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
                      className="btn-fill mt-3 dashboardButton"
                      variant="success"
                      onClick={() => {
                        if (projectUser?.data?.role === "owner")
                          handleAddUser();
                      }}
                      disabled={projectUser?.data?.role !== "owner" || !addUser}
                    >
                      Send
                      {sendRequestSlice.loading && <ButtonLoader />}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col md="12">
              <Card className="card-user mt-4">
                <Card.Header>
                  <Card.Title as="h4">All Users</Card.Title>
                </Card.Header>
                <Card.Body>
                  <UserTable setToReload={setToReload} />
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
