import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <App path={window.location.pathname} />
  </StrictMode>
);

// Production pages are pre-rendered HTML (good for SEO and speed), so React
// "hydrates" them. In `npm run dev` the page renders from scratch.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
