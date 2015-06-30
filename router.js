var routes = require('routes')(),
        fs = require('fs'),
        db = require('monk')('localhost/festivals'),
 festivals = db.get('festivals')

 var qs = require('qs')

 routes.addRoute('/festivals', (req, res, url) => {
   console.log(url.route)
   res.setHeader('Content-Type', 'text/html')
   if (req.method === 'GET') {
     festivals.find({}, function (err, docs) {
       var template = ''
       docs.forEach(function (doc) {
         template += '<h2><a href="/festivals/' + doc._id + '">' + doc.name + '</a></h2>'
       })
     res.end(template)
     })
   }

if (req.method === 'POST') {
  var data = ''
  req.on('data', function (chunk) {
    data += chunk
  })

req.on('end', function () {
  var festival = qs.parse(data)
  festivals.insert(festival, function (err, doc) {
    if (err) res.end ('ooops from insert')
     res.writeHead(302, {'Location': '/festivals'})
     res.end()
     })
   })
 }
})

routes.addRoute('/festivals/new', (req, res, url) => {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html')
    fs.readFile('./templates/festivals/new.html', function (err, file) {
      if (err) res.end('boop')
      res.end (file.toString())
      })
    }
  })

routes.addRoute('/festivals/:id', (req, res, url) => {
  console.log(url.params.id)
  if (req.method === 'GET') {
    festivals.findOne({_id: url.params.id}, function (err, doc) {
      if (err) console.log('fucked up')
      res.end(doc.name.toString())
    })
  }
})

module.exports = routes
