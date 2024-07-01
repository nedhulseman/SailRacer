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
    constructor(lat, lon) {
        this.lat = lat
        this.lon = lon
        this.userid = null
        this.colors = ['blue', 'blue', 'red', 'green', 'purple']
        this.color = null
        this.random = 0
        this.geo_fence_lat = .0004
        this.step_size = .001
        this.location_history = []
    }
    add_user_info(userid) {
        this.userid = userid
        this.color = this.colors[this.userid]
        this.adjustments = {}
        this.adjustments['blue'] = 38.8580
        this.adjustments['red'] = 38.8583
        this.adjustments['green'] = 38.8589
        this.adjustments['purple'] = 38.8582

        this.lat = this.adjustments[this.color];
        console.log(this.lat)

    }
    get_loc() {
        this.lon = this.lon + this.step_size;
        this.lat = this.lat;
        this.location_history.push([this.lat, this.lon]);
    }
    updateLocation(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        this.location_history.push([this.lat, this.lon]);
    }

}
io.on('connection', function (socket) {
    console.log('a user has connected!');
    users_count = users_count + 1;
    io.emit('connection', users_count);

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });


    socket.on('update-location', function (user_obj) {
        users[user_obj.userid] = user_obj
        for (const [key, value] of Object.entries(users)) {
            console.log(`${key}: ${value.color}`);
            console.log(`${key}: ${value.lat}`);
            console.log(`${key}: ${value.lon}`);
        }
        io.emit('sync-locations-map', users);
    });
});
