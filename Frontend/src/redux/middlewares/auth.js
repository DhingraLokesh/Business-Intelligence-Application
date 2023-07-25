import { logout } from "../slices/authSlice";
import { normalAlert } from "../../utils/Swal";

const tokenExpirationMiddleware = (store) => (next) => (action) => {
  const tokenExpiration = localStorage.getItem("tokenExpiration");

  if (tokenExpiration) {
    const currentTime = new Date().getTime();
    const expirationTime = new Date(tokenExpiration).getTime();

    if (currentTime + 1 * 60 * 1000 >= expirationTime) {
      normalAlert(
        `Your session is about to expire in 1 minute !!`,
        "Please save your work and login again to continue.",
        "warning"
      );
    }

    if (currentTime >= expirationTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      store.dispatch(logout());
    }
  }

  return next(action);
};

export default tokenExpirationMiddleware;
