import { QuizQuery } from "../components/quiz/QuizGrid";
import useData from "./useData";

export interface Quiz{
  id: number | null;
  quiz_score_id?: number | null;
  title: string | null;
  user: string | null;
  language: string | null;
  execution_date: Date | string | null;
  type: string | null;
}

export interface QuizQuestion {
  id: number | null;
  quiz_id: number | null;
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

const useQuizzes = () => {

  const fetchQuizzes = (quizQuery: QuizQuery) => useData<Quiz>("/quizzes", 
    {params: {
        id: quizQuery.id,
        user: quizQuery.user,
        language: quizQuery.language,
        title: quizQuery.title}}, 
    [quizQuery]);

  const fetchQuestions = (language: string, id?: number) => {
    return useData<QuizQuestion>(
      "/quizzesQuestions",
      {
        params: { language: language, id: id },
      },
      [language, id]
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

  const fetchUserQuestionsDetailed = (language: string, id?: number, userId?: number) => {
    return useData<QuizQuestion>(
      "/usersQuizzesQuestionsDetailed",
      {
        params: { language: language, id: id, userId: userId },
      },
      [language, id, userId]
    );
  };

  const fetchUserQuestions = (language: string, id?: number) => {
    return useData<UserQuizQuestion>(
      "/usersQuizzesQuestions",
      {
        params: { language: language, id: id },
      },
      [language, id]
    );
  };

  const fetchAmountOfQuestions = (language: string, id: number) => {
    return useData<AmountOfQuestions>(
      "/quizzesQuestions/Count",
      {
        params: { language: language, id: id },
      },
      [language, id]
    );
  };

  return {
    fetchQuizzes,
    fetchQuestions,
    fetchUserScores,
    fetchUserQuestions,
    fetchUserQuestionsDetailed,
    fetchAmountOfQuestions,
  };
};

export default useQuizzes;
