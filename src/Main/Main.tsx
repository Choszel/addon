import { Card, HStack, Image } from "@chakra-ui/react";
import book from "../assets/world-book-day.png";
import cards from "../assets/card-game.png";

const Main = () => {
  return (
    <div>
      <text className="p2">
        [Nazwa strony] to internetowa aplikacja do nauki języków obcych. Szukasz
        tłumaczenia jakiegoś słowa? A może chcesz rozwiązać jeden z zestawów do
        nauki? Wystarczy wybrać jedną z poniższych opcji!
      </text>
      <h1 style={{ margin: "3%" }}>Czego teraz potrzebujesz?</h1>
      <HStack
        display="flex"
        justifyContent="center"
        spacing={10}
        marginBottom="3%"
      >
        <Card
          bg="var(--gradient-top)"
          padding={8}
          w="40%"
          display="flex"
          flexDirection="column"
        >
          <text className="p2">Słownik</text>
          <Image
            src={book}
            boxSize={20}
            marginTop={10}
            userSelect="none"
          ></Image>
        </Card>
        <Card
          bg="var(--gradient-top)"
          padding={8}
          w="40%"
          display="flex"
          flexDirection="column"
        >
          <text className="p2">Fiszki i gry</text>
          <Image
            src={cards}
            boxSize={20}
            marginTop={10}
            alignSelf="end"
            userSelect="none"
          ></Image>
        </Card>
      </HStack>
    </div>
  );
};

export default Main;
