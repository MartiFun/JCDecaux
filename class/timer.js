class Timer {
    constructor(time, id){
        this.time = time
        this.id = id
        this.display(this.id)
    }

    create(duration, display){
        let timer = duration, minutes, seconds;
        let intervalSec = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.innerText = minutes + ":" + seconds;
    
            if (--timer < 0) {
                document.querySelector(`#card-${this.id}`).remove()
                localStorage.clear()
                clearInterval(intervalSec);
            }
        }, 1000);
    }

    display(){
        let minutes = 60 * this.time,
        display = document.querySelector(`#time-${this.id}`);
        this.create(minutes, display)
    }
}
export default Timer