import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { CartContext } from "../../context/cart-context";
import { AuthContext } from "../../context/auth-context";
import { getRating } from "../../utils/general";
import useHttp from "../../hooks/use-http";
import styles from "./RestaurantDetails.module.css";
import Modal from "../UI/Modal/Modal";
import Form from "../UI/Form/Form";

const fields = [
  { label: "comment", type: "textarea" },
  { label: "rating", type: "number", min: 0, max: 5, step: 1 },
  { label: "restaurantId", type: "hidden" },
  { label: "userId", type: "hidden" },
  { label: "feedbackId", type: "hidden" },
];

const getFeedbackUserImage = (pictureUrl) => {
  let profilePictureUrl;
  if (!pictureUrl.startsWith("https")) {
    profilePictureUrl = `${process.env.REACT_APP_API_URL}/images/${pictureUrl}`;
  } else {
    profilePictureUrl = pictureUrl
  }               
  return profilePictureUrl;                     
};

const RestautantDetails = ({ restaurant }) => {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const { sendRequest, message } = useHttp();

  const initInitialState = {
    comment: "",
    rating: 1,
    restaurantId: restaurant._id,
    feedbackId: "",
  };

  const [isViewingMenu, setIsViewingMenu] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [initialValues, setInitialValues] = useState(initInitialState);

  useEffect(() => {
    if (authCtx.userData && authCtx.userData._id) {
      setInitialValues((prevState) => ({
        ...prevState,
        userId: authCtx.userData._id,
      }));
    }
  }, [authCtx.userData, showModal]);

  let isAuthor;
  if (authCtx.userData) {
    isAuthor = restaurant.feedback.find(el => el.userid._id === authCtx.userData._id);
  }

  const orderHandler = () => {
    cartCtx.continue();
    router.replace("/checkout");
  };

  const showMenuViewHandler = (e) => {
    if (e.target.id === "menu") {
      setIsViewingMenu(true);
    } else {
      setIsViewingMenu(false);
    }
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const onModalCloseHandler = () => {
    setShowModal(false);
    setInitialValues(initInitialState);
  };

  const refreshPageHandler = () => {
    router.push(window.location.pathname);
  };

  const removeFeedbackHandler = async (feedbackId, restaurantId) => {
    const answer = window.confirm("Are you sure you want to remove your feedback?");
    if (answer) {
      const data = { data: { restaurantId, feedbackId, userId: authCtx.userData._id } };
      await sendRequest("/adm/feedback", "delete", data);
      refreshPageHandler();
    }
  };

  const finalFunctionHandler = () => {
    onModalCloseHandler();
    refreshPageHandler();
  };

  const editFeedbackHandler = (feedbackId, comment, rating) => {
    setInitialValues((prevState) => ({
      ...prevState,
      feedbackId: feedbackId,
      comment: comment,
      rating: rating,
    }));
    showModalHandler();
  };

  if (!message.success) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {message.msg}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <Image
            src={`${process.env.REACT_APP_API_URL}/images/${restaurant.image}`}
            width={1200}
            height={300}
          />
        </div>
      </div>
      <div className={`row ${styles.selection}`}>
        <div className="col-sm-12 col-md-5 little-padding">
          <h5
            className={`clickable ${isViewingMenu ? styles.optionSelected : ""}`}
            id="menu"
            onClick={showMenuViewHandler}
          >
            Menu
          </h5>
        </div>
        <div className="col-sm-12 col-md-5 little-padding">
          <h5
            className={`clickable ${!isViewingMenu ? styles.optionSelected : ""}`}
            id="feedback"
            onClick={showMenuViewHandler}
          >
            Feedbacks&nbsp;
            <span>{getRating(restaurant.rating)}</span>
          </h5>
        </div>
        {!isAuthor && (
          <div className="col-sm-12 col-md-2 little-padding">
            <button className="btn btn-primary" onClick={showModalHandler}>
              Add a feedback
            </button>
          </div>
        )}
      </div>
      <div className={styles.main}>
        {isViewingMenu &&
          restaurant.menu.map((option, i) => (
            <div key={i} className={`row ${styles.main}`}>
              <div className="col-sm-12 col-md-2">
                <Image
                  src={`${process.env.REACT_APP_API_URL}/images/${option.image}`}
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-sm-12 col-md-6">
                <strong>{option.name}</strong>
                <p>{option.description}</p>
              </div>
              <div className="col-sm-12 col-md-2">
                <button
                  className={`btn btn-danger ${cartCtx.getQuantity(option.name) === 0 ? "disabled" : ""}`}
                  disabled={cartCtx.getQuantity(option.name) === 0}
                  onClick={() => cartCtx.removeFromCart(option)}
                >
                  -
                </button>
                &nbsp;
                <span>{cartCtx.getQuantity(option.name, restaurant._id)}</span>
                &nbsp;
                <button
                  className="btn btn-success"
                  onClick={() => cartCtx.addToCart(option, restaurant._id, restaurant.logo)}
                >
                  +
                </button>
              </div>
              <div className="col-sm-12 col-md-2">
                <span>
                  Unit price: <strong>R${option.price}</strong>
                </span>
              </div>
            </div>
          ))}
        {!isViewingMenu && restaurant.feedback.length > 0 && (
          <div className={styles.feedbackSection}>
            {restaurant.feedback.map((feedback) => (
              <div
                key={feedback._id}
                className={`row little-padding ${styles.feedback}`}
              >
                <div className="col-sm-2">
                  <Image
                    src={getFeedbackUserImage(feedback.userid.picture)}
                    width={50}
                    height={50}
                  />
                </div>
                <div className="col-sm-4">
                  <p>{feedback.userid.username} says:</p>
                  <p>{feedback.comment}</p>
                </div>
                <div className="col-sm-2">
                  {getRating(feedback.rating)}
                </div>
                {authCtx.userData._id === feedback.userid._id && (
                  <div className="col-sm-4">
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        editFeedbackHandler(
                          feedback._id,
                          feedback.comment,
                          feedback.rating
                        )
                      }
                    >
                      <i className="fa fa-edit" aria-hidden="true"></i>&nbsp;
                      Edit
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFeedbackHandler(feedback._id, restaurant._id)}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>&nbsp;
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {!isViewingMenu && restaurant.feedback.length <= 0 && (
          <div className="row little-padding">
            <div className="col-sm-12">
              <p>No feedbacks were found.</p>
            </div>
          </div>
        )}
        {cartCtx.cart.length > 0 && (
          <>
            <br /><br />
            <div className="row">
              <div className="col-sm-12 orderBar">
                <span>
                  Total price: <strong>R${Math.abs(cartCtx.totalPrice)}</strong>
                </span>&nbsp;
                <button className="btn btn-light" onClick={orderHandler}>
                  Continue
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {showModal && (
        <Modal onClose={onModalCloseHandler}>
          <Form
            initialValues={initialValues}
            fields={fields}
            finalFunction={finalFunctionHandler}
            url="/adm/feedback"
          />
        </Modal>
      )}
    </div>
  );
};

export default RestautantDetails;
