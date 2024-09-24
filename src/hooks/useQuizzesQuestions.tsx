import useData from "./useData";

export interface QuizQuestion {
  id: number | null;
  quizzes_id: number | null;
  question_id: number | null;
  type: string | null;
  word_english: string | null;
  we_definition: string | null;
  we_level_id: number | null;
  we_category_id: number | null;
  word_polish: string | null;
  wp_definition: string | null;
  wp_caategory_id: number | null;
  wp_photo: string | null;
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
  return { fetchENG };
};

export default useQuizzesQuestions;
