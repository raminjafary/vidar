import http from 'http'

const host = 'localhost'
const port = 4000

const server = http.createServer(async function reqHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')

  let data = ''

  req.on('data', function (chunk) {
    data += chunk
  })

  req.on('end', function parse() {
    res.end(data)
  })
})

server.listen(port, host, function listen() {
  console.log(`Server is running on http://${host}:${port}`)
})
