import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Brush extends Tool{

    constructor(canvas, socket, id, type){
        toolState.setType(type ? type : 'brush')
        super(canvas, socket, id)
        this.type = type
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
                type: 'finish',
            }
        })
        canvasState.uploadCanvas()
    }

    mouseDownHandler(e){
        this.setParams()
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop )
    }

    mouseMoveHandler(e){
        if(this.mouseDown){
            this.socket.emit('draw', {
                id: this.id,
                figure: {
                    type: this.type ? this.type : 'brush',
                    x: e.pageX - e.target.offsetLeft ,
                    y: e.pageY - e.target.offsetTop,
                    scale: canvasState.scale 
                },
                params: {
                    lineWidth: toolState.lineWidthVar,
                    color: toolState.strokeColorVar
                }
            })
        }
    }

    

    static draw({ctx, scale, x, y, lineWidth, color}){
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        ctx.save();
        this.scaleCanvas(ctx, scale)
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
        Tool.setParams(ctx)
    }
}