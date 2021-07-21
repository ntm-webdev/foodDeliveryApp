import Orders from "../../components/Orders/Orders";

const OrderPage = () => {
  return (
    <div className="container breath">
      <Orders />
    </div>
  );
};

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
    props: {},
  };
}

export default OrderPage;
