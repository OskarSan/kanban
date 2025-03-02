//import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Board from './components/Board'
import Register from './components/Register'
import LoginPage from './components/LoginPage'


function App() {

  return (
    <Router>  
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>  
    </Router>  
    
  );
}

export default App;
