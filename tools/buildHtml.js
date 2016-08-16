import fs from 'fs'
import cheerio from 'cheerio' // give us an easy way to interact with the html in memory via jquery selectors.
import colors from 'colors'
import path from 'path'

/*eslint-disable no-console*/
let baseDir = path.join(__dirname, '..', 'dist')

fs.readFile('src/index.html', 'utf8', (err, markup) => {
  if (err) {
    return console.log(err)
  }

  const $ = cheerio.load(markup)

  // since a separate spreadsheet is only utilized for prod build, need to dynamically

  $('head').prepend('<link rel="stylesheet" href="styles.css">')

  fs.writeFile(path.join(baseDir, 'index.html'), $.html(), 'utf8', (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('index.html written to /' + baseDir + '.'.green)
  })
})
