import { useState, useEffect, useContext } from "react";
import Image from "next/image";

import { AuthContext } from "../../context/auth-context";
import useHttp from "../../hooks/use-http";
import Spinner from "../UI/Spinner/Spinner";
import styles from "./Orders.module.css";

const Orders = () => {
  const authCtx = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const { sendRequest, spinner } = useHttp();

  useEffect(() => {
    if (authCtx.userData) {
      fetchOrders();
    }
  }, [authCtx.userData]);

  const fetchOrders = async () => {
    const data = { params: { id: authCtx.userData._id } };
    const orders = await sendRequest("/adm/orders", "get", data);
    setOrders(orders);
  };

  let content = <Spinner />;
  if (orders.length > 0) {
    content = orders.map((order, i) => (
      <div className={`row ${styles.order}`} key={i}>
        <div className="col-sm-12 padding">
          <h3 className={styles.orderTitle}>
            Order {`#${i + 1}`} - Total: R${order.totalprice}
          </h3>
          <hr />
          {Object.entries(order.items).map((item, key) => (
            <div className="row" key={key}>
              <div className="col-sm-2 padding">
                <Image
                  src={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/images/${item[1][0].logo}`}
                  width={100}
                  height={100}
                />
              </div>
              <div className="col-sm-2 padding">
                <h3>{item[0]}</h3>
              </div>
              <div className="col-sm-6 padding">
                {item[1].map((i, k) => (
                  <p key={k}>
                    <strong>
                      ({i.itemQty}x) 
                    </strong>
                    <span>
                      {" " + i.itemName}, the unit price is <strong>R${i.itemUnityPrice}</strong>
                    </span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  } else {
    content = (
      <div className="row center">
        <div className="col-sm-12">
          <Image src="/empty-box.jpg" width={600} height={400} />
          <h3>You haven't ordered anything, maybe now?</h3>
        </div>
      </div>
    );
  }

  return <div className="container">{content}</div>;
};

export default Orders;
