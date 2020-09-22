import { createContext } from "react";

/***********************************************/
/******* need valid firebase config here *******/
/***********************************************/

export const firebaseConfig = {
  //apiKey: "",
  //authDomain: "",
  //databaseURL: "",
  //projectId: "",
  //storageBucket: "",
  //messagingSenderId: "",
  //appId: "",
};

// context
export const ContactContext = createContext();

// image config
export const imageConfig = {
  quality: 0.25,
  maxWidth: 400,
  maxHeight: 300,
  autoRotate: true,
};

// reducer
export const reducer = (state, action) => {
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
