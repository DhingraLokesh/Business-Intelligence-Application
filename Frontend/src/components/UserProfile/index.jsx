import React, { useEffect, useRef, useState } from "react";
import defaultAvatar from "../../assets/img/default-avatar.png";
import "../ProjectComponents/Projects/index.css";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getImage,
  getUser,
  updateUser,
  uploadImage,
} from "../../redux/slices/authSlice";
import Loader from "../Loader";
import ButtonLoader from "../Loader/ButtonLoader";
import { normalAlert } from "../../utils/Swal";

function User() {
  const dispatch = useDispatch();

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

  const { user, editUser, editImage, userImage } = useSelector(
    (state) => state.auth
  );

  const fileInputRef = useRef(null);

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

    if (data?.username?.length < 3 || data?.username?.length > 15) {
      normalAlert(
        "Error!",
        `username length should be between 3 and 15 characters. Current length is ${data?.username?.length}`,
        "error"
      );
      return;
    }

    const resp = await dispatch(updateUser(data));

    if (resp.meta.requestStatus === "fulfilled") {
      normalAlert("User updated !", "", "success");
      dispatch(getUser());
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", finalFile);
    const resp = await dispatch(uploadImage(formData));

    if (resp.meta.requestStatus === "fulfilled") {
      normalAlert("Image uploaded !", "", "success");
      setFile(null);
      setIsImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      dispatch(getImage());
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
              <Card className="mt-4">
                <Card.Header>
                  <Card.Title as="h4">Edit Profile</Card.Title>
                </Card.Header>
                <Card.Body>
                  {
                    <Form onSubmit={handleSubmit}>
                      <fieldset disabled={editUser.loading}>
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
                                value={data.username}
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
                                value={data.email}
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
                                value={data.firstName}
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
                                value={data.lastName}
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
                                value={data.address || ""}
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
                                value={data.city || ""}
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
                                value={data.country || ""}
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
                                value={data.pinCode || ""}
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
                                value={data.about || ""}
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
                            className="btn-fill pull-right dashboardButton"
                            type="submit"
                            variant="success"
                          >
                            Update
                            {editUser.loading && <ButtonLoader />}
                          </Button>
                        </div>
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
                      src={userImage?.data || defaultAvatar}
                      style={{ width: "210px", height: "230px" }}
                    />
                    <h5 className="title mt-3">
                      {(user?.data?.firstName || "") +
                        " " +
                        (user?.data?.lastName || "")}
                    </h5>
                    <p className="description">{user?.data?.username || ""}</p>
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
                        disabled={editImage.loading}
                        ref={fileInputRef}
                      />
                      {file && isImage && (
                        <img
                          src={file}
                          alt="..."
                          className="avatar border-gray mt-3"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      )}
                    </div>

                    <Button
                      className="btn-fill mt-3 dashboardButton"
                      type="submit"
                      variant="success"
                      disabled={!(isImage && file)}
                      onClick={handleUpload}
                    >
                      Upload
                      {editImage.loading && <ButtonLoader />}
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
