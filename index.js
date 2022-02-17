import Map from './class/map.js'
import Marker from './class/Marker.js'

async function getData(url) {
    map.init(L)
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

const baseUrl = `https://api.jcdecaux.com/vls/v3/stations?contract=%city%&apiKey=dee1a99085af190d99b3ebd9b448222bdf23b493`
const map = new Map(L)
map.init()

document.getElementById('btn').addEventListener('click', (e) => {
    let newUrl = baseUrl.replace('%city%', document.getElementById('city').value)
    map.deleteMarkers()
    getData(newUrl).then(stations => {
        if (!stations.error) {
            map.setDefaultPos([stations[0].position.latitude, stations[0].position.longitude])
            stations.forEach(station => {new Marker(station,'', map.getMap(), L).create();});
        } else {
            alert("La ville cherché n'existe pas dans notre base de donné")
        }
    })

    let reserveButtons = document.querySelectorAll('button[data-utility]')
    reserveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            let stationId = button.getAttribute('data-station-id')
            localStorage.setItem('stationId', stationId)
        })
    })

})
