import { Link, useNavigate } from "react-router-dom";
import PageNav from "../Components/PageNav";
import styles from "./Login.module.css";
import { useState } from "react"; // Fixed import, removed 'use'
import useAuthStore from "../Zustand-api/Authentication";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Create the request payload
      const payload = {
        identifier: identifier.trim(),
        password: password.trim()
      };
      
      console.log("Sending login request with:", JSON.stringify(payload));
      
      const response = await fetch("https://collaboard-php-production.up.railway.app/Login.php", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });
      
      // Get the raw response text first for debugging
      const responseText = await response.text();
      console.log("Raw server response:", responseText);
      
      // Try to parse the response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse server response as JSON:", parseError);
        throw new Error("Server returned invalid data. Please try again later.");
      }
      
      if (result.success) {
        // Login successful
        console.log("Login successful, user data:", result.userData);
        login(result.userData);
        navigate("/");
      } else {
        // Login failed with a message from the server
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageNav />
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
            <button 
              className={styles.btn} 
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className={styles.signupText}>
              Don't have an account?{" "}
              <Link to="/signup">
                <button className={styles.signupBtn} type="button">Signup</button>
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}