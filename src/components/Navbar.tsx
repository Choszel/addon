import { HStack, Show, Spacer } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../others/AuthContext";
import AdminPanel from "./AdminPanel";
import useTokenData from "../others/useTokenData";
import "./../index.css";
import { MdAccountCircle } from "react-icons/md";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { CheckUserType, GetUserLogin } = useTokenData();
  const navigate = useNavigate();

  return (
    <HStack
      display="flex"
      flexDirection="row"
      marginBottom={6}
      alignItems="center"
      height="100%"
    >
      <Link to="/" id="main-page-navigator">
        <p>Addon</p>
      </Link>
      <Spacer width="50%"></Spacer>
      {authContext && authContext.isLoggedIn ? (
        <>
          <HStack
            onClick={() => navigate("/user/details/" + GetUserLogin())}
            spacing={3}
            marginX="2%"
            cursor="pointer"
          >
            <MdAccountCircle size={30} />
            <Show above="sm">
              <p>{GetUserLogin()}</p>
            </Show>
          </HStack>
          {["admin", "warden"].includes(CheckUserType()) ? (
            <AdminPanel />
          ) : (
            <button
              className="button_primary"
              onClick={authContext.logout}
              style={{ margin: "0% 0% 0% 2%" }}
            >
              Wyloguj się
            </button>
          )}
        </>
      ) : (
        <>
          <Link to="/login">
            <button className="button_primary" name="login-button">
              Zaloguj się
            </button>
          </Link>
          <Show above="sm">
            <Link to="/register">
              <button className="button_primary">Zarejestruj się</button>
            </Link>
          </Show>
        </>
      )}
    </HStack>
  );
};

export default Navbar;
