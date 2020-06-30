// Code credit to Chris Biscardi

const fs = require('fs').promises
const path = require('path')
const frontmatter = require('gray-matter')
const mdx = require('@mdx-js/mdx')
const rehypeSlug = require('rehype-slug')
const cloudinary = require('rehype-local-image-to-cloudinary')
const rehypePrism = require('./rehype-prism-plugin')

const allSeries = require('./data/series.json')

exports.sourceData = async (toastStuff) => {
  const {createPage, publicDir, ...options} = toastStuff

  await fs.mkdir(path.resolve('./public/courses'), {recursive: true})

  return Promise.all(
    allSeries.map(async (series) => {
      const file = await fs.readFile(`./src/templates/course.js`, 'utf-8')
      const slug = `courses/${series.slug}`

      try {
        await createPage({
          module: file,
          slug: slug,
          data: {...series, slug},
        })
      } catch (error) {
        console.error(error)
      }

      // Data to be stored in `mdx-posts.json` file
      return {
        ...series,
        slug,
      }
    }),
  )
}
