import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/" className={styles.logoContainer}>
      <img src="/logo.png" alt="Collaboard logo" className={styles.logo} />
      <span className={styles.logoText}>Collaboard</span>
    </Link>
  );
}

export default Logo;
