// File: src/Pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import PageNav from "../Components/PageNav"; // optional if you have a navbar
import styles from "./Login.module.css";
import { useState } from "react";
// import useAuthStore from "../Zustand-api/useAuthStore";
import useAuthStore from "../Zustand-api/Authentication";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch( "https://collaboard-php-production.up.railway.app/Login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success) {
        login(result.userData || null);
        alert("Login successful! Redirecting...");
        navigate("/");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div>
      <PageNav /> {/* optional */}
      <main className={styles.login}>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <div>
            <button className={styles.btn} type="submit">
              Login
            </button>
            <p className={styles.signupText}>
              Don't have an account?{" "}
              <Link to="/signup">
                <button className={styles.signupBtn}>Signup</button>
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
