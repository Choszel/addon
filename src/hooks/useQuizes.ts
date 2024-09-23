import { QuizQuery } from "../components/quizes/QuizGrid";
import useData from "./useData";

export interface Quiz{
    id: number | null;
    title: string | null;
    user: string | null;
    level: string | null;
    category: string | null;
    language: string | null;
}

const useQuizes = (quizQuery: QuizQuery) => useData<Quiz>("/quizzes", 
{params: {
    level: quizQuery.level, 
    category: quizQuery.category,
    user: quizQuery.user,
    language: quizQuery.language,
    name: quizQuery.quizName}}, 
[quizQuery]);

  

export default useQuizes;