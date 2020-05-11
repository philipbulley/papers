module.exports = {
  siteMetadata: {
    title: `Papers`,
    description: `A small yet cool little time machine of newspaper front pages`,
    author: `Papers`,
  },
  plugins: [
    'gatsby-plugin-top-layout',
    {
      resolve: 'gatsby-plugin-material-ui',
      // If you want to use styled components you should change the injection order.
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    // If you want to use styled components you should add the plugin here.
    'gatsby-plugin-styled-components',
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `papers`,
        short_name: `papers`,
        start_url: `/`,
        background_color: `#f4f5f4`,
        theme_color: `#b22222`,
        display: `minimal-ui`,
        icon: `src/images/papers-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
