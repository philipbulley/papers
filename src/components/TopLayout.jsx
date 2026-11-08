import { createContext, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Theme from './Theme';

export const ColorSchemeContext = createContext({});

export default function TopLayout({ children }) {
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [dark, setDark] = useState(prefersDark);

  return (
    <ColorSchemeContext.Provider value={{ dark, setDark }}>
      <Theme>{children}</Theme>
    </ColorSchemeContext.Provider>
  );
}
