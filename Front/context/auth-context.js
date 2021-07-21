import { useState, useEffect, createContext } from "react";

import axiosInstance from "../utils/axios";

export const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  userData: {},
  isLoggedIn: false,
});

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    loginHandler();
  }, []);

  const loginHandler = async () => {
    const res = await axiosInstance.get("/auth/get-credential");
    setUserData(res.data);
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
