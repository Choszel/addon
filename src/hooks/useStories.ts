import useData from "./useData";
import { AmountOfQuestions } from "./useQuizzes";

export interface Story {
  id: number | null;
  quiz_id: number | null;
  text: string | null;
}

export interface StoryQuestion{
  id: number | null;
  quiz_id: number | null;
  question: string | null;
  done?: boolean | null;
}

export interface StoryAnswear{
  id: number | null;
  question_id: number | null;
  answear: string | null;
  correct: boolean | null;
}

const useStories = (quiz_id?: number) =>{

  const fetchStories = () =>{
    return useData<Story>(
      "/stories",
      {
        params: {
          quiz_id: quiz_id ?? "",
        },
      },
      [quiz_id ?? ""]
    );
  }

  const fetchStoriesQuestions =() =>{
    return useData<StoryQuestion>(
      "/storiesQuestions",
      {
        params: {
          quiz_id: quiz_id ?? "",
        },
      },
      [quiz_id ?? ""]
    );
  }

  const fetchStoriesAnswers =(question_id : number) =>{
    return useData<StoryAnswear>(
      "/storiesAnswers",
      {
        params: {
          question_id: question_id ?? "",
        },
      },
      [question_id ?? ""]
    );
  }

  const fetchUserQuestions = (language: string, id?: number, userId?: number) => {
    return useData<StoryQuestion>(
      "/usersStoriesQuestions",
      {
        params: { language: language, id: id, userId: userId },
      },
      [id, userId]
    );
  };

  const fetchAmountOfQuestions = (id: number) => {
    return useData<AmountOfQuestions>(
      "/storiesQuestions/Count",
      {
        params: { id: id },
      },
      [id]
    );
  };
  return {fetchStories, fetchStoriesQuestions,fetchStoriesAnswers, fetchUserQuestions, fetchAmountOfQuestions}
}
export default useStories;
