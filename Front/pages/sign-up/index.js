import Auth from "../../components/Auth/Auth";

const SignUp = () => {
  return <Auth />;
};

export async function getServerSideProps(ctx) {
  const isAuthenticated = Object.keys(ctx.req.cookies).find(cookie => cookie === "connect.sid");
  if (isAuthenticated) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    };
  }

  return {
    props: {}
  };
}

export default SignUp;
