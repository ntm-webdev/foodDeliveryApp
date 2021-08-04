import { useState } from "react";

import styles from "./Auth.module.css";
import Form from "../UI/Form/Form";
import Modal from "../UI/Modal/Modal";

const initialValues = {
  username: "",
  email: "",
  password: "",
  image: "",
};

const fields = [
  { label: "username", type: "text" },
  { label: "email", type: "email" },
  { label: "password", type: "password" },
  { label: "image", type: "file" },
];

const initialValuesSignIn = {
  email: "",
  password: "",
};

const fieldsSignIn = [
  { label: "email", type: "email" },
  { label: "password", type: "password" },
];

const Auth = () => {
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const onModalCloseHandler = () => {
    setShowModal(false);
  };

  const finalFunctionHandler = () => {
    onModalCloseHandler();
    window.location.href = process.env.NEXT_PUBLIC_REACT_APP_URL;
  };

  const socialMediaHandler = (socialMedia) => {
    if (socialMedia === "google") {
      window.open(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/auth/google`, "_self");
    } else {
      window.open(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/auth/facebook`, "_self");
    }
  };

  return (
    <div className="container center">
      <div className="row breath">
        <div className="col-sm-12">
          <h2>Sign Up</h2>
        </div>
      </div>
      <div className="row little-breath">
        <div className="col-sm-12">
          <p>
            Come join the best food delivery app! Let's set up your account.
            Already have one?{" "}
            <span className="link" onClick={showModalHandler}>
              Sign in here
            </span>
          </p>
        </div>
      </div>
      <div className="row hard-breath">
        <div className="col-sm-6">
          <div className="col-sm-12">
            <p>You can also sign in with these:</p>
            <br />
          </div>
          <div className="col-sm-12">
            <div
              className={`${styles.signup} ${styles.facebook}`}
              onClick={() => socialMediaHandler("facebook")}
            >
              <i className="fa fa-facebook" aria-hidden="true"></i>
              &nbsp;Facebook
            </div>
          </div>
          <div className="col-sm-12">
            <div
              className={`${styles.signup} ${styles.google}`}
              onClick={() => socialMediaHandler("google")}
            >
              <i className="fa fa-google" aria-hidden="true"></i>
              &nbsp;Google
            </div>
          </div>
        </div>
        <div className={`col-sm-6 ${styles.localForm}`}>
          <div className="col-sm-12">
            <Form
              initialValues={initialValues}
              fields={fields}
              url="/auth/signup"
              finalFunction={finalFunctionHandler}
              submitButtonText="Join"
            />
          </div>
        </div>
      </div>
      {showModal && (
        <Modal onClose={onModalCloseHandler}>
          <Form
            initialValues={initialValuesSignIn}
            fields={fieldsSignIn}
            finalFunction={finalFunctionHandler}
            url="/auth/login"
            submitButtonText="Sign in"
          />
        </Modal>
      )}
    </div>
  );
};

export default Auth;
