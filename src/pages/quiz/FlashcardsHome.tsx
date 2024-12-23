import { useEffect, useState } from "react";
import QuizGrid, { QuizQuery } from "../../components/quiz/QuizGrid";
import SearchInput from "../../components/quiz/SearchInput";
import Flame from "../../assets/Fire-Blaze-PNG-Image-Background.png";
import { HStack, Show, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import useLanguages from "../../hooks/useLanguages";
import useTokenData from "../../others/useTokenData";
import useQuizzes from "../../hooks/useQuizzes";

const FlashcardsHome = () => {
  const { id } = useParams();
  const [quizQuery, setQuizQuery] = useState<QuizQuery>({} as QuizQuery);
  const { fetchQuizzes } = useQuizzes();
  const { data, error, isLoading } = fetchQuizzes(quizQuery);
  const { GetUserId } = useTokenData();
  const [searchValue, setSearchValue] = useState<string>("");
  const { data: languages } = useLanguages();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  useEffect(() => {
    const values = searchValue.split(" ");
    let title: string = "";
    let user: string = "";
    values.forEach((value) => {
      if (!value.startsWith("@")) title += value + " ";
      else user = value.substring(1);
    });

    title = title.substring(0, title.length - 1);
    setQuizQuery({ ...quizQuery, title, user });
  }, [searchValue]);

  useEffect(() => {
    let language = selectedLanguage;
    setQuizQuery({ ...quizQuery, language });
  }, [selectedLanguage]);

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
          name="create-quiz"
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
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option
            key={"language0"}
            value={""}
            className="select-primary-option"
          >
            Wybierz język
          </option>
          {languages.map((language) =>
            language.code != "POL" ? (
              <option
                key={"language" + language.id}
                value={language.code}
                className="select-primary-option"
              >
                {language.code}
              </option>
            ) : null
          )}
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
        quiz_id={id}
        data={data}
        error={error}
        isLoading={isLoading}
        userId={GetUserId()}
      ></QuizGrid>
    </>
  );
};

export default FlashcardsHome;
