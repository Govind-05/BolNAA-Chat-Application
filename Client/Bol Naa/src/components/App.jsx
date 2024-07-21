import Login from "./Login";
import Home from "./Home";
import { useState } from "react";
import UserState from "../context/UserState";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    }, {
      path: "/",
      element: <Home />
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
