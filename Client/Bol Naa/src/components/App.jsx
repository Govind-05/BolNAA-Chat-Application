import Login from "./Login";
import Home from "./Home";
import { useState } from "react";
import UserState from "../context/UserState";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


function App() {

  const [isLogin, setIsLogin] = useState({
    loginState:false,
    userName:""
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login setIsLogin={setIsLogin} />,
    }, {
      path: "/home",
      element: <Home isLogin={isLogin} setIsLogin={setIsLogin}/>
    }
  ]);

  return (
    <>
        <UserState>
          <RouterProvider router={router} />
        </UserState>
    </>
  )
}

export default App
