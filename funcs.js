




class RoboBoat {
    constructor(lat, lon) {
        this.lat = lat
        this.lon = lon
        this.random = 0
        this.geo_fence_lat = .0004
        this.step_size = .00001
    }
    get_loc() {
        this.lat = this.lat - this.step_size + this.random
        this.lon = this.lon
        return [this.lat, this.lon]
    }
}
        
