import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Theme from './theme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const ColorSchemeContext = createContext({});

export default function TopLayout({ children }) {
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [dark, setDark] = useState(prefersDark);

  return (
    <React.Fragment>
      <Helmet>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <ColorSchemeContext.Provider value={{ dark, setDark }}>
        <Theme>{children}</Theme>
      </ColorSchemeContext.Provider>
    </React.Fragment>
  );
}

TopLayout.propTypes = {
  children: PropTypes.node,
};
