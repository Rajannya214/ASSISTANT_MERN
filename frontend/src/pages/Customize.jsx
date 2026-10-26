import React, { useContext, useRef, useState } from 'react'
import { RiImageAddLine } from "react-icons/ri";
import AI1 from '../assets/image1.png'
import AI3 from '../assets/image2.jpg'
import AI4 from '../assets/image4.png'
import AI5 from '../assets/image5.png'
import AI6 from '../assets/image6.jpeg'
import AI7 from '../assets/image7.jpeg'
import Card from '../assets/components/Card'
import { userDataContext } from '../context/userContext'
import { Navigate, useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';


const Customize = () => {

  const inputImage = useRef();
  const {serverUrl,userData,setUserData,frontendImage,SetFrontendImage,backendImage,setBackendImage,
  selectedImage,setSelectedImage}=useContext(userDataContext);
  const navigate=useNavigate();
  
  //handling input image selecby user
  const handleImage = (e)=>{
    const file = e.target.files[0];
    setBackendImage(file);
    SetFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className='w-full h-screen bg-linear-to-t from-[rgb(0,0,0)] to-[#2145b4] flex justify-center items-center flex-col'>
      <IoArrowBackSharp className='absolute top-7.5 left-7.5 text-white w-6.25 h-6.25 font-bold cursor-pointer'onClick={()=>navigate("/")} />

      <h1 className='text-white text-[30px] text-center mb-7.5 font-sans font-bold'>Select your <span className='text-[33px] text-blue-300 font-bold'>Assistant image</span></h1>
        <div className='w-[90%] max-w-225 flex justify-center items-center flex-wrap gap-4.25'>
          <Card image={AI1}/>
          <Card image={AI3}/>
          <Card image={AI4}/>
          <Card image={AI5}/>
          <Card image={AI6}/>
          <Card image={AI7}/>
           <div className={`w-20 h-40 lg:w-37.5 lg:h-62.5 bg-[#030326] border-2 border-white rounded-2xl overflow-hidden hover:shadow hover:shadow-amber-400 cursor-pointer hover:border-4 hover:border-black flex items-center justify-center ${selectedImage=="input"?"border-5 border-blue-300 shadow-2xl shadow-amber-50 ":null}`} onClick={()=>{inputImage.current.click()
           setSelectedImage("input") 
           }}> 
            {!frontendImage && <RiImageAddLine className='text-white w-6.25 h-6.25' />}
            {frontendImage && <img src={frontendImage} className='h-full object-cover overflow-hidden'/>}
          </div>
          <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
        </div>
        {selectedImage && <button className="min-w-37.5 h-15 bg-blue-400 rounded-full text-[20px] text-white cursor-pointer font-semibold shadow-md hover:bg-blue-600 hover:border-2 hover:text-white hover:shadow-lg transition duration-300 mt-7.5 " onClick={()=>navigate("/customize2")}>Next</button>}
        
    </div>
  )
}

export default Customize