const useSpeechSynthesis = (language: string, phrase: string) => {
    const msg = new SpeechSynthesisUtterance();
    console.log("handleSpeak language:", language);
    
    let speakLanguage = "";
    let voiceId = 1;
    switch (language) {
      case "ENG":
        speakLanguage = "en-GB";
        voiceId = 0;
        break;
      case "SPA":
        speakLanguage = "es-ES";
        voiceId = 0;
        break;
      default:
        speakLanguage = "pl-PL";
        break;
    }
    msg.lang = speakLanguage;

    const voices = speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === speakLanguage);
    msg.voice = voices[voiceId];
    msg.text = phrase;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

export default useSpeechSynthesis