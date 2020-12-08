import { NavLink, Link } from "react-router-dom";
import { generatePath } from "react-router";
import "./NavBar.css";
import { logout } from "./reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import { Note } from "./models/notes";

export function NavBar() {
  const dispatch = useDispatch();
  const { auth, notes } = useSelector((state: any) => state);

  return (
    <nav className="nav-bar">
      <Link to="#">SimpleNote</Link>
      <NavLink to="/" exact>
        New
      </NavLink>
      <NavLink to="/notes">Notes</NavLink>
      {notes.notes.map((n: Note) => (
        <NavLink className="note" to={generatePath("/n/:id", { id: n.id })}>
          {n.title}
        </NavLink>
      ))}
      <div className="filler"></div>
      {auth.tokens ? (
        <NavLink onClick={() => dispatch(logout())} to="#">
          Logout
        </NavLink>
      ) : (
        <NavLink to="/login">Login</NavLink>
      )}
    </nav>
  );
}

export default NavBar;
