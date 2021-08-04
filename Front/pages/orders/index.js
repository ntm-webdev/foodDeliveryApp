import Orders from "../../components/Orders/Orders";

const OrderPage = () => {
  return (
    <div className="container breath">
      <Orders />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const {isAuthenticated} = require('../../utils/isAuth');
  return (isAuthenticated(ctx)) ? isAuthenticated(ctx) : { props: {}};
}

export default OrderPage;
