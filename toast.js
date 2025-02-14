// Code credit to Chris Biscardi

const {promises: fs} = require('fs')
const path = require('path')
const MDXPostsSource = require('./fetch-mdx-posts')
const eggheadSeriesSource = require('./fetch-egghead-series')

exports.sourceData = async (toastStuff) => {
  const {withCache, createPage, publicDir} = toastStuff
  console.log(toastStuff)
  return Promise.all([
    withCache('mdx-posts', MDXPostsSource.sourceData({createPage})),
    withCache(
      'egghead-series',
      eggheadSeriesSource.sourceData({createPage, publicDir}),
    ),
  ])
}

exports.prepData = async ({cacheDir, publicDir}) => {
  // have to make sure the directory we want to write in exists
  // We can probably avoid this by offering some kind of "non-filesystem"-based
  // API for adding data to paths
  await fs.mkdir(path.resolve(publicDir, 'src/pages'), {recursive: true})

  // prep page data for index and post pages
  const mdxPostsData = require(path.resolve(cacheDir, 'mdx-posts.json'))
  const seriesData = require(path.resolve(cacheDir, 'egghead-series.json'))

  const allSeriesData = seriesData.map(
    ({title, square_cover_128_url, slug, description}) => ({
      title,
      image: square_cover_128_url,
      slug,
      description,
      contentType: 'course',
    }),
  )

  await fs.writeFile(
    path.resolve(publicDir, 'src/pages/courses.json'),
    JSON.stringify({courses: allSeriesData}),
  )

  const allPostsData = mdxPostsData.map(({title, date, slug, description}) => ({
    title,
    updatedAt: date,
    slug,
    description,
    contentType: 'post',
  }))
  await fs.writeFile(
    path.resolve(publicDir, 'src/pages/garden.json'),
    JSON.stringify({posts: allPostsData}),
  )

  // index.html
  const topPostsData = allPostsData
    .sort((b, a) => {
      const da = new Date(a.updatedAt).getTime()
      const db = new Date(b.updatedAt).getTime()
      if (da < db) return -1
      if (da === db) return 0
      if (da > db) return 1
    })
    .filter(({contentType}) => contentType === 'post')
    .slice(0, 5)

  await fs.writeFile(
    path.resolve(publicDir, 'src/pages/index.json'),
    JSON.stringify({posts: topPostsData}),
  )
}
