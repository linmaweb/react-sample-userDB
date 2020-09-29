import React, { useContext } from "react";
import ContactContext from "../../context/ContactContext";
import "./ContactView.css";

const ContactView = () => {
  const { state } = useContext(ContactContext);
  const { contact } = state;

  return (
    <div className="mt-5 mb-5">
      <div className="col-md-6 offset-md-3">
        <div className="card pt-3 pb-3">
          <div className="card-body text-center ">
            <img
              height="150"
              width="150"
              className="cardImg profile border-danger"
              src={contact?.picture}
              alt="profile"
            />
            <div className="card-title">
              <h2>{contact?.name}</h2>
            </div>

            <a
              className="btn btn-primary btn-block"
              target="_blank"
              rel="noopener noreferrer"
              href={`tel:${contact?.phoneNumber}`}
            >
              <i className="fas fa-phone fa-href"></i>
              {contact?.phoneNumber}
            </a>

            <a
              className="btn btn-primary btn-block"
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:{contact?.email}`}
            >
              <i className="fas fa-envelope fa-href"></i>
              {contact?.email}
            </a>

            <a
              className="btn btn-primary btn-block"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://maps.google.com/?=${contact?.address}`}
            >
              <i className="fas fa-map-marker-alt fa-href"></i>
              {contact?.address}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
