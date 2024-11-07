import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import "./index.css";

const Layout = () => {
  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav" "main"`,
        }}
        templateColumns={{
          base: "1fr",
        }}
        height="100%"
        backgroundColor="var(--primary)"
        borderBottomRadius="30px"
      >
        <GridItem
          area="nav"
          backgroundColor="var(--primary)"
          borderRadius="30px"
          paddingX={10}
          alignContent="center"
        >
          <Navbar />
        </GridItem>
        <GridItem
          area="main"
          height="100%"
          backgroundColor="var(--foreground)"
          borderRadius="20px"
          padding={6}
        >
          <main>
            <Outlet />
          </main>
        </GridItem>
      </Grid>
    </>
  );
};

export default Layout;
