import { useParams } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import { HStack, Spinner, Text } from "@chakra-ui/react";
import useTokenData from "../../others/useTokenData";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import QuizGrid, { QuizQuery } from "../../components/quiz/QuizGrid";
import { useEffect, useState } from "react";
import useQuizzes from "../../hooks/useQuizzes";
import actionData from "../../hooks/actionData";

const UserProfile = () => {
  const { login } = useParams();
  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
  } = useUsers(login);
  const { CheckUserType, GetUserId } = useTokenData();
  const [quizQuery, setQuizQuery] = useState<QuizQuery>({} as QuizQuery);
  const { fetchQuizzes, fetchUserScores } = useQuizzes();
  const {
    data: quizzes,
    error: quizError,
    isLoading: quizLoading,
  } = fetchQuizzes(quizQuery);
  const { data, error, isLoading } = fetchUserScores(userData[0]?.id);
  const { putData } = actionData("/users");

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

  if (userIsLoading) return <Spinner size="xl" />;
  if (userError) return <Text color="var(--error)">{userError}</Text>;

  return (
    <>
      <HStack>
        <div style={{ marginInline: "3%" }}>
          <p>{userData[0]?.login}</p>
          <p>Rola: {CheckUserType(userData[0]?.user_type)}</p>
        </div>
        {userData[0]?.user_type != 2 && CheckUserType() == "admin" ? (
          <button className="button_secondary" onClick={upgradeUser}>
            {userData[0]?.user_type == 0
              ? "Przemianuj użytkownika"
              : "Zdegraduj użytkownika"}
          </button>
        ) : null}
      </HStack>
      <Tabs isFitted variant="enclosed" marginTop={{ base: "10%", md: "3%" }}>
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
          <TabPanel padding={{ base: "0", md: "4" }}>
            <QuizGrid
              data={data}
              error={error}
              isLoading={isLoading}
              userId={GetUserId()}
            ></QuizGrid>
          </TabPanel>
          <TabPanel>
            <QuizGrid
              data={quizzes}
              error={quizError}
              isLoading={quizLoading}
              userId={GetUserId()}
            ></QuizGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserProfile;
