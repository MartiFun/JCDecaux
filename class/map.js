class Map {
    constructor(layer){
        this.layer = layer
        this.map = this.layer.map('map').setView([51.505, -0.09], 13);
    }

    init(){
        this.layer.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(this.map);
    }

    getMap(){
        return this.map
    }

    setDefaultPos(pos){
        this.map.setView(pos, 13);
    }

    deleteMarkers(){
        this.map.eachLayer((layer) => {
            layer.remove();
        });
    }
}
export default Map