import Timer from "./timer.js"

class Order {
    constructor(data){
        this.title = data.title
        this.stationName = data.stationName
        this.id = data.id
        this.sign = data.sign
        this.create()
    }

    create(){
        let ordersContainer = document.getElementById('orders')
        ordersContainer.innerHTML = "";
        ordersContainer.insertAdjacentHTML('afterbegin', `
            <div id="card-${this.id}" class="card card-margin">
                <div class="cardbody has-background-info pt-0">
                    <div class="widget-49">
                        <div class="widget-49-title-wrapper">
                            <div class="widget-49-meeting-info">
                                <span class="widget-49-pro-title">${this.stationName}</span>
                            </div>
                            <div class="widget-49-date-primary">
                                <span class="widget-49-date-day" id="time-${this.id}" data-info="expire"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
        this.time = new Timer(20, this.id)
    }
}
export default Order
