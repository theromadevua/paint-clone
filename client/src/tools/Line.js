import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Tool from "./Tool";


export default class Line extends Tool {
    constructor(canvas, socket, id) {
        toolState.setType('line')
        super(canvas, socket, id);
        this.name = 'Line'
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    mouseDownHandler(e) {
        this.setParams()
        this.mouseDown = true
        this.currentX = e.pageX-e.target.offsetLeft
        this.currentY = e.pageY-e.target.offsetTop
        this.ctx.beginPath()
        this.ctx.moveTo(this.currentX, this.currentY )
        this.saved = this.canvas.toDataURL()
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        canvasState.uploadCanvas()
        this.socket.emit('draw', {
            id: this.id,
            figure: {
                type: 'line',
                scale: canvasState.scale,
                x: e.pageX-e.target.offsetLeft,
                y: e.pageY-e.target.offsetTop,
                currentX: this.currentX, 
                currentY: this.currentY,
            },
            params: {
                lineWidth: toolState.lineWidthVar,
                color: toolState.strokeColorVar
            }
        })
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.draw(e.pageX-e.target.offsetLeft, e.pageY-e.target.offsetTop);
        }
    }

    static staticDraw({ctx, scale, x,y, currentX, currentY, color, lineWidth}) {
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        ctx.save()
        this.scaleCanvas(ctx, scale)
        ctx.beginPath()
        ctx.moveTo(currentX, currentY )
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.restore()
        ctx.beginPath()
        Tool.setParams(ctx)
    }


    draw(x,y) {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY )
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }.bind(this)
    }
}