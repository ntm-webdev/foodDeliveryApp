import "../styles/globals.css";
import AuthProvider from "../context/auth-context";
import CartProvider from "../context/cart-context";
import { Router } from 'next/dist/client/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false, trickleRate: 0.1, trickleSpeed: 300 });

Router.events.on('routeChangeStart', () => {
  NProgress.start() 
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});

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
