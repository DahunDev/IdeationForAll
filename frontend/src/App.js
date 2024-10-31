// import logo from './logo.svg';
import "./App.css";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/loginPage";
import Workboard from "./components/workboard";
import { getBackendUrl, loadServerSettings } from "./configs/serverSettings";
import { useEffect, useState } from "react";

function App() {
  const [backendUrl, setBackendUrl] = useState("");

  // Load server settings on app start
  useEffect(() => {
    async function fetchSettings() {
      // console.log('Fetching server settings'); // Log when fetchSettings is called

      await loadServerSettings(); // Load the settings
      setBackendUrl(getBackendUrl()); // Set the backend URL in state
    }
    fetchSettings();
  }, []);

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
