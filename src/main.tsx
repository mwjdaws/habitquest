import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Sleep from "./pages/Sleep";

// Basic error handling for the entire app
try {
  console.log('Starting HabitQuest application...');
  const container = document.getElementById("root");
  
  if (!container) {
    throw new Error('Root element not found. Make sure there is a div with id "root" in your HTML.');
  }
  
  createRoot(container).render(<App />);
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Failed to render application:', error);
  // Display a user-friendly error message on the page
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; font-family: sans-serif;">
      <h1>Something went wrong</h1>
      <p>We're sorry, but the application failed to load. Please check the console for more details.</p>
    </div>
  `;
}
