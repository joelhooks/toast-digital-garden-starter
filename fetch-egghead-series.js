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
  console.log(toastStuff)

  return Promise.all(
    allSeries.map(async (series) => {
      const file = await fs.readFile(`./src/templates/course.mdx`, 'utf-8')
      let compiledMDX

      const {content} = frontmatter(file)

      try {
        compiledMDX = await mdx(content, {
          rehypePlugins: [
            rehypePrism,
            rehypeSlug,
            [
              cloudinary,
              {
                baseDir: path.join(__dirname, 'courses', 'course', series.slug),
                uploadFolder: 'toast-test',
              },
            ],
          ],
        })
      } catch (e) {
        console.log(e)
        throw e
      }

      await createPage({
        module: `/** @jsx mdx */
            import {mdx} from '@mdx-js/preact';
            ${compiledMDX}`,
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
