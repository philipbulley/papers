import { useContext, useMemo } from 'react';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ColorSchemeContext } from '../components/TopLayout';

const useCreateMuiTheme = () => {
  let { dark } = useContext(ColorSchemeContext);

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: dark
            ? {
                mode: 'dark',
                primary: { main: '#f4f5f4', contrastText: '#fff' },
                secondary: { main: '#b12122', contrastText: '#fff' },
                // Keep the Material UI v4 dark background
                background: { default: '#303030' },
              }
            : {
                mode: 'light',
                primary: { main: '#b12122', contrastText: '#000' },
                secondary: { main: '#fff', contrastText: '#000' },
                text: { primary: '#b12122' },
                // Keep the Material UI v4 light background
                background: { default: '#fafafa' },
              },
          components: {
            MuiPaper: {
              styleOverrides: {
                root: {
                  backgroundColor: dark ? '#111' : '#f4f5f4',
                  // Disable the dark mode elevation overlay added after v4
                  backgroundImage: 'none',
                },
              },
            },
            MuiDialogContentText: {
              styleOverrides: {
                // Keep the Material UI v4 paragraph spacing
                root: { marginBottom: 12 },
              },
            },
          },
        }),
      ),
    [dark],
  );

  return theme;
};

export default useCreateMuiTheme;
