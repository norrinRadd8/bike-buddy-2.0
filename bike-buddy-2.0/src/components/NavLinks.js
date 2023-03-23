import { NavLink } from "react-router-dom";

const NavLinks = () => {
  return (
    <nav className="nav">
      <NavLink to="/">Landing</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/signin">Sign In</NavLink>
      <NavLink to="/planroute">Plan Route</NavLink>
    </nav>
  );
};

export default NavLinks;
