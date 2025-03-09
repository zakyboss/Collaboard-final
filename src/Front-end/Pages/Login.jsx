// File: src/Pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import PageNav from "../Components/PageNav"; // optional if you have a navbar
import styles from "./Login.module.css";
import { useState } from "react";
import useAuthStore from "../Zustand-api/Authentication";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://collaboard-php-production.up.railway.app/Login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
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
            <label htmlFor="identifier">Email or Username</label>
            <input
              type="text"
              id="identifier"
              onChange={(e) => setIdentifier(e.target.value)}
              value={identifier}
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
