import React, { createContext, useEffect ,useState} from 'react'
import axios from "axios"
export const userDataContext = createContext();

function userContext({children}) {
    const serverUrl = "https://assistant-mern-backend.onrender.com";
    const [userData,setUserData] = useState(null);
    const [frontendImage,SetFrontendImage]= useState(null);
    const [backendImage,setBackendImage]= useState(null);
    const [selectedImage,setSelectedImage]= useState(null)
    const [userLoading,setUserLoading]= useState(true) // true until /current has answered

    const handleCurrentUser = async ()=>{
      try{
         const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
         setUserData(result.data);
      }catch(error){
         // 401 here just means "not signed in" - that's normal on first visit
         setUserData(null);
      }finally{
         setUserLoading(false);
      }
    }
// fetching gemini response from the backend

    const getGeminiResponse= async (command)=>{
      try{
           const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
           return result.data;
      }catch(err){
        console.log(err);
        // return the server's error body ({response:"..."}) so callers never get undefined
        return err.response?.data || {response:"Sorry, something went wrong."};
      }
    }
     
    useEffect(()=>{
      handleCurrentUser()
    },[])

    const value ={
        serverUrl,userData,setUserData,frontendImage,SetFrontendImage,backendImage,setBackendImage,
        selectedImage,setSelectedImage,getGeminiResponse,userLoading
    }
  return (
  <div>
    <userDataContext.Provider value={value}>
        {children}
    </userDataContext.Provider>
      
  </div>
  )
}

export default userContext
