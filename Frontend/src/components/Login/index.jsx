import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import ButtonLoader from "../Loader/ButtonLoader";
import styles from "./styles.module.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { errorMessage, loading } = useSelector((state) => state.auth.login);

  const [data, setData] = useState({ email: "", password: "" });


  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await dispatch(login(data));
    if (resp?.type?.includes("fulfilled")) {
      navigate("/projects");
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {errorMessage && (
              <div className={styles.error_msg}>{errorMessage}</div>
            )}
            <button type="submit" className={styles.green_btn}>
              Sign In
              {loading && <ButtonLoader />}
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
