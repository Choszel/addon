import { Avatar, Button, HStack, Spacer } from "@chakra-ui/react";
import { SlGlobe } from "react-icons/sl";
import { Link } from "react-router-dom";
import SelectLanguage from "./SelectLanguage";
import { useContext } from "react";
import { AuthContext } from "../others/AuthContext";
import CheckUserType from "../others/CheckUserType";
import AdminPanel from "./AdminPanel";

const Navbar = () => {
  const authContext = useContext(AuthContext);

  return (
    <div>
      <HStack display="flex" marginBottom={6}>
        <Link to="/">
          <p>Logo</p>
        </Link>
        <Spacer width="50%"></Spacer>
        <SlGlobe size={20} />
        <SelectLanguage />

        {authContext && authContext.isLoggedIn ? (
          <>
            {CheckUserType() == "admin" && <AdminPanel />}
            <Avatar margin="0% 0% 0% 2%" boxSize={6}></Avatar>
            <Button onClick={authContext.logout}>Wyloguj się</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button>Zaloguj się</Button>
            </Link>
            <Link to="/register">
              <Button>Zarejestruj się</Button>
            </Link>
          </>
        )}
      </HStack>
    </div>
  );
};

export default Navbar;
