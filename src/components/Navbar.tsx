import { Avatar, Button, HStack, Select, Spacer } from "@chakra-ui/react";
import { SlGlobe } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../others/AuthContext";
import AdminPanel from "./AdminPanel";
import useTokenData from "../others/useTokenData";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { CheckUserType, GetUserLogin } = useTokenData();
  const languages = ["PLN", "ENG"];

  return (
    <div>
      <HStack display="flex" marginBottom={6}>
        <Link to="/">
          <p>Addon</p>
        </Link>
        <Spacer width="50%"></Spacer>
        <SlGlobe size={20} />
        <Select
          width="10%"
          margin="0%"
          onChange={(event) => {
            console.log(event.target.value);
          }}
        >
          {languages.map((language, index) => (
            <option key={index}>{language}</option>
          ))}
        </Select>

        {authContext && authContext.isLoggedIn ? (
          <>
            <Avatar margin="0% 0% 0% 2%" boxSize={6}></Avatar>
            <p style={{ margin: "0% 1% 0% 0%" }}>{GetUserLogin()}</p>
            {CheckUserType() == "admin" && <AdminPanel />}
            <Button
              onClick={authContext.logout}
              style={{ margin: "0% 0% 0% 2%" }}
            >
              Wyloguj się
            </Button>
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
