import "./App.css";
import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./Navbar/Navbar";
import Main from "./Main/Main";

function App() {
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
        <GridItem area="nav">
          <Navbar />
        </GridItem>
        <GridItem area="main" height="100%" marginX="8%">
          <Main></Main>
        </GridItem>
        {/* <GridItem area="aside" bgColor="green"></GridItem> */}
      </Grid>
    </>
  );
}

export default App;
