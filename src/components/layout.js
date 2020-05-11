/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useContext } from "react";
import PropTypes from "prop-types";
// import { useStaticQuery, graphql } from "gatsby";

// import Header from './header';
import "./layout.css";
import { ColorSchemeContext } from "../../plugins/gatsby-plugin-top-layout/TopLayout";
import styled from "styled-components";
import Switch from "@material-ui/core/Switch";

const Layout = ({ children }) => {
  // const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `);
  const { dark, setDark } = useContext(ColorSchemeContext);

  return (
    <>
      {/*<Header siteTitle={data.site.siteMetadata.title} />*/}
      {/*<div*/}
      {/*  style={{*/}
      {/*    margin: `0 auto`,*/}
      {/*    maxWidth: 960,*/}
      {/*    padding: `0 1.0875rem 1.45rem`,*/}
      {/*  }}*/}
      {/*>*/}
      <DarkModeToggleContainer>
        <DarkModeIcon>
          {dark ? (
            <span role="image" aria-label="Dark Mode">
              🌚
            </span>
          ) : (
            <span role="image" aria-label="Light Mode">
              🌝
            </span>
          )}
        </DarkModeIcon>
        <Switch
          aria-label="Toggle Dark Mode"
          onChange={(e, value) => setDark(value)}
          checked={dark}
        />
      </DarkModeToggleContainer>

      <main>{children}</main>
      {/*  <footer>*/}
      {/*    © {new Date().getFullYear()}, Built with*/}
      {/*    {` `}*/}
      {/*    <a href="https://www.gatsbyjs.org">Gatsby</a>*/}
      {/*  </footer>*/}
      {/*</div>*/}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
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
