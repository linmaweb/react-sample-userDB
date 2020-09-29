import React, { useContext } from "react";
import ContactItem from "../ContactItem/ContactItem";
import ContactContext from "../../context/ContactContext";
import "./ContactList.css";

const ContactList = () => {
  const { state } = useContext(ContactContext);
  const { contacts, isLoading } = state;

  if (isLoading) {
    return (
      <div className="Center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {contacts.length === 0 && !isLoading ? (
        <div className="Center text-large text-primary">
          NO Contacts found in firebase
        </div>
      ) : (
        <div className="list-group">
          {Object.entries(contacts).map(([key, value]) => (
            <div className="list-group-item" key={key}>
              <ContactItem contact={value} contactKey={key} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
