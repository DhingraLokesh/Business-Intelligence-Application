import Dashboard from "./components/views/Dashboard";
import UserProfile from "./components/views/UserProfile";
import Projects from "./components/views/Projects";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
  },
  {
    path: "/projects",
    name: "Projects",
    icon: "nc-icon nc-circle-09",
    component: Projects,
  }
];

export default dashboardRoutes;
