import { useEffect, useState } from "react";
import QuizGrid, { QuizQuery } from "../components/quizes/QuizGrid";
import SearchInput from "../components/quizes/SearchInput";
import Flame from "../assets/Fire-Blaze-PNG-Image-Background.png";
import { HStack, Show, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import useDifficultyLevels from "../hooks/useDifficultyLevels";

const FlashcardsHome = () => {
  const { id } = useParams();
  const [quizQuery, setQuizQuery] = useState<QuizQuery>({} as QuizQuery);
  const [searchValue, setSearchValue] = useState<string>("");
  const { data: categories } = useCategories();
  const { data: levels } = useDifficultyLevels();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  useEffect(() => {
    const values = searchValue.split(" ");
    let title: string = "";
    let user: string = "";
    values.forEach((value) => {
      if (!value.startsWith("@")) title += value;
      else user = value.substring(1);
    });
    console.log("title", title);
    console.log("user", user);
    setQuizQuery({ ...quizQuery, title, user });
  }, [searchValue]);

  useEffect(() => {}, [selectedCategory]);

  useEffect(() => {
    console.log(selectedLevel);
  }, [selectedLevel]);

  return (
    <>
      <Stack
        display="flex"
        justify="center"
        align="center"
        direction={{ base: "column", md: "row" }}
      >
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        ></SearchInput>
        <button
          className="button_secondary"
          onClick={() => navigate("/quiz/create")}
        >
          Stwórz własny quiz
        </button>
      </Stack>
      <Stack
        display="flex"
        justify="center"
        align="center"
        spacing={5}
        direction={{ base: "column", md: "row" }}
        marginY={{ base: "10%", md: "1%" }}
      >
        <select
          className="select-primary"
          defaultValue={0}
          onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
        >
          <option key={"category0"} value={0} className="select-primary-option">
            Wybierz kategorię
          </option>
          {categories.map((category) => (
            <option
              key={"category" + category.id}
              value={category.id}
              className="select-primary-option"
            >
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="select-primary"
          defaultValue={0}
          onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
        >
          <option key={"level0"} value={0}>
            Wybierz poziom trudności
          </option>
          {levels.map((level) => (
            <option key={"category" + level.id} value={level.id}>
              {level.level}
            </option>
          ))}
        </select>
      </Stack>
      <HStack marginY="2%" align="center">
        <Show above="md">
          <h1>Lista zestawów do nauki na Topie</h1>
          <img src={Flame} width="60px"></img>
        </Show>
        <Show below="md">
          <Text className="p2">Lista zestawów do nauki na Topie</Text>
          <img src={Flame} width="50px"></img>
        </Show>
      </HStack>
      <QuizGrid
        quizQuery={quizQuery}
        quiz_id={id}
        selectedCategory={selectedCategory}
        selectedLevel={selectedLevel}
      ></QuizGrid>
    </>
  );
};

export default FlashcardsHome;
