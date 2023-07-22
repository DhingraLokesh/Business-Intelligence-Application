import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProjectDashboard from "./components/Charts/ProjectDashboard";
import UserProfile from "./components/UserProfile";
import Projects from "./components/ProjectComponents/Projects";
import ProjectUpdate from "./components/ProjectComponents/Projects/ProjectUpdate";
import ProjectCreate from "./components/ProjectComponents/Projects/ProjectCreate";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import Requests from "./components/ProjectComponents/Requests";
import ViewExcel from "./components/ProjectComponents/ViewExcel";
import Loader from "./components/Loader";
function App() {
  const user = localStorage.getItem("token");
  const { loggedIn, logout } = useSelector((state) => state.auth);

  return (
    <div
      className="bg-light"
      style={{
        height: "100vh",
      }}
    >
      {(user || loggedIn) && <Navbar />}
      {logout.loading && <Loader message={logout.loadingMessage} />}
      <Routes>
        {user || loggedIn ? (
          <>
            <Route path="/profile" exact element={<UserProfile />} />
            <Route path="/projects" exact element={<Projects />} />
            <Route path="/requests" exact element={<Requests />} />
            <Route path="/project/create" element={<ProjectCreate />} />
            <Route
              path="/project/:id/dashboard"
              exact
              element={<ProjectDashboard />}
            />
            <Route path="/project/:id/edit" element={<ProjectUpdate />} />
            <Route path="/project/:id/get-excel" element={<ViewExcel />} />
            <Route path="*" element={<Navigate replace to="/projects" />} />
          </>
        ) : (
          <>
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="*" element={<Navigate replace to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
