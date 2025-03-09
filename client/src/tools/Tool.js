import canvasState from "../store/canvasState"
import toolState from "../store/toolState"

export default class Tool {
    constructor(canvas, socket, id){
        this.socket = socket
        this.id = id
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    static scaleCanvas(ctx, scale){
        if(canvasState.scale == 1){
            if(scale == 2){
                ctx.scale(2, 2); 
            }
        }
    
        if(canvasState.scale == 2){
            if(scale == 1){
                ctx.scale(0.5, 0.5);
            }
        }
    }


    static setParams(ctx){
        ctx.lineWidth = toolState.lineWidthVar
        ctx.strokeStyle = toolState.strokeColorVar
        ctx.fillStyle = toolState.fillColorVar
        ctx.font = `${toolState.bold ? 'bold' : ''} ${toolState.italic ? 'italic' : ''} ${toolState.fontSize}px Arial`;
        if(toolState.textarea){
            toolState.textarea.style.color = toolState.strokeColorVar
            toolState.textarea.style.fontSize = toolState.fontSize + "px"
            toolState.textarea.style.fontWeight = toolState.bold ? 'bold' : '300';
            toolState.textarea.style.fontStyle = toolState.italic ? 'italic' : 'normal';
            toolState.textarea.style.textDecoration = (toolState.underlined && toolState.strikethrough) ?  'line-through underline' : (toolState.underlined ? 'underline' : (toolState.strikethrough ? 'line-through' : ''));
        }
    }

    setParams(){
        this.ctx.lineWidth = toolState.lineWidthVar
        this.ctx.strokeStyle = toolState.strokeColorVar
        this.ctx.fillStyle = toolState.fillColorVar
        this.ctx.font = `${toolState.bold ? 'bold' : ''} ${toolState.italic ? 'italic' : ''} ${toolState.fontSize}px Arial`;
        if(toolState.textarea){
            toolState.textarea.style.color = toolState.strokeColorVar
            toolState.textarea.style.fontSize = toolState.fontSize + "px"
            toolState.textarea.style.fontWeight = toolState.bold ? 'bold' : '300';
            toolState.textarea.style.fontStyle = toolState.italic ? 'italic' : 'normal';
            toolState.textarea.style.textDecoration = (toolState.underlined && toolState.strikethrough) ?  'line-through underline' : (toolState.underlined ? 'underline' : (toolState.strikethrough ? 'line-through' : ''));
        }
    }

    destroyEvents(){
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
    }

}