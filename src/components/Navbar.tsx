import { Avatar, HStack, Spacer } from "@chakra-ui/react";
import { SlGlobe } from "react-icons/sl";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <HStack display="flex" marginBottom={6}>
        <Link to="/">
          <p>Logo</p>
        </Link>
        <Spacer width="50%"></Spacer>
        <SlGlobe size={20} />
        <p>PL</p>
        <Avatar margin="0% 0% 0% 2%" boxSize={6}></Avatar>
        <p>Nazwa użytkownika</p>
      </HStack>
    </div>
  );
};

export default Navbar;
