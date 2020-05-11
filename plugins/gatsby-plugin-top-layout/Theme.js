import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import useCreateMuiTheme from "../../src/theme/useCreateMuiTheme";
// import theme from "../../src/theme/theme.old";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const Theme = ({ children }) => {
  const theme = useCreateMuiTheme();

  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </StyledThemeProvider>
    </ThemeProvider>
  );
};

export default Theme;
