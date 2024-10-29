import { Avatar, HStack, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../others/AuthContext";
import AdminPanel from "./AdminPanel";
import useTokenData from "../others/useTokenData";
import "./../index.css";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { CheckUserType, GetUserLogin } = useTokenData();

  return (
    <HStack
      display="flex"
      flexDirection="row"
      marginBottom={6}
      alignItems="center"
      height="100%"
    >
      <Link to="/">
        <p>Addon</p>
      </Link>
      <Spacer width="50%"></Spacer>
      {authContext && authContext.isLoggedIn ? (
        <>
          <Avatar margin="0% 0% 0% 2%" boxSize={6}></Avatar>
          <p style={{ margin: "0% 1% 0% 0%" }}>{GetUserLogin()}</p>
          {CheckUserType() == "admin" && <AdminPanel />}
          <button
            className="button_primary"
            onClick={authContext.logout}
            style={{ margin: "0% 0% 0% 2%" }}
          >
            Wyloguj się
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            <button className="button_primary">Zaloguj się</button>
          </Link>
          <Link to="/register">
            <button className="button_primary">Zarejestruj się</button>
          </Link>
        </>
      )}
    </HStack>
  );
};

export default Navbar;
