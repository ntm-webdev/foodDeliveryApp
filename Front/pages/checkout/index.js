import Checkout from "../../components/Checkout/Checkout";

const CheckoutPage = () => (
  <Checkout />
);

export async function getServerSideProps(ctx) {
  if (Object.keys(ctx.req.cookies).length === 0) {
    return {
      redirect: {
        destination: "/sign-up",
        permanent: false,
      },
    };
  }

  return {
    props: {}
  };
}

export default CheckoutPage;
