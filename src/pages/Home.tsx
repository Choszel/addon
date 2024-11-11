import { Box, HStack, Image } from "@chakra-ui/react";
import book from "../assets/world-book-day.png";
import cards from "../assets/card-game.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <p className="p2">
        Addon to internetowa aplikacja do nauki języków obcych. Szukasz
        tłumaczenia jakiegoś słowa? A może chcesz rozwiązać jeden z zestawów do
        nauki? Wystarczy wybrać jedną z poniższych opcji!
      </p>
      <h1 style={{ margin: "3%" }}>Czego teraz potrzebujesz?</h1>
      <HStack
        display="flex"
        justifyContent="center"
        spacing={10}
        marginBottom="3%"
      >
        <Box width="40%">
          <Link to="/dictionary" className="gradient_box">
            <p className="p2">Słownik</p>
            <Image
              src={book}
              boxSize={20}
              marginTop={10}
              userSelect="none"
              alignSelf="start"
            ></Image>
          </Link>
        </Box>
        <Box width="40%">
          <Link to="/flashcards" className="gradient_box">
            <p className="p2">Fiszki i gry</p>
            <Image
              src={cards}
              boxSize={20}
              marginTop={10}
              alignSelf="end"
              userSelect="none"
            ></Image>
          </Link>
        </Box>
      </HStack>
    </div>
  );
};

export default Home;
