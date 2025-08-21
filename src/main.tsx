import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register service worker with cleanup
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('SW registered: ', registration);
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
}

// Force re-render on HMR updates to prevent hook issues
const root = createRoot(document.getElementById('root')!);

function renderApp() {
  root.render(
    <StrictMode>
      <App key={Date.now()} />
    </StrictMode>
  );
}

renderApp();

// Handle HMR updates
if (import.meta.hot) {
  import.meta.hot.accept('./App.tsx', () => {
    renderApp();
  });
}
