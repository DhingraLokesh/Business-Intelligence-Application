import React, { useEffect, useState } from "react";
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getPublicUser,
  getPublicUserImage,
} from "../../redux/slices/authSlice";
import Loader from "../Loader";
import "../ProjectComponents/Projects/index.css";
import defaultAvatar from "../../assets/img/default-avatar.png";

function PublicProfile() {
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    city: "",
    about: "",
    image: "",
  });

  const { publicUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getPublicUser(userId));
    dispatch(getPublicUserImage(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    setData({
      firstName: publicUser?.data?.firstName,
      lastName: publicUser?.data?.lastName,
      username: publicUser?.data?.username,
      email: publicUser?.data?.email,
      city: publicUser?.data?.city,
      about: publicUser?.data?.about,
      image: publicUser?.image,
    });
  }, [publicUser]);

  return (
    <>
      {publicUser.loading ? (
        <Loader message={publicUser.loadingMessage} />
      ) : (
        <Container fluid>
          <Row>
            <Col md="8">
              <Card className="mt-4">
                <Card.Header>
                  <Card.Title as="h4">User Profile</Card.Title>
                </Card.Header>
                <Card.Body>
                  {
                    <Form>
                      <fieldset disabled={publicUser.loading}>
                        <Row>
                          <Col className="pr-1" md="5">
                            <Form.Group>
                              <label>Company</label>
                              <Form.Control
                                defaultValue="Argusoft India Ltd."
                                disabled
                                style={{
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  border: "1px solid #ccc",
                                }}
                                placeholder="Company"
                                type="text"
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col className="px-1" md="3">
                            <Form.Group>
                              <label>Username</label>
                              <Form.Control
                                value={data.username}
                                name="username"
                                placeholder="Username"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  border: "1px solid #ccc",
                                }}
                                type="text"
                                disabled
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col className="pl-1" md="4">
                            <Form.Group>
                              <label htmlFor="exampleInputEmail1">
                                Email address
                              </label>
                              <Form.Control
                                placeholder="Email"
                                name="email"
                                type="email"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  border: "1px solid #ccc",
                                }}
                                value={data.email}
                                required
                                disabled
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col className="pr-1" md="6">
                            <Form.Group>
                              <label>First Name</label>
                              <Form.Control
                                value={data.firstName}
                                placeholder="First Name"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  border: "1px solid #ccc",
                                }}
                                name="firstName"
                                type="text"
                                required
                                disabled
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col className="pl-1" md="6">
                            <Form.Group>
                              <label>Last Name</label>
                              <Form.Control
                                value={data.lastName}
                                name="lastName"
                                style={{
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  border: "1px solid #ccc",
                                }}
                                placeholder="Last Name"
                                type="text"
                                required
                                disabled
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col className="pr-1" md="4">
                            <Form.Group>
                              <label>City</label>
                              <Form.Control
                                value={data.city || ""}
                                style={{
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  border: "1px solid #ccc",
                                }}
                                placeholder="City"
                                name="city"
                                type="text"
                                disabled
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col md="12">
                            <Form.Group>
                              <label>About Me</label>
                              <Form.Control
                                cols="80"
                                value={data.about || ""}
                                name="about"
                                style={{
                                  resize: "none",
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  height: "100px",
                                  border: "1px solid #ccc",
                                }}
                                placeholder="Tell us about yourself !!"
                                rows="4"
                                as="textarea"
                                disabled
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                      </fieldset>
                    </Form>
                  }
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="card-user mt-4">
                <Card.Body>
                  <div className="author text-center">
                    <img
                      alt="..."
                      className="avatar border-gray rounded-circle"
                      src={publicUser?.image || defaultAvatar}
                      style={{ width: "210px", height: "230px" }}
                    />
                    <h5 className="title mt-3">
                      {(publicUser?.data?.firstName || "") +
                        " " +
                        (publicUser?.data?.lastName || "")}
                    </h5>
                    <p className="description">
                      {publicUser?.data?.username || ""}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default PublicProfile;
