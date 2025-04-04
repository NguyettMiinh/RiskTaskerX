
//1 website co 1 router
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter  as Router} from 'react-router';
import "@fontsource/russo-one";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
        <App />
    </Router>

  </StrictMode>,
)

