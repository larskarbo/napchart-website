require('dotenv').config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `Napchart`,
    siteUrl: `https://napchart.com`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `napchart.com`,
      },
    },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `content`,
    //     path: `${__dirname}/src/content`, <- gave error on netlify, check fileparty
    //   },
    // },
    'gatsby-plugin-postcss',
    `gatsby-plugin-netlify`,
    // {
    //   resolve: `gatsby-transformer-remark`,
    //   options: {
    //     plugins: [
    //       {
    //         resolve: `gatsby-remark-images`,
    //         options: {
    //           // Options here
    //           maxWidth: 630,
    //         },
    //       },
    //       `gatsby-remark-smartypants`,
    //     ],
    //   },
    // },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    // `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Napchart`,
        short_name: `Napchart`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/logo.svg`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        // exclude: [`/projects/`, `/consulting/`],
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
}
