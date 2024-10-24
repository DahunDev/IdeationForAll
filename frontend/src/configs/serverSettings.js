import serverSettings from './serverSettings.json'; // Import JSON file

let backendUrl = ''; // Variable to store the backend URL

// Function to load server settings from serverSettings.json
export const loadServerSettings = async () => {
    // console.log('loadServerSettings() called'); // Log when the function is called

  try {
    backendUrl = serverSettings.backendURLWithPort; // Set the backend URL
  } catch (error) {
    console.error('Error loading server settings:', error);
  }
};

// Function to get the backend URL globally
export const getBackendUrl = () => {
  if (!backendUrl) {
    console.error('Backend URL is not set. Ensure that loadServerSettings is called.');
  }
  return backendUrl;
};
