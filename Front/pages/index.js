import FoodOptionsNav from "../components/FoodOptionsNav/FoodOptionsNav";
import Restaurant from "../components/Restaurant/Restaurant";
import MainNav from "../components/MainNav/MainNav";

const Home = ({ items }) => {
  return (
    <div className="container">
      <FoodOptionsNav />
      <Restaurant items={items} />
      <br />
      <MainNav />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  if (Object.keys(ctx.req.cookies).length === 0) {
    return {
      redirect: {
        destination: '/sign-up',
        permanent: false,
      }
    }
  }

  const queryParam = ctx.resolvedUrl !== "/" ? ctx.resolvedUrl : "";
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/restaurants${queryParam}`,
    { method: "GET" }
  );
  const items = await response.json();

  return {
    props: {
      items: items.restaurants,
    },
  };
}

export default Home;
