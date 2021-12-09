const jsreport = require('./')({ rootDirectory: __dirname })
jsreport.use(require('jsreport-phantom-image')({ strategy: 'phantom-server', proxy: 'http://tdcproxycorp.actewagl.com.au:8080'}))
if (process.env.JSREPORT_CLI) {
  module.exports = jsreport
} else {
  jsreport.init().then(() => {
    console.log("JSREPORT INITIALISED")
  }).catch((e) => {
    console.log("Error:",e)
    console.trace(e)
    process.exit(1)
  })
}
