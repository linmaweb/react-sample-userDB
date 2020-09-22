import React, { useReducer, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebaseConfig, ContactContext, reducer } from "../../config";
import Nav from "../Nav/Nav";
import ContactAdd from "../ContactAdd/ContactAdd";
import ContactList from "../ContactList/ContactList";
import ContactView from "../ContactView/ContactView";
import NotFound from "../NotFound/NotFound";
import "./App.css";

firebase.initializeApp(firebaseConfig);

const initialState = {
  contacts: [],
  contact: {},
  contactToUpdate: null,
  contactToUpdateKey: null,
  isLoading: false,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const firebaseSet = firebaseConfig.projectId;
  const getContacts = async () => {
    dispatch({
      type: "IS_LOADING",
      payload: true,
    });

    if (firebaseSet) {
      const contactsRef = await firebase.database().ref("/contacts");

      contactsRef.on("value", (snapshot) => {
        dispatch({
          type: "LIST_CONTACT",
          payload: snapshot.val(),
        });
        dispatch({
          type: "IS_LOADING",
          payload: false,
        });
      });
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <>
      {!firebaseSet ? (
        <h2 className="Center title-not-found">
          (need to update Firebase config to display data)
        </h2>
      ) : (
        <Router>
          <ContactContext.Provider value={{ state, dispatch }}>
            <ToastContainer
              position="bottom-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Nav />
            <div className="container">
              <Switch>
                <Route exact path="/contact/add" component={ContactAdd} />
                <Route exact path="/contact/view" component={ContactView} />
                <Route exact path="/" component={ContactList} />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </div>
          </ContactContext.Provider>
        </Router>
      )}
    </>
  );
};

export default App;
