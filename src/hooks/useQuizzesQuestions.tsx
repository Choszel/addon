import useData from "./useData";
import { Quiz } from "./useQuizzes";

export interface QuizQuestion {
  id: number | null;
  quizzes_id: number | null;
  question_id: number | null;
  word_second: string | null;
  ws_definition: string | null;
  ws_level_id: number | null;
  ws_category_id: number | null;
  word_polish: string | null;
  wp_definition: string | null;
  wp_category_id: number | null;
  wp_photo: string | null;
  done?: boolean | null;
}

export interface UserQuizQuestion {
  id: number | null;
  users_quizzes_scores_id: number | null;
  quizzes_questions_id: number | null;
}

export interface AmountOfQuestions {
  amount_of_questions: number;
}

const useQuizzesQuestions = () => {
  const fetchENG = (id?: number) => {
    return useData<QuizQuestion>(
      "/quizzesQuestions/ENG",
      {
        params: { id: id },
      },
      [id]
    );
  };

  const fetchUserScores = (id: number) => {
    return useData<Quiz>(
      "/usersQuizzesScores",
      {
        params: { id: id },
      },
      [id]
    );
  };

  const fetchUserQuestionsDetailed = (id?: number, userId?: number) => {
    return useData<QuizQuestion>(
      "/usersQuizzesQuestionsDetailed",
      {
        params: { id: id, userId: userId },
      },
      [id, userId]
    );
  };

  const fetchUserQuestions = (id?: number) => {
    return useData<UserQuizQuestion>(
      "/usersQuizzesQuestions",
      {
        params: { id: id },
      },
      [id]
    );
  };

  const fetchAmountOfQuestions = (id: number) => {
    return useData<AmountOfQuestions>(
      "/quizzesQuestions/Count",
      {
        params: { id: id },
      },
      [id]
    );
  };

  return {
    fetchENG,
    fetchUserScores,
    fetchUserQuestions,
    fetchUserQuestionsDetailed,
    fetchAmountOfQuestions,
  };
};

export default useQuizzesQuestions;
