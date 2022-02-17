import Order from "./order.js"
import Validator from "./validator.js"

class PopupForm {
    constructor(title, marker, fields = {}, station = {}){
        this.title = title
        this.station = station
        this.marker = marker
        this.fields = fields
        const form = this.create()
        this.sign()
        return form
    }

    async create(){
        let html = []
        let values = {}
        for (const key in this.fields) {
            html.push(`<input id="${this.fields[key].name}" name="${this.fields[key].name}" placeholder="${this.fields[key].placeholder}" class="swal2-input">`)
        }
        const { value: formValues } = await Swal.fire({
            title: this.title,
            html: html.join(' ') + '<br><br>' + `
                <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1>E-Signature</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <canvas id="sig-canvas" height="160">
                        </canvas>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <button class="btn btn-default" id="sig-clearBtn">Effacer</button>
                    </div>
                </div>
            </div>`,
            focusConfirm: false,
            preConfirm: () => {
                for (const key in this.fields) {
                    values[key] = document.getElementById(key).value
                }
                return values
            }
        })

        if (Validator.validate(formValues, ['empty', 'min']) && Validator.errors.length === 0) {
            if (formValues !== undefined) {
                let redMarker = document.querySelector('.huechange')
                if (redMarker !== null) {
                    redMarker.classList.remove('huechange')
                }
                this.marker._icon.classList.add('huechange')
                localStorage.setItem('firstname', formValues.firstName)
                localStorage.setItem('lastname', formValues.lastName)

                let order = new Order({
                    title: "Réservation",
                    stationName: this.station.name,
                    id: this.station.number,
                    sign: localStorage.getItem('signature')
                })

                return formValues
            }
        } else {
            return Swal.fire({
                icon: 'error',
                title: 'Champs invalides',
                html: Validator.errors.join('<br>'),
            }).then(() => {
                this.create()
                this.sign()
            });
        }
    }

    //canvas
    sign(){
        window.requestAnimFrame = (() => {
            return window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimaitonFrame ||
              function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };
          })();

          let canvas = document.getElementById("sig-canvas");
          let ctx = canvas.getContext("2d");
          ctx.strokeStyle = "#222222";
          ctx.lineWidth = 4;

          let drawing = false;
          let mousePos = {
            x: 0,
            y: 0
          };
          let lastPos = mousePos;

          canvas.addEventListener("mousedown", function(e) {
            drawing = true;
            lastPos = getMousePos(canvas, e);
          }, false);

          canvas.addEventListener("mouseup", function(e) {
            drawing = false;
          }, false);

          canvas.addEventListener("mousemove", function(e) {
            mousePos = getMousePos(canvas, e);
          }, false);

          // Add touch event support for mobile
          canvas.addEventListener("touchstart", function(e) {

          }, false);

          canvas.addEventListener("touchmove", function(e) {
            let touch = e.touches[0];
            let me = new MouseEvent("mousemove", {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            canvas.dispatchEvent(me);
          }, false);

          canvas.addEventListener("touchstart", function(e) {
            mousePos = getTouchPos(canvas, e);
            let touch = e.touches[0];
            let me = new MouseEvent("mousedown", {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            canvas.dispatchEvent(me);
          }, false);

          canvas.addEventListener("touchend", function(e) {
            let me = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(me);
          }, false);

          function getMousePos(canvasDom, mouseEvent) {
            let rect = canvasDom.getBoundingClientRect();
            return {
              x: mouseEvent.clientX - rect.left,
              y: mouseEvent.clientY - rect.top
            }
          }

          function getTouchPos(canvasDom, touchEvent) {
            let rect = canvasDom.getBoundingClientRect();
            return {
              x: touchEvent.touches[0].clientX - rect.left,
              y: touchEvent.touches[0].clientY - rect.top
            }
          }

          function renderCanvas() {
            if (drawing) {
              ctx.moveTo(lastPos.x, lastPos.y);
              ctx.lineTo(mousePos.x, mousePos.y);
              ctx.stroke();
              lastPos = mousePos;
            }
          }

          document.body.addEventListener("touchstart", (e) => {
            if (e.target == canvas) {
              e.preventDefault();
            }
          }, false);
          document.body.addEventListener("touchend", (e) => {
            if (e.target == canvas) {
              e.preventDefault();
            }
          }, false);
          document.body.addEventListener("touchmove", (e) => {
            if (e.target == canvas) {
              e.preventDefault();
            }
          }, false);

          (function drawLoop() {
            requestAnimFrame(drawLoop);
            renderCanvas();
          })();

          function clearCanvas() {
            canvas.width = canvas.width;
          }

          let clearBtn = document.getElementById("sig-clearBtn");
          let submitBtn = document.querySelector(".swal2-confirm");

          clearBtn.addEventListener("click", (e) => {
            clearCanvas();
          }, false);
          submitBtn.addEventListener("click", (e) => {
            let dataUrl = canvas.toDataURL();
            localStorage.setItem('signature', dataUrl)
          }, false);
    }

}
export default PopupForm
