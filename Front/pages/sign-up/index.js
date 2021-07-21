import Auth from "../../components/Auth/Auth";

const SignUp = () => {
  return <Auth />;
};

export async function getServerSideProps(ctx) {
  if (Object.keys(ctx.req.cookies).length > 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  };
}

export default SignUp;
