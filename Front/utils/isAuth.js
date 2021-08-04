export const isAuthenticated = (ctx) => {
  const isAuth = Object.keys(ctx.req.cookies).find(
    (cookie) => cookie === "connect.sid"
  );
  if (!isAuth) {
    return {
      redirect: {
        destination: "/sign-up",
        permanent: false,
      },
    };
  }
};
