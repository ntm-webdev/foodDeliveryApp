import RestaurantDetails from "../../components/RestaurantDetails/RestaurantDetails";

const Restaurant = ({ restaurant }) => {
  return <RestaurantDetails restaurant={restaurant} />;
};

export async function getServerSideProps(ctx) {
  const { isAuthenticated } = require("../../utils/isAuth");
  if (isAuthenticated(ctx)) return isAuthenticated(ctx);

  const req = await fetch(
    `${process.env.REACT_APP_API_URL}/restaurant?id=${ctx.params.id}`,
    { method: "GET" }
  );
  const res = await req.json();

  if (!res) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      restaurant: res.restaurant,
    },
  };
}

export default Restaurant;
