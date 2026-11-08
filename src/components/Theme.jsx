import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import useCreateMuiTheme from '../theme/useCreateMuiTheme';

const Theme = ({ children }) => {
  const theme = useCreateMuiTheme();

  return (
    // injectFirst lets styled-components styles override MUI's
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </StyledThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Theme;
