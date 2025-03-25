import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.js";
import AboutPage from "./components/AboutPage/AboutPage.js";
import Contribute from "./components/Contribute/Contribute.js";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className="navContainer">
      <div className={styles.navBar}>
        <Link className={styles.link} to="/">
          Home
        </Link>
        <Link className={styles.link} to="/Team">
          Coauthor Team
        </Link>
        <Link className={styles.link} to="/Contribute">
          Contribute Data
        </Link>
      </div>

      <Routes>
        <Route path="/Team" element={<AboutPage />} />
        <Route path="/Contribute" element={<Contribute />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
