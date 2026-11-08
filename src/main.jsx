import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TopLayout from './components/TopLayout';
import IndexPage from './pages/index';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TopLayout>
      <IndexPage />
    </TopLayout>
  </StrictMode>,
);
