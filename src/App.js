import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./component/login"
import './App.css';


function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
