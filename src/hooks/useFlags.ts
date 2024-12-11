import noImage from '../assets/no-image-placeholder-6f3882e0.webp'

const getFlag = (language: string | null)=>{
    switch(language){
        case "PLN":
            return "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/90px-Flag_of_Poland.svg.png"; 
        case "ENG":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/90px-Flag_of_the_United_Kingdom_%281-2%29.svg.png";
        case "SPA":
            return "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/90px-Flag_of_Spain.svg.png";
        default: return noImage
    }
}

export default getFlag;