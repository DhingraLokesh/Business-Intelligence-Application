import React, { useEffect, useState } from "react";
import defaultAvatar from "../../assets/img/default-avatar.png";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getImage,
  getUser,
  updateUser,
  uploadImage,
} from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [finalFile, setFinalFile] = useState(null);
  const [isImage, setIsImage] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    city: "",
    country: "",
    pinCode: "",
    about: "",
  });

  const { user, userImage } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getImage());
  }, []);

  useEffect(() => {
    setData({
      firstName: user?.data?.firstName,
      lastName: user?.data?.lastName,
      username: user?.data?.username,
      email: user?.data?.email,
      address: user?.data?.address,
      city: user?.data?.city,
      country: user?.data?.country,
      pinCode: user?.data?.pinCode,
      about: user?.data?.about,
    });
  }, [user]);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0].type.includes("image")) {
      setIsImage(true);
      setFile(URL.createObjectURL(e.target.files[0]));
      setFinalFile(e.target.files[0]);
    } else {
      setIsImage(false);
      setFile(null);
      alert("Please upload image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await dispatch(updateUser(data));

    if (resp.meta.requestStatus === "fulfilled") {
      window.location.reload();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", finalFile);
    const resp = await dispatch(uploadImage(formData));

    if (resp.meta.requestStatus === "fulfilled") {
      window.location.reload();
    }
  };

  return (
    <>
      {user.loading ? (
        <Loader message={user.loadingMessage} />
      ) : (
        <Container fluid>
          <Row>
            <Col md="8">
              <Card>
                <Card.Header>
                  <Card.Title as="h4">Edit Profile</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col className="pr-1" md="5">
                        <Form.Group>
                          <label>Company</label>
                          <Form.Control
                            defaultValue="Argusoft India Ltd."
                            disabled
                            placeholder="Company"
                            type="text"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="px-1" md="3">
                        <Form.Group>
                          <label>Username</label>
                          <Form.Control
                            defaultValue={data.username}
                            name="username"
                            onChange={handleChange}
                            placeholder="Username"
                            type="text"
                            required
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
                            onChange={handleChange}
                            type="email"
                            defaultValue={data.email}
                            required
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col className="pr-1" md="6">
                        <Form.Group>
                          <label>First Name</label>
                          <Form.Control
                            defaultValue={data.firstName}
                            placeholder="First Name"
                            name="firstName"
                            onChange={handleChange}
                            type="text"
                            required
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="6">
                        <Form.Group>
                          <label>Last Name</label>
                          <Form.Control
                            defaultValue={data.lastName}
                            name="lastName"
                            onChange={handleChange}
                            placeholder="Last Name"
                            type="text"
                            required
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md="12">
                        <Form.Group>
                          <label>Address</label>
                          <Form.Control
                            defaultValue={data.address || ""}
                            placeholder="Address"
                            name="address"
                            onChange={handleChange}
                            type="text"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col className="pr-1" md="4">
                        <Form.Group>
                          <label>City</label>
                          <Form.Control
                            defaultValue={data.city || ""}
                            placeholder="City"
                            name="city"
                            onChange={handleChange}
                            type="text"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="px-1" md="4">
                        <Form.Group>
                          <label>Country</label>
                          <Form.Control
                            defaultValue={data.country || ""}
                            placeholder="Country"
                            name="country"
                            onChange={handleChange}
                            type="text"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="4">
                        <Form.Group>
                          <label>PIN Code</label>
                          <Form.Control
                            placeholder="PIN Code"
                            defaultValue={data.pinCode || ""}
                            name="pinCode"
                            onChange={handleChange}
                            type="text"
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
                            defaultValue={data.about || ""}
                            name="about"
                            onChange={handleChange}
                            placeholder="Tell us about yourself !!"
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
                        Update Profile
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="card-user">
                <Card.Body>
                  <div className="author text-center">
                    <img
                      alt="..."
                      className="avatar border-gray rounded-circle"
                      src={userImage?.data || defaultAvatar}
                      style={{ width: "210px", height: "230px" }}
                    />
                    <h5 className="title mt-3">
                      {(data.firstName || "") + " " + (data.lastName || "")}
                    </h5>
                    <p className="description">{data.username || ""}</p>
                  </div>
                </Card.Body>
              </Card>
              <Card className="card-user mt-4">
                <Card.Header>
                  <Card.Title as="h4">Upload Image</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="author text-center">
                    <div>
                      <Form.Control
                        type="file"
                        className="mt-1"
                        accept="image/*"
                        placeholder="Upload Image"
                        onChange={handleImageChange}
                      />
                      {isImage && file && (
                        <img
                          src={file}
                          alt="..."
                          className="avatar border-gray mt-3"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      )}
                    </div>

                    <Button
                      className="btn-fill mt-3"
                      type="submit"
                      variant="success"
                      disabled={!(isImage && file)}
                      onClick={handleUpload}
                    >
                      Upload
                    </Button>
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

export default User;
