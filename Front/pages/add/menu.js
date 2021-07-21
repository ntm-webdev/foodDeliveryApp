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
    <div className="container">
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
  if (Object.keys(ctx.req.cookies).length === 0) {
    return {
      redirect: {
        destination: "/sign-up",
        permanent: false,
      },
    };
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/adm/add-menu-item`, { method: "GET" });
  const items = await response.json();
  return {
    props: {
      restaurants: items.restaurants,
    },
  };
}

export default AddMenuItem;
