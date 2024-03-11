import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>

      {user ? (
        <Link onClick={logoutUser}>Logout</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}

      {user && <h2>Hello {user.username}</h2>}
    </div>
  );
};

export default Header;
