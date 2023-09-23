import "./App.css";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import { useUser } from "./components/context/UserContext";

function App() {
  const { user } = useUser(); // Use the hook to get user from context

  //use effect here to fetch user with cookie if cookie exists !?
  //also add refresh token 

  return (
    <>
      <p className="text-5xl text-center bg-blue-200">Finance Tracker</p>
      {!user && <Login />}
      {!!user && <UserProfile />}
    </>
  );
}

export default App;
