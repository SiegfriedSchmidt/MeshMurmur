import {createHashRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import CallPage from "./pages/CallPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import {useState} from "react";
import {UserData} from "@/types/user.ts";
import {getDefaultUserData} from "@/defaultContext/getDefaultUserData.ts";
import {UserDataContext} from "./context/UserDataContext.tsx";

const router = createHashRouter(createRoutesFromElements(
  <Route element={<RootLayout/>}>
    <Route index element={<HomePage/>}/>
    <Route path="call" element={<CallPage/>}/>
    <Route path="*" element={<NotFoundPage/>}/>
      <Route path="landing" element={<LandingPage/>}/>
  </Route>
))

const defaultUserData = await getDefaultUserData()

function App() {
  const [userData, setUserData] = useState<UserData>(defaultUserData)

  return (
    <UserDataContext.Provider value={{userData, setUserData}}>
      <RouterProvider router={router}/>
    </UserDataContext.Provider>
  )
}

export default App
