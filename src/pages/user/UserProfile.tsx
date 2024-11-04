import { useParams } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import { Avatar, HStack, SimpleGrid } from "@chakra-ui/react";
import useTokenData from "../../others/useTokenData";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import QuizGrid, { QuizQuery } from "../../components/quizes/QuizGrid";
import { useEffect, useState } from "react";
import QuizCardContainer from "../../components/quizes/QuizCardContainer";
import QuizCardSkeleton from "../../components/quizes/QuizCardSkeleton";
import QuizCard from "../../components/quizes/QuizCard";
import useQuizzesQuestions from "../../hooks/useQuizzesQuestions";
import actionData from "../../hooks/actionData";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";

const UserProfile = () => {
  const { login } = useParams();
  const { data: userData } = useUsers(login);
  const { CheckUserType } = useTokenData();
  const [quizQuery, setQuizQuery] = useState<QuizQuery>({} as QuizQuery);
  const { fetchUserScores } = useQuizzesQuestions();
  const { data, error, isLoading } = fetchUserScores(userData[0]?.id);
  const skeletons = [1, 2, 3, 4, 5, 6];
  const { putData } = actionData("/users");
  const { data: categories } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();

  useEffect(() => {
    setQuizQuery({ ...quizQuery, user: userData[0]?.login });
  }, [userData]);

  const upgradeUser = () => {
    const formData = new URLSearchParams();
    formData.append("login", userData[0].login);
    formData.append("user_type", userData[0].user_type == 0 ? "1" : "0");
    putData(formData);
    window.location.reload();
  };

  return (
    <>
      {userData.map((user) => (
        <>
          <HStack>
            <Avatar boxSize={150}></Avatar>
            <div style={{ marginInline: "3%" }}>
              <p>{user.login}</p>
              <p>{CheckUserType(user.user_type)}</p>
            </div>
            {user.user_type != 2 && CheckUserType() == "admin" ? (
              <button className="button_secondary" onClick={upgradeUser}>
                {user.user_type == 0
                  ? "Przemianuj użytkownika"
                  : "Zdegraduj użytkownika"}
              </button>
            ) : null}
          </HStack>
          <Tabs isFitted variant="enclosed" marginTop="3%">
            <TabList mb="1em">
              <Tab
                _selected={{
                  background: "var(--primary-dark)",
                  color: "var(--primary-content)",
                }}
              >
                Rozpoczęte zestawy
              </Tab>
              <Tab
                _selected={{
                  background: "var(--primary-dark)",
                  color: "var(--primary-content)",
                }}
              >
                Utworzone zestawy
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid
                  columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
                  padding={8}
                  spacing={6}
                >
                  {isLoading &&
                    skeletons.map((skeleton) => (
                      <QuizCardContainer key={skeleton}>
                        <QuizCardSkeleton />
                      </QuizCardContainer>
                    ))}
                  {data.map((quiz) => (
                    <QuizCardContainer key={quiz.id}>
                      <QuizCard
                        quiz={quiz}
                        isScore={true}
                        userId={userData[0]?.id}
                        categories={categories}
                        difficultyLevels={difficultyLevels}
                        selectedCategory={0}
                        selectedLevel={0}
                      ></QuizCard>
                    </QuizCardContainer>
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <QuizGrid
                  quizQuery={quizQuery}
                  selectedCategory={0}
                  selectedLevel={0}
                ></QuizGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ))}
    </>
  );
};

export default UserProfile;
