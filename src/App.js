import axios from 'axios';
import './App.css';
import { Outlet } from 'react-router';

const api = axios.create({
  baseURL: "https://emkc.org/api/v2/piston"
});

function App() {

  return (
    <div className="">
      <Outlet />
    </div>
  );
}

export default App;
