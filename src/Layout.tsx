import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav" "main"`,
          //lg: `"nav nav" "aside main"`,
        }}
        templateColumns={{
          base: "1fr",
          //lg: "200px 1fr",
        }}
        height="100%"
      >
        <GridItem area="nav" marginX="2%">
          <Navbar />
        </GridItem>
        <GridItem area="main" height="100%" marginX="8%">
          <main>
            <Outlet />
          </main>
        </GridItem>
        {/* <GridItem area="aside" bgColor="green"></GridItem> */}
      </Grid>
    </>
  );
};

export default Layout;
