import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  goBackTo: string;
  saveProgress?: boolean;
}

const EndOfTheQuizModal = ({ isOpen, goBackTo, saveProgress }: Props) => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate(goBackTo);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="basic_style">Koniec quizu</ModalHeader>
        <ModalBody className="basic_style">
          <p>
            Gratulacje! Udało ci się dotrzeć do końca quizu.{" "}
            {saveProgress == true ? "Postępy zostały zapisane." : null}
          </p>
        </ModalBody>

        <ModalFooter className="basic_style">
          <button className="button_primary" onClick={onClose}>
            Powrót
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EndOfTheQuizModal;
