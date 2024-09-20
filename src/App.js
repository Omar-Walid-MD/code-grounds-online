import axios from 'axios';
import './App.css';
import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser, setUser } from './Store/Auth/authSlice';
import { auth } from './Firebase/firebase';
import { getUser } from './Firebase/DataHandlers/users';
import { socket } from './socketClient/socketClient';
import { getTutorialPopupsDisbled } from './Store/Settings/settingsSlice';

const api = axios.create({
  baseURL: "https://emkc.org/api/v2/piston"
});

// Function to remove error overlays containing the specific message
const removeResizeObserverError = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.id==="webpack-dev-server-client-overlay") {

            setTimeout(() => {
              if(node.contentWindow.document.querySelector("div").innerHTML.includes("ResizeObserver loop completed with undelivered notifications."))
              {
                node.style.display = "none";
              }
            }, 10);
          }

        }
      });
    });
  });

  // Start observing the document body
  observer.observe(document.body, { childList: true, subtree: true });
};

// Execute the function to start observing
removeResizeObserverError();



function App() {

  const dispatch = useDispatch();

  useEffect(()=>{
    
    auth.onAuthStateChanged(function(user)
    {
      if(user)
      {
        if(!user.isAnonymous)
        {
          (async()=>{
            dispatch(setUser({
              userId: user.uid,
              email: user.email,
              ...await getUser(user.uid)
            }))
          })();
        }
        else
        {
          dispatch(setUser(null));
          // dispatch(setUser(JSON.parse(localStorage.getItem("user"))))
        }
      }
      else dispatch(setUser(null));
    });
  },[]);

  useEffect(()=>{
    socket.emit("try-connect");
    dispatch(getTutorialPopupsDisbled())
  },[]);

  return (
    <div className="">
      <Outlet />
    </div>
  );
}

export default App;
