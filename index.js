const jsonServer = require('json-server')
var db = require('./db.json')
var server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.date = (new Date()).getTime()
  }
  next()
})

// after
server.post("/comments", (req, res, next) => {
    let _db = {...db}

    let allSymbol = _db.symbols.find(item => item.postId === req.body.postId)
    
    
    let isAuthor = _db.posts.find(item => item.id == req.body.postId && item.author == req.body.author)

    // create symbol if not exits
    if (!allSymbol) {
        let sId = _db.symbols[_db.symbols.length - 1].id + 1
        allSymbol = {
            "id": sId,
            "symbols": {},
            "postId": req.body.postId
        }
    }

    // random symbol if user not exits
    if (isAuthor) {
        req.body.symbol = '๐'
    }else if (!allSymbol.symbols[req.body.author]){
        let s = randomSymbol(Object.values(allSymbol.symbols))
        allSymbol.symbols[req.body.author] = s
        req.body.symbol = s
    }else{
        req.body.symbol = allSymbol.symbols[req.body.author]
    }
    _db.symbols.push(allSymbol)
    server = jsonServer.router(_db)
    next()
})

// Use default router
server.use(router)

server.listen(process.env.PORT || 8000, () => {
  console.log('JSON Server is running at ' + (process.env.PORT || 8000))
})



function randomSymbol(notIn = []) {
    const items = ['๐','๐','๐','๐','๐','๐','๐','๐คฃ','๐ฅฒ','๐','๐','๐','๐','๐','๐','๐','๐ฅฐ','๐','๐','๐','๐','๐','๐','๐','๐','๐คช','๐คจ','๐ง','๐ค','๐','๐ฅธ','๐คฉ','๐ฅณ','๐','๐','๐ซ','๐ฅบ','๐ข','๐ญ','๐ค','๐ ','๐ก','๐คฌ','๐คฏ','๐ณ','๐ฅต','๐ฅถ','๐ฑ','๐จ','๐','๐ค'];
    if (notIn.length >= items.length){
        return '???'
    }
    let rand = items[Math.floor(Math.random() * items.length)];
    if (notIn.includes(rand)){
        rand = randomSymbol(notIn)
    }
    return rand;
}