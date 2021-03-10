exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path == '/app/') {
    page.matchPath = '/*'
    // Update the page.
    createPage(page)
  }
}
