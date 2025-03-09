import toolState from '../store/toolState'
import Brush from './Brush'
import Tool from './Tool'

export default class Eraser extends Brush {
    constructor(canvas, socket, id){
        super(canvas, socket, id, 'eraser')
        toolState.setType('eraser')
    }

    static staticDraw({ctx, scale, x, y, lineWidth}){
        ctx.lineWidth = lineWidth
        ctx.save()
        this.scaleCanvas(ctx, scale)
        ctx.strokeStyle = 'white'
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.restore()
        Tool.setParams(ctx)
    }
}