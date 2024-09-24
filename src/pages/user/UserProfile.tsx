import { useParams } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import { Avatar, HStack } from "@chakra-ui/react";
import useTokenData from "../../others/useTokenData";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const UserProfile = () => {
  const { login } = useParams();
  const { data: userData } = useUsers(login);
  const { CheckUserType } = useTokenData();
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
              <Tab _selected={{ bg: "whitesmoke" }}>Ukończone zestawy</Tab>
              <Tab _selected={{ bg: "whitesmoke" }}>Utworzone zestawy</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>one!</p>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ))}
    </>
  );
};

export default UserProfile;
