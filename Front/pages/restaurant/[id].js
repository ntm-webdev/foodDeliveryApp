import RestaurantDetails from '../../components/RestaurantDetails/RestaurantDetails';

const Restaurant = ({ restaurant }) => {
  return <RestaurantDetails restaurant={restaurant} />;
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

  const req = await fetch(`${process.env.REACT_APP_API_URL}/restaurant?id=${ctx.params.id}`, { method: "GET" });
  const res = await req.json();
  return {
    props: {
      restaurant: res.restaurant,
    },
  };
}

export default Restaurant;
