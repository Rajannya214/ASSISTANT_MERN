import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Customize2 from './pages/Customize2'
import Home from './pages/Home'
import { userDataContext } from './context/userContext'

const App = () => {
  const { userData, userLoading } = useContext(userDataContext)

  // wait for /api/user/current to answer, otherwise a refresh bounces you to /signin
  if (userLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    )
  }

  const assistantReady = userData?.assistantImage && userData?.assistantName

  return (
    <Routes>
      <Route
        path="/"
        element={
          !userData ? <Navigate to="/signin" /> :
          assistantReady ? <Home /> : <Navigate to="/customize" />
        }
      />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/signin" />} />
      <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/signin" />} />
    </Routes>
  )
}

export default App
