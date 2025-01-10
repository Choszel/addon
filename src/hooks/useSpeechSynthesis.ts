const useSpeechSynthesis = (language: string, phrase: string) => {
    const msg = new SpeechSynthesisUtterance();
    console.log("handleSpeak language:", language);
    
    let speakLanguage = "";
    let voiceId = 0;
    switch (language) {
      case "ENG":
        speakLanguage = "en-GB";
        break;
      case "SPA":
        speakLanguage = "es-ES";
        break;
      default:
        speakLanguage = "pl-PL";
        voiceId = 1;
        break;
    }
    msg.lang = speakLanguage;

    const voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === speakLanguage);
    msg.voice = voices[voiceId];
    msg.text = phrase;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

export default useSpeechSynthesis