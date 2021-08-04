import { useRouter } from "next/router";
import Form from "../../components/UI/Form/Form";

const AddMenuItem = ({ restaurants }) => {
  const router = useRouter();

  let restaurantsObj = { "": "Select an option" };
  restaurants.forEach((element) => {
    restaurantsObj[element.name] = element.name;
  });

  const initialValues = {
    name: "",
    description: "",
    image: "",
    price: 0,
    restaurant: "",
  };
  const fields = [
    { label: "name", type: "text" },
    { label: "description", type: "textarea" },
    { label: "price", type: "number", min: 0, max: 9999, step: 0.1 },
    { label: "restaurant", type: "select", options: restaurantsObj },
    { label: "image", type: "file" },
  ];

  const finalFunctionHandler = () => {
    router.replace("/");
  };

  return (
    <div className="container breath">
      <Form
        initialValues={initialValues}
        fields={fields}
        url="/adm/menu"
        finalFunction={finalFunctionHandler}
      />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const {isAuthenticated} = require('../../utils/isAuth');
  if (isAuthenticated(ctx)) return isAuthenticated(ctx);
  
  const response = await fetch(`${process.env.REACT_APP_API_URL}/adm/add-menu-item`, { method: "GET" });
  const items = await response.json();
  return {
    props: {
      restaurants: items.restaurants,
    },
  };
}

export default AddMenuItem;
