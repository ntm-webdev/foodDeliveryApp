import "../styles/globals.css";
import AuthProvider from "../context/auth-context";
import CartProvider from "../context/cart-context";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
