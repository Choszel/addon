import useData from "./useData";
import { SecondWord } from "./useWordsEnglish";

const useWordsSpanish = (id?: number) => {

  const fetchAll = () =>{
    const config = id ? { params: { id: id } } : {};

    return useData<SecondWord>("/wordsSpanish", config);
  }

    const fetchAllDetailed = () =>{
      const config = id ? { params: { id: id } } : {};
  
      return useData<SecondWord>("/wordsSpanishDetailed", config);
    }
    return {fetchAll, fetchAllDetailed}
  };
  

export default useWordsSpanish;