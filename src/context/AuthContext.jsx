import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getRefreshToken } from "../services/AuthService";
import { ApiClient } from "../services/ApiClient";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const storedUser = () =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null;

  const storedToken = () =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

  let [authTokens, setAuthToken] = useState(storedToken);
  let [user, setUser] = useState(storedUser);
  let [loading, setLoading] = useState(true);

  const history = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();

    let res = await getAuthToken({
      email: e.target.email.value,
      password: e.target.password.value,
    }).catch(function (error) {
      if (error.response.status === 401) {
        // La respuesta fue hecha y el servidor respondió con un código de estado 401
        alert("No se encuentra usuario activo con estas credenciales");
      }
    });

    if (res.status === 200) {
      setAuthToken(res.data);
      setUser(jwtDecode(res.data.access));
      localStorage.setItem("authTokens", JSON.stringify(res.data));
      ApiClient.defaults.headers.common["Authorization"] =
        "Bearer " + authTokens.access;
      history("/");
    } else {
      alert("Opps, Algo ha salido Mal!");
    }
  };

  let logoutUser = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history("/login");

    console.log("loged out");
  };

  let updateToken = async () => {
    // let response = await fetch("http://127.0.0.1:8000/auth/token/refresh/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     refresh: authTokens?.refresh,
    //   }),
    // });
    if (authTokens !== null) {
      let response = await getRefreshToken({
        refresh: authTokens?.refresh,
      }).catch(function (error) {
        if (error.response.status >= 400) {
          // La respuesta fue hecha y el servidor respondió con un código de estado 401
          logoutUser();
        }
      });

      // let data = response.data;
      if (response.status === 200) {
        ApiClient.defaults.headers.common["Authorization"] =
          "Bearer " + authTokens.access;
        setAuthToken(response.data);
        setUser(jwtDecode(response.data.access));
        localStorage.setItem("authTokens", JSON.stringify(response.data));
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
        console.log("Update Token: " + loading);
      }
    } else {
      logoutUser();
      setLoading(false);
    }
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      console.log("useEffect: " + loading);
      updateToken();
    }

    console.log(loading);

    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
