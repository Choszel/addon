export interface AmountOfQuestions {
  amount_of_questions: number;
}

const useAlphabet = (language: string) => {

    let data: string[] = [
        "A",
        "B",
        "C",
        "Ć",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "Ł",
        "M",
        "N",
        "O",
        "Ó",
        "P",
        "R",
        "S",
        "Ś",
        "T",
        "U",
        "W",
        "Y",
        "Z",
        "Ź",
        "Ż"
      ];

    switch(language){
        case ("ENG"):
            data = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
              ];
            break;
        case ("SPA"):
            data = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "Ñ",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
              ];
            break;
        default:
            break;
    }
  

  return data;
};

export default useAlphabet;
