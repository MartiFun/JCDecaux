import PopupForm from "./PopupForm.js"
import Order from "./order.js"

class Marker {
    constructor(station, content, map, layer) {
        this.station = station;
        this.position = [station.position.latitude, station.position.longitude];
        this.content = content;
        this.map = map;
        this.layer = layer;
        this.id = station.number;
    }

    create() {
        this.CreateContent()
        let marker = this.layer.marker(this.position)
        marker.addTo(this.map).on('click', (e) => {
            this.layer.popup()
                .setLatLng(this.position)
                .setContent(this.content)
                .openOn(this.map);

            let reserveButton = document.getElementById(`${this.id}`)

            reserveButton.addEventListener('click', (e) => {
                this.Order(marker)
            })
        });
    }

    Order(marker) {
      let title = 'Formulaire de reservation'
      let formObj = {
          firstName: {
            name: "firstName",
            placeholder: "Prénom"
          },
          lastName: {
            name: "lastName",
            placeholder: "Nom"
          }
      }
      const form = new PopupForm(title, marker, formObj, this.station)
    }

    CreateContent() {
        this.content = `<p>${this.station.name}</p>
                        <p>Disponibilité : ${this.station.mainStands.availabilities.bikes} / ${this.station.mainStands.capacity}</p>
                        <p>Etat ${this.station.status === "OPEN" ? '<span class="text-success">ouverte</span>' : '<span class="text-danger">fermée</span>'}</p>
                        <button class="btn btn-primary" id="${this.id}" data-station-id="${this.id}" data-utility="reserve">Réserver</button>`
    }
}
export default Marker
