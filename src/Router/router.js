import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Editor from "../Pages/Editor";
import Play from "../Pages/Play";
import Classic from "../Pages/Classic";
import Entry from "../Pages/Entry";
import Main from "../Layout/Main";

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
                        element: <Entry/>,
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
            },
            {
                path: "classic",
                element: <Classic />,
                children: []
            }
        ]
        
    }
    
    
]);

export default router;