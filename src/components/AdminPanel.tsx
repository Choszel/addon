import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import useTokenData from "../others/useTokenData";
import { useContext } from "react";
import { AuthContext } from "../others/AuthContext";

const AdminPanel = () => {
  const { CheckUserType } = useTokenData();
  const authContext = useContext(AuthContext);
  const menuItems = [
    { path: "/category", phrase: "Kategorie" },
    { path: "/difficultyLevel", phrase: "Poziomy Trudności" },
    { path: "/missingPhrases", phrase: "Brakujące frazy" },
    { path: "/wordsPolish", phrase: "Polskie słowa" },
    { path: "/wordsEnglish", phrase: "Angielskie słowa" },
    { path: "/wordsSpanish", phrase: "Hiszpańskie słowa" },
  ];
  const menuAdminItems = [
    { path: "/stories", phrase: "Historie" },
    { path: "/language", phrase: "Języki" },
    { path: "/user", phrase: "Użytkownicy" },
  ];

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<FiMenu color="var(--content)" size={25} />}
          variant="outline"
          borderColor="var(--border)"
          borderWidth="2px"
        ></MenuButton>
        <MenuList bg="var(--foreground)" borderColor="var(--border)">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <MenuItem
                bg="var(--foreground)"
                color="var(--copy)"
                _hover={{ color: "var(--secondary)" }}
              >
                {item.phrase}
              </MenuItem>
            </Link>
          ))}
          {CheckUserType() == "admin" ? (
            <>
              {menuAdminItems.map((item) => (
                <Link to={item.path} key={item.path}>
                  <MenuItem
                    bg="var(--foreground)"
                    color="var(--copy)"
                    _hover={{ color: "var(--secondary)" }}
                  >
                    {item.phrase}
                  </MenuItem>
                </Link>
              ))}
            </>
          ) : null}
          {authContext && authContext.isLoggedIn && (
            <button
              className="button_primary"
              onClick={authContext.logout}
              style={{ margin: "0% 0% 0% 2%" }}
            >
              Wyloguj się
            </button>
          )}
        </MenuList>
      </Menu>
    </>
  );
};

export default AdminPanel;
