import React, { useEffect, useState } from "react";
import { User } from "../types";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";

//maybe refactor into two components
function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const customFetch = useCustomFetch();

  //useState to display (error-) message
  //interface for ^ message, e.g. msg, color, ...

  const { user, setUser } = useUser();

  //if user logged in, move to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);


  const login = async () => {
    const loginData = {
      email: username,
      password,
    };
    const jsonLoginData = JSON.stringify(loginData);

    try {
      const responseLogin = await fetch(apiPaths.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonLoginData,
      });

      if (!responseLogin.ok) {
        //add proper error handling
        throw new Error("Network response not 200");
      }

      const userData = await responseLogin.json();
      console.log("First userdata: " + userData);

      const responseUser = await fetch(apiPaths.currentUser, {
        method: "GET",
        credentials: "include",
      });

      if (responseUser.ok) {
        const data = (await responseUser.json()) as User;
        setUser(data);
      }

    } catch (error) {
      console.error("Fetch error:", error);
    }
    
  };

  const register = async () => {
    const registerBody = {
      username,
      email,
      password,
    };
    const jsonRegisterBody = JSON.stringify(registerBody);

    try {
      const response = await fetch(apiPaths.register, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonRegisterBody,
      });

      if (!response.ok) {
        throw new Error("Network response not 200");
      }

      const userData = await response.json();
      console.log("response:" + userData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      if (!username || !password) {
        setError("Username and Password are required");
        return;
      }
      login();
    } else {
      if (!username || !password || !email) {
        setError("Username, Email and Password are required");
        return;
      }
      register();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h2 className="mt-6 text-center text-3xl font-bold">
          {isLogin ? "Sign in" : "Register"}
        </h2>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <FormField
            name="Username"
            type="text"
            state={username}
            setState={setUsername}
          />

          {!isLogin && (
            <FormField
              name="Email"
              type="text"
              state={email}
              setState={setEmail}
            />
          )}

          <FormField
            name="Password"
            type="password"
            state={password}
            setState={setPassword}
          />

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button type="submit" className="btn btn-primary w-full">
              {isLogin ? "Sign in" : "Register"}
            </button>
          </div>
        </form>

        <button
          className="text-primary mt-4"
          onClick={() => setIsLogin((isLogin) => !isLogin)}
        >
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

export default Login;
