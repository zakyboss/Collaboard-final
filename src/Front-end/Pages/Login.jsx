import { Link, useNavigate } from "react-router-dom";
import PageNav from "../Components/PageNav"; // optional if you have a navbar
import styles from "./Login.module.css";
import { useState } from "react"; // Fixed the import (removed 'use')
import useAuthStore from "../Zustand-api/Authentication";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state for better error handling
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      const apiUrl = "https://collaboard-php-production.up.railway.app/Login.php";
      console.log("Attempting login to:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ identifier, password }),
      });
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      // Parse response
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response from server");
      }
      
      if (result.success) {
        login(result.userData || null);
        console.log("Login successful, user data:", result.userData);
        navigate("/");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
    }
  };

  return (
    <div>
      <PageNav /> {/* optional */}
      <main className={styles.login}>
        <form className={styles.form} onSubmit={handleLogin}>
          {error && <div className={styles.error}>{error}</div>}
          
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