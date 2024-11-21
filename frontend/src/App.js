// import logo from './logo.svg';
import "./App.css";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/loginPage";
import Workboard from "./components/workboard";
import { getBackendUrl, loadServerSettings } from "./configs/serverSettings";
import { useEffect, useState } from "react";
import TestPage from "./components/testPage";
import EditAccountPage from "./components/editAccountPage";
import ForgotPassword from "./components/forgotPassword";
import HomeRedirect from "./components/HomeRedirect";

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
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/workspace" element={<Workboard />} />
          <Route path="/workspace/:boardId" element={<Workboard />} />
          <Route path="/edit-account" element={<EditAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/test" element={<TestPage />} />{" "}
          {/* Add TestPage route */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
