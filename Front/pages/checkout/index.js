import Checkout from "../../components/Checkout/Checkout";

const CheckoutPage = () => (
  <Checkout />
);

export async function getServerSideProps(ctx) {
  const {isAuthenticated} = require('../../utils/isAuth');
  return (isAuthenticated(ctx)) ? isAuthenticated(ctx) : { props: {}};
}

export default CheckoutPage;
