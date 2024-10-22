import { QuizQuery } from "../components/quizes/QuizGrid";
import useData from "./useData";

export interface Quiz{
    id: number | null;
    title: string | null;
    user: string | null;
    language: string | null;
    execution_date: Date | string | null;
    type: string | null;
}

const useQuizzes = (quizQuery: QuizQuery) => useData<Quiz>("/quizzes", 
{params: {
    id: quizQuery.id,
    user: quizQuery.user,
    language: quizQuery.language,
    name: quizQuery.quizName}}, 
[quizQuery]);

  

export default useQuizzes;