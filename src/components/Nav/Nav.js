import React, { useContext } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { ContactContext } from "../../config";
import "./Nav.css";

const Nav = () => {
  const { dispatch } = useContext(ContactContext);
  const history = useHistory();
  const match = useRouteMatch("/contact/add");
  const AddContact = () => {
    dispatch({
      type: "UPDATE_CONTACT",
      payload: null,
      key: null,
    });
    history.push("/contact/add");
  };

  return (
    <div className="nav-wrapper">
      <div className="container text-center">
        <Link to="/">
          <i class="fas fa-home"></i>
          Home
        </Link>
        {!match && (
          <Link to="/contact/add" onClick={AddContact}>
            <i class="fas fa-plus"></i>
            Add Contact
          </Link>
        )}
      </div>
    </div>
  );
};

export default Nav;
