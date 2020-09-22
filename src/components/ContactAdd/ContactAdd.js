import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";
import { v4 } from "uuid";
import { ContactContext } from "../../config";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from "../../config";
import "./ContactAdd.css";

const ContactAdd = () => {
  const { state, dispatch } = useContext(ContactContext);
  const { contactToUpdate, contactToUpdateKey } = state;
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [star, setStar] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (contactToUpdate) {
      setName(contactToUpdate.name);
      setEmail(contactToUpdate.email);
      setPhoneNumber(contactToUpdate.phoneNumber);
      setAddress(contactToUpdate.address);
      setStar(contactToUpdate.star);
      setDownloadUrl(contactToUpdate.picture);
      setIsUpdate(true);
    }
  }, [contactToUpdate]);

  const imagePicker = async (e) => {
    try {
      const file = e.target.files[0];

      const metadata = {
        contentType: file.type,
      };

      let resizedImage = await readAndCompressImage(file, imageConfig);

      const storageRef = await firebase.storage().ref();
      const uploadTask = storageRef
        .child("images/" + file.name)
        .put(resizedImage, metadata);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          setIsUploading(true);
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              setIsUploading(false);
              break;
            case firebase.storage.TaskState.RUNNING:
              break;
            default:
              break;
          }
          if (progress === 100) {
            setIsUploading(false);
            toast("Uploaded", { type: "success" });
          }
        },
        (error) => {
          toast("Please try again later", { type: "error" });
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              setDownloadUrl(downloadURL);
            })
            .catch((err) => console.log(err));
        }
      );
    } catch (error) {
      toast("Please try again later", { type: "error" });
    }
  };

  const addContact = async () => {
    try {
      if (!downloadUrl) {
        toast("Please upload profile picture", { type: "error" });
        return;
      }
      firebase
        .database()
        .ref("contacts/" + v4())
        .set({
          name,
          email,
          phoneNumber,
          address,
          picture: downloadUrl,
          star,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateContact = async () => {
    try {
      if (!downloadUrl) {
        toast("Please upload profile picture", { type: "error" });
        return;
      }
      firebase
        .database()
        .ref("contacts/" + contactToUpdateKey)
        .set({
          name,
          email,
          phoneNumber,
          address,
          picture: downloadUrl,
          star,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isUpdate ? updateContact() : addContact();
    if (!downloadUrl) {
      return;
    }
    toast("Success", { type: "success" });
    dispatch({
      type: "UPDATE_CONTACT",
      payload: null,
      key: null,
    });

    history.push("/");
  };

  return (
    <div className="container container-fluid mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 p-2">
          <form className="form" onSubmit={handleSubmit}>
            <div className="text-center">
              {isUploading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div>
                  <label htmlFor="imagepicker" className="">
                    <img src={downloadUrl} alt="" className="profile" />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="imagepicker"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => imagePicker(e)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="input-group mb-3">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="number"
                name="number"
                id="phonenumber"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="phone number"
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="textarea"
                name="area"
                id="area"
                value={address}
                className="form-control"
                onChange={(e) => setAddress(e.target.value)}
                placeholder="address"
              />
            </div>
            <div className="input-group check">
              <label className="check">
                <input
                  type="checkbox"
                  className="form-check"
                  onChange={() => {
                    setStar(!star);
                  }}
                  checked={star}
                />
                <span className="small">mark as favorite</span>
              </label>
            </div>
            <button
              type="submit"
              color="primary"
              block
              className="btn btn-primary text-uppercase"
            >
              {isUpdate ? "Update Contact" : "Add Contact"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactAdd;
