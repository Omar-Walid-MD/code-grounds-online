import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Editor from "../Pages/Editor";
import Play from "../Pages/Play";
import Home from "../Pages/Home";
import Main from "../Layout/Main";
import WaitingRoom from "../Pages/WaitingRoom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import Background from "../Components/Background";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Main />,
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
                        path: "play",
                        element: <Play />,
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
                    }
                ]
            },
            
            
            {
                path: "editor",
                element: <Editor />,
                children: []
            },
            {
                path:"test",
                element: <Background />,
                children: []
            }
        ]
        
    }
    
    
]);

export default router;