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

  useEffect(() => {
    setLoading(true)
    const storedPhrases = getPhrasesFromLocalStorage(languageCode);
    setSavedPhrases(storedPhrases);
    setLoading(false)
  }, [languageCode]);


  const addToSavedPhrases = (phrase: localStoragePhrase) => {
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

  const clearPhraseLocalStorage = () => {
      localStorage.removeItem("translations_pol_" + languageCode.toLowerCase());
      return;
  }

  return { savedPhrases, error, isLoading, addToSavedPhrases, removeFromSavedPhrases, setError, clearPhraseLocalStorage };
};

const getPhrasesFromLocalStorage = (languageCode: string): localStoragePhrase[] => {
    const savedPhrases = localStorage.getItem("translations_pol_" + languageCode.toLowerCase());
    return savedPhrases ? JSON.parse(savedPhrases) : [];  
};

const savePhrasesToLocalStorage = (languageCode: string, savedPhrases: localStoragePhrase[]) => { 
    localStorage.setItem("translations_pol_" + languageCode.toLowerCase(), JSON.stringify(savedPhrases));
    return;
};

export default usePhrasesStorage;

