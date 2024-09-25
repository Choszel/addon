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

const UserProfile = () => {
  const { login } = useParams();
  const { data: userData } = useUsers(login);
  const { CheckUserType } = useTokenData();
  const [quizQuery, setQuizQuery] = useState<QuizQuery>({} as QuizQuery);
  const { fetchUserScores } = useQuizzesQuestions();
  const { data, error, isLoading } = fetchUserScores(userData[0]?.id);
  const skeletons = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    setQuizQuery({ ...quizQuery, user: userData[0]?.name });
  }, [userData]);

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
          </HStack>
          <Tabs isFitted variant="enclosed" marginTop="3%">
            <TabList mb="1em">
              <Tab _selected={{ bg: "whitesmoke" }}>Rozpoczęte zestawy</Tab>
              <Tab _selected={{ bg: "whitesmoke" }}>Utworzone zestawy</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid
                  columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
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
                      ></QuizCard>
                    </QuizCardContainer>
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <QuizGrid quizQuery={quizQuery}></QuizGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ))}
    </>
  );
};

export default UserProfile;
