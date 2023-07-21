import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async() => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar
      className="navbar mb-50"
      style={{
        backgroundColor: "#00838d",
      }}
    >
      <Container fluid>
        <div className="d-flex text-black justify-content-center align-items-center ">
          <NavLink
            to={"/projects"}
            className="btn btn-link text-white mr-3 text-decoration-none"
            style={{ fontSize: "1.5rem" }}
          >
            Business Intelligence Application
          </NavLink>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <NavLink
            to="/projects"
            className="btn btn-link text-white mr-3 text-decoration-none"
          >
            Projects
          </NavLink>
          <NavLink
            to="/requests"
            className="btn btn-link text-white mr-3 text-decoration-none"
          >
            Requests
          </NavLink>
          <NavLink
            to="/profile"
            className="btn btn-link text-white mr-3 text-decoration-none"
          >
            Profile
          </NavLink>
          <button
            type="button"
            className="btn btn-success btn-sm mx-3"
            onClick={() => navigate("/project/create")}
            style={{
              backgroundColor: "#e6e2e2",
              color: "#00838d",
              fontWeight: 'bold'
            }}
          >
            + Create
          </button>
          <button style={{
              backgroundColor: "#e6e2e2",
              color: "red",
              fontWeight: 'bold'
            }}
            className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
