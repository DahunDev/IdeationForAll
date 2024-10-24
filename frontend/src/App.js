import logo from './logo.svg';
import './App.css';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/loginPage';
import Workboard from './components/workboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/workspace" element={<Workboard />} />

          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
