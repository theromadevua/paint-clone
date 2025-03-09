import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Tool from "./Tool";


export default class Circle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        toolState.setType('circle')
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseDownHandler(e) {
        this.setParams()
        this.mouseDown = true
        let canvasData = this.canvas.toDataURL()
        this.ctx.beginPath()
        this.startX = e.pageX-e.target.offsetLeft
        this.startY = e.pageY-e.target.offsetTop
        this.saved = canvasData
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.emit('draw', {
            id: this.id,
            figure: {
                type: 'circle',
                scale: canvasState.scale,
                x: this.startX+ this.deltaX/2,
                y: this.startY + this.deltaY/2,
                r: this.radius
            },
            params: {
                color: toolState.strokeColorVar
            }
        })
        canvasState.uploadCanvas()
    }

    mouseMoveHandler(e) {
        if(this.mouseDown) {
            let currentX =  e.pageX - e.target.offsetLeft;
            let currentY =  e.pageY - e.target.offsetTop;
            this.deltaX = currentX - this.startX;
            this.deltaY = currentY - this.startY;
            this.radius = Math.sqrt(this.deltaX**2 + this.deltaY**2);
            this.draw(this.startX+ this.deltaX/2, this.startY + this.deltaY/2, this.radius);
        }
    }


    static staticCircleDraw({ctx, scale, x,y,r, color}) {
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.save();
        this.scaleCanvas(ctx, scale)
        ctx.beginPath()
        ctx.arc(x, y, r /2, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke() 
        ctx.restore()
        ctx.beginPath()
        Tool.setParams(ctx)
    }

    draw(x,y,r) {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r /2, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }.bind(this)
    }
}