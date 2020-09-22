import React, { useContext } from "react";
import firebase from "firebase/app";
import { ContactContext } from "../../config";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "./ContactItem.css";

const ContactItem = ({ contact, contactKey }) => {
  const { dispatch } = useContext(ContactContext);
  const history = useHistory();

  const deleteContact = () => {
    firebase
      .database()
      .ref(`/contacts/${contactKey}`)
      .remove()
      .then(() => {
        toast("Deleted", { type: "success" });
      })
      .catch((err) => console.log(err));
  };

  const updateImpContact = () => {
    firebase
      .database()
      .ref(`/contacts/${contactKey}`)
      .update(
        {
          star: !contact.star,
        },
        (err) => {
          console.log(err);
        }
      )
      .then(() => {
        toast("Updated", { type: "success" });
      })
      .catch((err) => console.log(err));
  };

  const updateContact = () => {
    dispatch({
      type: "UPDATE_CONTACT",
      payload: contact,
      key: contactKey,
    });
    history.push("/contact/add");
  };

  const viewSingleContact = (contact) => {
    dispatch({
      type: "VIEW_CONTACT",
      payload: contact,
    });
    history.push("/contact/view");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-2 d-flex justify-content-center align-items-center">
          <img src={contact.picture} alt="" className="img-circle profile" />
        </div>
        <div className="col-md-8" onClick={() => viewSingleContact(contact)}>
          <div className="text-primary">{contact.name}</div>
          <div className="text-secondary">
            <i className="fas fa-phone fa-icon"></i>
            {contact.phoneNumber}
          </div>
          <div className="text-secondary">
            <i className="fas fa-envelope fa-icon"></i>
            {contact.email}
          </div>
          <div className="text-info">
            <i className="fas fa-map-marker-alt fa-icon"></i>
            {contact.address}
          </div>
        </div>
        <div className="col-md-2 d-flex justify-content-center align-items-center">
          <div className="icon" onClick={() => updateImpContact()}>
            {contact.star ? (
              <i className="fas fa-star fa-btn"></i>
            ) : (
              <i className="far fa-star fa-btn"></i>
            )}
          </div>
          <div className="icon" onClick={() => deleteContact()}>
            <i className="fas fa-trash fa-btn"></i>
          </div>
          <div className="icon" onClick={() => updateContact()}>
            <i className="fas fa-edit fa-btn"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactItem;
