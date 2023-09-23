import { useUser } from "./context/UserContext";

const UserProfile = () => {
  const { user } = useUser();

  return (
    <div>
      <p>Logged in as {user?.username}</p>
      <p>Balance: {user?.balance}</p>
    </div>
  );
};

export default UserProfile;
