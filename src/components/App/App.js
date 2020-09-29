import React, { useReducer, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebaseConfig, reducer } from "../../config";
import ContactContext from "../../context/ContactContext";
import Title from "../Title/Title";
import Nav from "../Nav/Nav";
import ContactAdd from "../ContactAdd/ContactAdd";
import ContactList from "../ContactList/ContactList";
import ContactView from "../ContactView/ContactView";
import NotFound from "../NotFound/NotFound";
import "./App.css";

firebase.initializeApp(firebaseConfig);

const App = () => {
  const initialState = {
    contacts: [],
    contact: {},
    contactToUpdate: null,
    contactToUpdateKey: null,
    isLoading: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LIST_CONTACT":
        return action.payload == null
          ? { ...state, contacts: [] }
          : { ...state, contacts: action.payload };

      case "IS_LOADING":
        return { ...state, isLoading: action.payload };

      case "UPDATE_CONTACT":
        return {
          ...state,
          contactToUpdate: action.payload,
          contactToUpdateKey: action.key,
        };

      case "VIEW_CONTACT":
        return {
          ...state,
          contact: action.payload,
        };

      default:
        return state;
    }
  };

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
      <Title type="User Database" />
      {!firebaseSet ? (
        <h2 className="Center title-not-found">
          (please add Firebase config to display data)
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
