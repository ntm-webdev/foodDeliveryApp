import { useRouter } from "next/router";
import Form from "../../components/UI/Form/Form";

const AddRestaurant = () => {
  const router = useRouter();

  const initialValues = {
    name: "",
    category: "",
    image: "",
    logo: "",
  };
  const fields = [
    { label: "name", type: "text" },
    {
      label: "category",
      type: "select",
      options: {
        "": "Select an option",
        "fast-food": "Fast-food",
        pizza: "Pizza",
        japanese: "Japanese",
        italian: "Italian",
        healthy: "Healthy",
        dessert: "Dessert",
      },
    },
    { label: "image", type: "file" },
    { label: "logo", type: "file" },
  ];

  const finalFunctionHandler = () => {
    router.replace("/add/menu");
  };

  return (
    <div className="container breath">
      <Form
        initialValues={initialValues}
        fields={fields}
        url={"/adm/restaurant"}
        finalFunction={finalFunctionHandler}
      />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const {isAuthenticated} = require('../../utils/isAuth');
  if (isAuthenticated(ctx)) return isAuthenticated(ctx);

  return {
    props: {},
  };
}

export default AddRestaurant;
