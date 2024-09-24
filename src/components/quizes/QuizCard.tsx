import {
  Box,
  Card,
  CardBody,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import QuizDetails from "./QuizDetails";
import { LuArrowLeft } from "react-icons/lu";

interface Props {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card
        border="solid black 1px"
        borderRadius={10}
        overflow="hidden"
        bg="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        // color="var(--neutral1)"
        onClick={onOpen}
      >
        <CardBody>
          <Heading fontSize="xl">{quiz?.title}</Heading>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <p>Twórca: {quiz.user ?? "No user"}</p>
            <p>Język: {quiz.language ?? "No language"}</p>
            <HStack>
              {" "}
              <p>Kategria: </p>
              <button className="gradient_button">
                {quiz.category ?? "No category"}
              </button>
            </HStack>
            <HStack>
              <p>Poziom: </p>
              <button className="gradient_button">
                {quiz.level ?? "No level"}
              </button>
            </HStack>
          </Box>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <HStack marginY="5%" width="75%" onClick={onClose} cursor="pointer">
              <LuArrowLeft size={32} />
              <Text
                textTransform="uppercase"
                className="product_list_text_main"
                marginX="5%"
              >
                {" "}
                Powrót
              </Text>
            </HStack>
            <QuizDetails quiz={quiz}></QuizDetails>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuizCard;
