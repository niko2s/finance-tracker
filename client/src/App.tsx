import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import { User } from "./types";

function App() {
  const [user, setUser] = useState<User | undefined>();

  return (
    <>
      <p className="text-5xl text-center bg-blue-200">Finance Tracker</p>
      {!user && <Login setUser={setUser} />}

      {!!user && (
        <div className="bg-green-200">
          <p>Your profile</p>
          <p>Username: {user.username}</p>
          <p>Balance: {user.balance}</p>
        </div>
      )}
    </>
  );
}

export default App;
