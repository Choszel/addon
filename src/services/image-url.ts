import noImage from '../assets/no-image-placeholder-6f3882e0.webp'

const getCroppedImageUrl = (image: string | null)=>{
    if(!image || image === "")return noImage;
    else{
        return image;
    }   
}

export default getCroppedImageUrl;