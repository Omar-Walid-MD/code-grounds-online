import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Play from "../Pages/Play";
import Home from "../Pages/Home";
import MainLayout from "../Layout/MainLayout";
import PlayLayout from "../Layout/PlayLayout";

import WaitingRoom from "../Pages/WaitingRoom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import Debug from "../Pages/Debug";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <MainLayout />,
                children: [
                    {
                        path: "",
                        element: <Home/>,
                        children: []
                    },
                    {
                        path: "/wait",
                        element: <WaitingRoom />,
                        children: []
                    },
                    {
                        path: "login",
                        element: <Login />,
                        children: []
                    },
                    {
                        path: "register",
                        element: <Register />,
                        children: []
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                        children: []
                    },
                    {
                        path: "debug",
                        element: <Debug />
                    }
                ]
            },
            {
                path: "",
                element: <PlayLayout />,
                children: [
                    {
                        path: "play",
                        element: <Play />,
                        children: []
                    }
                ]
            }
        ]
        
    }
    
    
]);

export default router;