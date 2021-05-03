// IMPORT NECESSARY LIBRARIES
const express = require('express') //web framework library
const app = express()
const http = require('http').Server(app) 
const io = require('socket.io')(http)  //websocket library
const path = require('path')           // file read-write module
const bodyParser = require('body-parser')
const fs = require('fs')

// SET LOCAL JSON DB
let localJsonDB = fs.readFileSync('data.json')
console.log("Deleting Previous Record")
let dbSchema = {
    "time": [],
    "temperature": []
}
fs.writeFileSync('data.json', JSON.stringify(dbSchema) )


// SET MIDDLEWARES & PUBLIC DIRECTORY
app.use('/public',express.static(__dirname + '/public')) // to server static files like JS and CSS
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


// DEFINE ROUTES
app.get('/', (request, respond) => {
    // res.send('On this route you will see chart')
    respond.sendFile(path.join(__dirname+'/html/charts.html'))
})

// THIS ROUTE WILL TAKE POST REQUEST FROM ESP8266
app.post('/esp8266', (request,respond)=>{
    data = request.body

    //get TimeStamp
    var time = new Date()
    time = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()

    //Update local DB
    let localJsonDB = fs.readFileSync('data.json')
    let DBdata = JSON.parse(localJsonDB)
    DBdata.time.push(time)
    DBdata.temperature.push(data.value)
    fs.writeFileSync('data.json', JSON.stringify(DBdata))
    
    //broadcast data to client
    data["time"] = time
    io.sockets.emit("pushData", data)
    respond.sendStatus(200)
})

// THIS ROUTE WILL MAKE CLIENT TO DOWNLOAD DB IN JSON
app.get('/data', (request, respond) => {
    let localJsonDB = fs.readFileSync('data.json')
    let DBdata = JSON.parse(localJsonDB)
    respond.json(DBdata)
})


// SETUP WEB-SOCKET WITH SOCKET-IO LIBRARY
io.on('connection', function(socket) {
    console.log('Client connected');
    socket.on('disconnect', function () {
       console.log('Client disconnected');
    });
 });

// START SERVER ON PORT 3000 OR ANY DESIRED
http.listen(3000, ()=> {
    console.log("Listening on port 3000")
})
