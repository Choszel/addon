export interface StaticText{
    templateText: string,
    translation: string,
}

const useStaticTexts = () => {
    const data: StaticText[] = [
        { templateText: "id", translation: "id" },
        { templateText: "name", translation: "nazwa" },
        { templateText: "level", translation: "poziom" },
        { templateText: "phrase", translation: "fraza" },
        { templateText: "definition", translation: "definicja" },
        { templateText: "code", translation: "kod" },
        { templateText: "category", translation: "kategoria" },
        { templateText: "user", translation: "użyt." },
        { templateText: "word", translation: "fraza" },
        { templateText: "part of speech", translation: "cz. mowy" },
        { templateText: "quiz_id", translation: "quiz_id" },
        { templateText: "text", translation: "tekst" },
        { templateText: "login", translation: "login" },
        { templateText: "user_type", translation: "typ uż." },
        { templateText: "word_second", translation: "fraza" },
    ]

    const findTemplateTextValue = (templateText: string) => {
        let template = data.find(texts => texts.templateText.trim().toLowerCase() == templateText);
        return template?.translation;
    }

    return {findTemplateTextValue};
}

export default useStaticTexts;