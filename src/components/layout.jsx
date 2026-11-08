import { useContext } from 'react';
import styled from 'styled-components';
import Switch from '@mui/material/Switch';
import './layout.css';
import { ColorSchemeContext } from './TopLayout';

const Layout = ({ children }) => {
  const { dark, setDark } = useContext(ColorSchemeContext);

  return (
    <>
      <DarkModeToggleContainer>
        <DarkModeIcon>
          {dark ? (
            <span role="img" aria-label="Dark Mode">
              🌚
            </span>
          ) : (
            <span role="img" aria-label="Light Mode">
              🌝
            </span>
          )}
        </DarkModeIcon>
        <Switch
          aria-label="Toggle Dark Mode"
          color="secondary"
          onChange={(e, value) => setDark(value)}
          checked={dark}
        />
      </DarkModeToggleContainer>

      <main>{children}</main>
    </>
  );
};

export default Layout;

const DarkModeIcon = styled.div`
  pointer-events: none;
`;

const DarkModeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 20px;
`;
