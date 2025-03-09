import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Rect extends Tool{
    constructor(canvas, socket, id){
        toolState.setType('rect')
        super(canvas, socket, id)
    }

    listen(){
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.emit('draw', {
            id: this.id,
            figure: {
                type: 'rect',
                scale: canvasState.scale,
                x: this.startX,
                y: this.startY ,
                width: this.width,
                height: this.height,
            },
            params: {
                color: toolState.strokeColorVar
            }
        })
        canvasState.uploadCanvas()
    }

    mouseDownHandler(e){
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e){
        if(this.mouseDown){
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.width = this.currentX - this.startX;
            this.height = this.currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x, y, w, h){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.setParams()
            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0,0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
        }
        
    }
    
    static staticDraw({ctx, scale, x, y, width, height, color}){
        ctx.fillStyle = color
        ctx.strokeStyle = color
        ctx.save()
        this.scaleCanvas(ctx, scale)
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
        ctx.beginPath()
        Tool.setParams(ctx)
    }
}