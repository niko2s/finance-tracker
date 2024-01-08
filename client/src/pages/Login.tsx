import React, { useEffect, useState } from "react";
import { User, InfoMessage } from "../types";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import apiPaths from "../api/paths";
import useCustomFetch from "../hooks/customFetch";

//maybe refactor into two components
function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<InfoMessage>({ message: "", color: "default" });
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
      email,
      password,
    };
    const jsonLoginData = JSON.stringify(loginData);

    try {
      //post login data, on successful login set cookies
      const responseLogin = await fetch(apiPaths.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonLoginData,
      });

      if (responseLogin.status === 401) {
        setMessage({ message: "Wrong Username or Password!", color: "red" })
        console.log("Wrong Username or Password!");
      }

      if (responseLogin.ok) {
        //get user data
        const responseUser = await customFetch(apiPaths.currentUser, {
          method: "GET",
          credentials: "include",
        });

        if (responseUser.ok) {
          const data = (await responseUser.json()) as User;
          setUser(data);
        }
      }

    } catch (error) {
      setMessage({ message: "Internal error occured!", color: "red" })
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
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      if (!email || !password) {
        setMessage({ message: "Email and Password are required", color: "red" });
        return;
      }
      login();
    } else {
      if (!username || !password || !email) {
        setMessage({ message: "Username, Email and Password are required", color: "red" });
        return;
      }
      register();

      setMessage({ message: "Successfully registered new user!", color: "default" });
      setUsername("");
      setEmail("");
      setPassword("");
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h2 className="mt-6 text-center text-3xl font-bold">
          {isLogin ? "Sign in" : "Register"}
        </h2>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (<FormField
            name="Username"
            type="text"
            state={username}
            setState={setUsername}
          />)}

          <FormField
            name="Email"
            type="text"
            state={email}
            setState={setEmail}
          />

          <FormField
            name="Password"
            type="password"
            state={password}
            setState={setPassword}
          />

          {message && <div className={`text-sm text-center mt-2 ${message.color === 'red' ? 'text-red-500' : 'text-secondary'}`}>{message.message}</div>}

          <div>
            <button type="submit" className="btn btn-primary w-full">
              {isLogin ? "Sign in" : "Register"}
            </button>
          </div>
        </form>

        <button
          className="text-primary mt-4"
          onClick={() => {
            setIsLogin((isLogin) => !isLogin);
            setMessage({ message: "", color: "default" });
          }}
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
