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
          icon={<FiMenu color="var(--neutral4)" size={25} />}
          variant="outline"
        ></MenuButton>
        <MenuList>
          <Link to="/category">
            <MenuItem>Kategorie</MenuItem>
          </Link>
          <Link to="/difficultyLevel">
            <MenuItem>Poziomy Trudności</MenuItem>
          </Link>
          <Link to="/language">
            <MenuItem>Języki</MenuItem>
          </Link>
          <Link to="/user">
            <MenuItem>Użytkownicy</MenuItem>
          </Link>
          <Link to="/missingPhrases">
            <MenuItem>Brakujące frazy</MenuItem>
          </Link>
          <Link to="/wordsPolish">
            <MenuItem>Polskie słowa</MenuItem>
          </Link>
          <Link to="/wordsEnglish">
            <MenuItem>Angielskie słowa</MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </>
  );
};

export default AdminPanel;
