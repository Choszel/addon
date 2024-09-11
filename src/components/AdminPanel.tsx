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
          <MenuItem>Kategorie</MenuItem>
          <MenuItem>Kategorie</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default AdminPanel;
