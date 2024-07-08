import axios from 'axios';
import './App.css';
import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser, setUser } from './Store/Auth/authSlice';
import { auth } from './Firebase/firebase';
import { getUser } from './Firebase/DataHandlers/users';

const api = axios.create({
  baseURL: "https://emkc.org/api/v2/piston"
});

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
          dispatch(setUser(JSON.parse(localStorage.getItem("user"))))
        }
      }
      else dispatch(setUser(null));
    });
  },[]);



  return (
    <div className="">
      <Outlet />
    </div>
  );
}

export default App;
