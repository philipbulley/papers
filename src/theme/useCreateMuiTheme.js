import { useContext, useMemo } from 'react';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ColorSchemeContext } from '../../plugins/gatsby-plugin-top-layout/TopLayout';

const useCreateMuiTheme = () => {
  let { dark } = useContext(ColorSchemeContext);

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createMuiTheme({
          palette: dark
            ? {
                primary: { main: '#f4f5f4', contrastText: '#fff' },
                secondary: { main: '#b12122', contrastText: '#fff' },
                type: 'dark',
              }
            : {
                primary: { main: '#b12122', contrastText: '#000' },
                secondary: { main: '#fff', contrastText: '#000' },
                text: { primary: '#b12122' },
                type: 'light',
              },
          overrides: {
            MuiPaper: {
              root: {
                backgroundColor: dark ? '#111' : '#f4f5f4',
              },
            },
          },
        })
      ),
    [dark]
  );

  return theme;
};

export default useCreateMuiTheme;
