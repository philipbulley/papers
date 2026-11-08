module.exports = {
  siteMetadata: {
    title: `Papers Time Machine`,
    description: `A small yet neat little time machine of newspaper front pages`,
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
  ],
};
