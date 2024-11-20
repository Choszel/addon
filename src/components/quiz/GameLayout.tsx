import { ReactNode } from "react";
import GoBack from "../GoBack";
import Confetti from "react-confetti";
import EndOfTheQuizModal from "./EndOfTheQuizModal";

interface Props {
  children: ReactNode;
  showConfetti: boolean;
  goBack: () => void;
  isModalOpen: boolean;
  saveProgress: boolean;
  quizId: string;
}

const GameLayout = ({
  children,
  showConfetti,
  goBack,
  isModalOpen,
  saveProgress,
  quizId,
}: Props) => {
  return (
    <>
      {showConfetti && (
        <Confetti recycle={false} gravity={0.2} width={window.innerWidth} />
      )}
      <GoBack goBack={goBack} margin="2%" />
      {children}
      <EndOfTheQuizModal
        isOpen={isModalOpen}
        saveProgress={saveProgress}
        goBackTo={"/flashcards/" + quizId}
      ></EndOfTheQuizModal>
    </>
  );
};

export default GameLayout;
