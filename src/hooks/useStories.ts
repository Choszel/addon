import useData from "./useData";

export interface Story {
  id: number | null;
  quiz_id: number | null;
  text: string | null;
}

export interface StoryQuestion{
  id: number | null;
  quiz_id: number | null;
  question: string | null;
}

export interface StoryAnswear{
  id: number | null;
  quiz_id: number | null;
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

  return {fetchStories, fetchStoriesQuestions,fetchStoriesAnswers}
}
export default useStories;
