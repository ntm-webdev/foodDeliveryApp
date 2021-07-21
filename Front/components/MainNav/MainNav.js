import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { CartContext } from "../../context/cart-context";
import { AuthContext } from "../../context/auth-context";
import styles from "./MainNav.module.css";

const MainNav = () => {
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const router = useRouter();

  const logoutHandler = () => {
    cartCtx.clearCart();
    authCtx.logout();
    router.replace("/sign-up");
  };

  const orderHandler = () => {
    cartCtx.continue();
    router.replace("/checkout");
  };

  return (
    <header className={styles.nav}>
      {cartCtx.cart.length > 0 && (
        <div className={`row ${styles.navItemOrder}`}>
          <div className="col-sm-10">
            <span>
              Total price: <strong>R${Math.abs(cartCtx.totalPrice)}</strong>
            </span>
          </div>
          <div className="col-sm-2">
            <button className="btn btn-light" onClick={orderHandler}>
              Continue
            </button>
          </div>
        </div>
      )}
      <div className={`row ${styles.navItem}`}>
        <div className="col-sm-6">
          <Link href="/orders">
            <a>
              <i className="fa fa-list" aria-hidden="true"></i>
              <p>Orders</p>
            </a>
          </Link>
        </div>
        <div className="col-sm-6" onClick={logoutHandler}>
          <i className="fa fa-sign-out" aria-hidden="true"></i>
          <p>Logout</p>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
