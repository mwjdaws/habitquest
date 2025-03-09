
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// Create a client with better error handling defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
})

// Basic error handling for the entire app
try {
  console.log('Starting HabitQuest application...');
  const container = document.getElementById("root");
  
  if (!container) {
    throw new Error('Root element not found. Make sure there is a div with id "root" in your HTML.');
  }
  
  createRoot(container).render(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  );
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
