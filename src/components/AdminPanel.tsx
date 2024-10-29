import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminPanel = () => {
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
          <Link to="/category">
            <MenuItem
              bg="var(--foreground)"
              _hover={{ color: "var(--secondary)" }}
            >
              Kategorie
            </MenuItem>
          </Link>
          <Link to="/difficultyLevel">
            <MenuItem
              bg="var(--foreground)"
              _hover={{ color: "var(--secondary)" }}
            >
              Poziomy Trudności
            </MenuItem>
          </Link>
          <Link to="/language">
            <MenuItem
              bg="var(--foreground)"
              _hover={{ color: "var(--secondary)" }}
            >
              Języki
            </MenuItem>
          </Link>
          <Link to="/missingPhrases">
            <MenuItem
              bg="var(--foreground)"
              _hover={{ color: "var(--secondary)" }}
            >
              Brakujące frazy
            </MenuItem>
          </Link>
          <Link to="/wordsPolish">
            <MenuItem
              bg="var(--foreground)"
              _hover={{ color: "var(--secondary)" }}
            >
              Polskie słowa
            </MenuItem>
          </Link>
          <Link to="/wordsEnglish">
            <MenuItem
              bg="var(--foreground)"
              _hover={{ color: "var(--secondary)" }}
            >
              Angielskie słowa
            </MenuItem>
          </Link>
          <Link to="/user">
            <MenuItem
              bg="var(--foreground)"
              _hover={{ color: "var(--secondary)" }}
            >
              Użytkownicy
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </>
  );
};

export default AdminPanel;
