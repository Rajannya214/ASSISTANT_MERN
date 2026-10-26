import React, { useContext } from 'react'
import { userDataContext } from "../../context/userContext";
const Card = ({image}) => {
  const {serverUrl,userData,setUserData,frontendImage,SetFrontendImage,backendImage,setBackendImage,
  selectedImage,setSelectedImage}=useContext(userDataContext);
    
   //handling selected image by user and storing into a veriable for further use 
  return (
    <div className={`w-20 h-40 lg:w-37.5 lg:h-62.5 bg-[#030326]  border-blue-200 rounded-2xl overflow-hidden hover:shadow hover:shadow-amber-400 cursor-pointer hover:border-4 hover:border-black ${selectedImage==image?"border-5 border-blue-300 shadow-2xl shadow-amber-50 ":null}`} onClick={()=>{
      setSelectedImage(image);
      setBackendImage(null);
      SetFrontendImage(null);
      }}>
        <img src={image} className='h-full object-cover' />
    </div>
  )
}

export default Card