import React, { useState } from "react";
import { User } from "../types";
import { useUser } from "../components/context/UserContext";
import { useNavigate } from "react-router-dom";

//maybe refactor into two components
function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //useState to display (error-) message
  //interface for ^ message, e.g. msg, color, ...

  const { setUser } = useUser();

  const api = "http://localhost:8080";

  const getUser = async () => {
    try {
      const response = await fetch(api + `/user`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        //add proper error handling
        throw new Error("Network response not 200");
      }

      const userData = (await response.json()) as User;

      setUser(userData);
      navigate('/home')
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const login = async () => {
    const loginData = {
      email: username,
      password,
    };
    const jsonLoginData = JSON.stringify(loginData);

    try {
      const response = await fetch(api + "/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonLoginData,
      });

      if (!response.ok) {
        //add proper error handling
        throw new Error("Network response not 200");
      }

      //const userData = await response.json();
      //console.log("First userdata: " + userData);

      await getUser();
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
      const response = await fetch(api + "/addUser", {
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
    if (!username || !password) {
      setError("Username and Password are required");
      return;
    }

    if (isLogin) {
      login();
    } else {
      register();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in" : "Register"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div hidden={isLogin}>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required={!isLogin}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? "Sign in" : "Register"}
            </button>
          </div>
        </form>
        <div className="mt-2 text-center">
          <button
            type="button"
            className="text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
