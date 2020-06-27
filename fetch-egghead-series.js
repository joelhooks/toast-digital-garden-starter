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
  const {createPage, ...options} = toastStuff

  return Promise.all(
    allSeries.map(async (series) => {
      const file = await fs.readFile(`./src/templates/course.js`, 'utf-8')

      await createPage({
        module: file,
        slug: series.slug,
        data: {...series},
      })

      // Data to be stored in `mdx-posts.json` file
      return {
        ...series,
      }
    }),
  )
}
