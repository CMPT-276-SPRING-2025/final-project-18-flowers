import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Squad Up
      </Link>
      <div className="navbar-links">
        <Link to="/about">About</Link>
        <Link to="/plan">Plan</Link>
      </div>
    </nav>
  );
};

export default Navbar;
