import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";

import axiosInstance from "../utils/axios";

export const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  userData: {},
  isLoggedIn: false,
});

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const router = useRouter();

  useEffect(() => {
    loginHandler();
  }, []);

  const loginHandler = async () => {
    const res = await axiosInstance.get("/auth/get-credential");
    if (res.data) {
      setUserData(res.data);
    } else {
      router.push('/sign-up');
    }
  };

  const logoutHandler = async () => {
    await axiosInstance.get("/auth/logout");
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        login: loginHandler,
        logout: logoutHandler,
        userData: userData,
        isLoggedIn: !!userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
