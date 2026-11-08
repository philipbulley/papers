import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TopLayout from './components/TopLayout';
import NotFoundPage from './pages/404';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TopLayout>
      <NotFoundPage />
    </TopLayout>
  </StrictMode>,
);
