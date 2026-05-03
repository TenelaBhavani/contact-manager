import { StrictMode } from 'react'; 
// StrictMode helps identify potential problems in the app (development only)

import { createRoot } from 'react-dom/client'; 
// createRoot is used to render React app into the DOM (new React 18 method)

import './index.css'; 
// Imports global CSS styles (like background, fonts, etc.)

import App from './App.jsx'; 
// Imports the main App component (your contact manager UI)


// Selects the HTML element with id="root" and creates a React root
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    {/* StrictMode wraps the app to enable additional checks and warnings */}
    
    <App />
    {/* This renders your main App component (entire UI starts here) */}
    
  </StrictMode>,
);