// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.htmlFor
// Allowing console calls below since this is build file.
/*eslint-disable no-console*/
process.env.NODE_ENV = 'production'
import fs from 'fs-extra'
import webpack from 'webpack'
import webpackConfig from '../config/webpack.config.prod'
import colors from 'colors'
import { getStyles } from 'simple-universal-style-loader'
import path from 'path'
let env = process.env.NODE_ENV || 'production'
let baseDirName = 'dist'
let clientInfo = path.join(baseDirName, 'client_info.json')

console.log('Generating minified bundle for production via Webpack. This will take a moment...'.blue)

webpack(webpackConfig).run((err, stats) => {
  if (err) { // so a fatal error occurred. Stop here
    console.log(err.bold.red)
    return 1
  }

  const jsonStats = stats.toJson()

  if (jsonStats.hasErrors) {
    return jsonStats.error.map(error => console.log(error.red))
  }

  if (jsonStats.hasWarnings) {
    console.log('Webpack generated the following warnings: '.bold.yellow)
    jsonStats.warning.map(warning => console.log(warning.yellow))
  }

  let {hash, version, assetsByChunkName} = jsonStats

  // Generate JSON file with info about assets.
  writeClientInfo({hash, version, assetsByChunkName})
    .then(function () {
      console.log('Client info file generated: ', clientInfo)
    },
    function (e) {
      console.log('ERROR: ', e)
    })

  console.log('Webpack generated the following warnings: '.bold.yellow)

  // if we got this far, the build succeded
  console.log('Your app has been compiled in production mode and wittern to /' + baseDirName + '. It\'s ready to roll!'.green)

  return 0
})

function writeClientInfo (data) {
  return new Promise((resolve, reject) => {
    fs.writeJson(clientInfo, data, function (err) {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}
