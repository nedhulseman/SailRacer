var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const PORT = 3000;

app.get('/', function( req, res ) {
res.sendFile(__dirname + '/public/index.html');
});


http.listen(PORT, function () {
    console.log('listening on *: ' + PORT);
});
var users_count = 0;
var upvote_count = 0;
var users = {};
class RoboBoat {
    constructor(lat, lon, socket_id) {
        this.lat = lat
        this.lon = lon
        this.userid = null
        this.socket_id = socket_id
        this.colors = ['blue', 'blue', 'red', 'green', 'purple']
        //this.color = this.colors[user_num];
        this.color = 'blue';
        this.random = 0
        this.geo_fence_lat = .0004
        this.step_size = .001
        this.location_history = []
    }
    updateLocation(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        this.location_history.push([this.lat, this.lon]);
    }

}
io.on('connection', function (socket) {
    console.log('a user has connected!');
    users[socket.id] = new RoboBoat(0, 0, socket.id);
    io.emit('connection');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });


    setInterval(function () {
        io.emit('request-location');
    }, 5000);
    socket.on('get-location', function (socket_id, location) {
        console.log(socket_id, location);
        users[socket_id].updateLocation(location[0], location[1]);
        io.emit('push-location-html', users);
    });
});




//socket.on('update-location', function (user_obj) {
//    users[user_obj.userid] = user_obj
//    for (const [key, value] of Object.entries(users)) {
//        console.log(`${key}: ${value.color}`);
//        console.log(`${key}: ${value.lat}`);
//        console.log(`${key}: ${value.lon}`);
//    }
//    io.emit('sync-locations-map', users);
//});

