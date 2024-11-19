import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";

interface localStoragePhrase{
  translation_id: number;
}

const usePhrasesStorage = (languageCode: string) => {
  const [savedPhrases, setSavedPhrases] = useState<localStoragePhrase[]>(() => getPhrasesFromLocalStorage(languageCode));
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  // const {cookies} = useUserSetCookie();

  useEffect(() => {
    setLoading(true)
    const storedPhrases = getPhrasesFromLocalStorage(languageCode);
    setSavedPhrases(storedPhrases);
    setLoading(false)
  }, []);


  const addToSavedPhrases = (phrase: localStoragePhrase) => {
    // const selectedTranslation = product.translations.find(
    //   (translation) =>
    //     translation.language.languageCode ===
    //     cookies.userSet.language?.languageCode
    // );

    let updatedSavedPhrases = getPhrasesFromLocalStorage(languageCode);
    const existingPhraseIndex = updatedSavedPhrases.findIndex(
      (p: localStoragePhrase) => p.translation_id === phrase.translation_id
    );

    if (existingPhraseIndex !== -1) {
      toast({
        title: "Dany element znajduje się już na liście",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else {
      updatedSavedPhrases.push(phrase);
    }

    savePhrasesToLocalStorage(languageCode, updatedSavedPhrases);
    setSavedPhrases(updatedSavedPhrases);

    toast({
      title: "Pomyślnie dodano do listy",
      status: "success",
      position: "bottom-right",
      duration: 5000,
      isClosable: true,
    });
  };

  const removeFromSavedPhrases = (phraseId: number) => {
    let updatedSavedPhrases = getPhrasesFromLocalStorage(languageCode);
    updatedSavedPhrases = updatedSavedPhrases.filter((p: localStoragePhrase) => p.translation_id !== phraseId);

    savePhrasesToLocalStorage(languageCode, updatedSavedPhrases);
    setSavedPhrases(updatedSavedPhrases);
  };

  const clearLocalStorage = () => {
    switch(languageCode){
      default:
        localStorage.removeItem("translations_pln_eng");
        return 
    }   
  }

  return { savedPhrases, error, isLoading, addToSavedPhrases, removeFromSavedPhrases, setError, clearLocalStorage };
};

const getPhrasesFromLocalStorage = (languageCode: string): localStoragePhrase[] => {
  switch(languageCode){
    default:
      const savedPhrases = localStorage.getItem("translations_pln_eng");
      return savedPhrases ? JSON.parse(savedPhrases) : [];
  }
};

const savePhrasesToLocalStorage = (languageCode: string, savedPhrases: localStoragePhrase[]) => {
  switch(languageCode){
    default:
      localStorage.setItem("translations_pln_eng", JSON.stringify(savedPhrases));
      return;
  }
};

export default usePhrasesStorage;

