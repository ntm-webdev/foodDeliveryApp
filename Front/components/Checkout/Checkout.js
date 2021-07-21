import { useContext, useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { CartContext } from "../../context/cart-context";
import { AuthContext } from "../../context/auth-context";
import styles from "./Checkout.module.css";
import Form from "../UI/Form/Form";

const fields = [
  { label: "userId", type: "hidden" },
  { label: "zipcode", type: "text" },
  { label: "address", type: "text" },
  { label: "totalPrice", type: "hidden" },
];

const Checkout = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);

  const initInitialState = {
    zipcode: "",
    address: "",
    userId: "",
  };
  const [initialValues, setInitialValues] = useState(initInitialState);

  useEffect(() => {
    if (authCtx.userData && authCtx.userData._id != "") {
      setInitialValues((prevState) => ({
        ...prevState,
        userId: authCtx.userData._id,
        totalPrice: cartCtx.totalPrice,
      }));
    }
  }, [authCtx.userData]);

  const finalFunctionHandler = () => {
    cartCtx.clearCart();
    router.replace("/");
  };

  let content;
  let order = Object.entries(cartCtx.order);
  if (order.length > 0) {
    content = (
      <div className="row">
        <div className="col-sm-6 padding">
          <div className={`col-sm-12 ${styles.bordered}`}>
            <h2 className={styles.sectionTitled}>Shipping</h2>
            {initialValues && initialValues.userId !== "" && (
              <Form
                initialValues={initialValues}
                fields={fields}
                finalFunction={finalFunctionHandler}
                url="/adm/order"
                submitButtonText="Order now"
                extraData={{ order: cartCtx.order }}
              />
            )}
            <button className="btn btn-danger" onClick={cartCtx.clearCart}>
              Clear cart
            </button>
          </div>
        </div>
        <div className="col-sm-6 padding">
          <div className={`col-sm-12 ${styles.bordered}`}>
            <h2 className={styles.sectionTitled}>Summary</h2>
            <p className="padding">
              <strong>TOTAL: R${cartCtx.totalPrice}</strong>
            </p>
          </div>
          <div className={`col-sm-12 ${styles.bordered} breath`}>
            <h2 className={styles.sectionTitled}>In your cart</h2>
            {order.map((item, key) => (
              <div key={key} className="row">
                <div className="col-sm-12">
                  <strong>{item[0]}</strong>
                  <hr />
                </div>
                {item[1].map((i, k) => (
                  <Fragment key={k}>
                    <div className="col-sm-3">
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/images/${i.itemImage}`}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="col-sm-9">
                      <p>
                        <strong>Name: </strong> {i.itemName}{" "}
                      </p>
                      <p>
                        <strong>Unit price: </strong> R${i.itemUnityPrice}{" "}
                      </p>
                      <p>
                        <strong>Qty: </strong> {i.itemQty}
                      </p>
                    </div>
                  </Fragment>
                ))}
                {item[1].map((i, k) => {
                  if (k < 1) {
                    return (
                      <div key={k} className="col-sm-12">
                        <Link href={`/restaurant/${i.restaurantId}`}>
                          <a className="btn btn-link">
                            Do you wanna change something here?
                          </a>
                        </Link>
                      </div>
                    );
                  }
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="row center">
        <div className="col-sm-12">
          <Image src="/empty-cart.png" width={600} height={300} />
          <h3>Nothing on cart, please start ordering.</h3>
        </div>
      </div>
    );
  }

  return <div className="container">{content}</div>;
};

export default Checkout;
