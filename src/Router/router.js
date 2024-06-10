import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Editor from "../Pages/Editor";
import Play from "../Pages/Play";
import Home from "../Pages/Home";
import Main from "../Layout/Main";
import WaitingRoom from "../Pages/WaitingRoom";

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
                    }
                ]
            },
            
            {
                path: "editor",
                element: <Editor />,
                children: []
            }
        ]
        
    }
    
    
]);

export default router;