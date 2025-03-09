import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Tool from "./Tool";


export default class Text extends Tool {
    constructor(canvas, socket, id){
        toolState.setType('text')
        super(canvas, socket, id)
        this.isDragging = false; 
        this.dragStartX = 0;   
        this.dragStartY = 0;
        this.leftLeverDown = false;
        this.leftLeverStartX = 0;
        this.rightLeverDown = false;
        this.textAreaWidth = 150;
        this.textAreaExtraWidth = 0
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        window.addEventListener("mousemove", this.windowMouseMoveHandler.bind(this));
        window.addEventListener("mouseup", this.windowMouseUpHandler.bind(this));
    }
    
    windowMouseMoveHandler(e) {
        if(this.rightLeverDown){
            if(e.clientX < ((window.innerWidth - canvasState.canvasWidth)/2) + canvasState.canvasWidth ){
                this.textAreaExtraWidth = e.clientX - this.leftLeverStartX
                let textarea = document.querySelector('.text-input')
                let width = this.textAreaWidth + this.textAreaExtraWidth
                textarea.style.width = (width > 150 ? width : 150) + 'px'
            }   
        }
        if(this.leftLeverDown){
            if(e.clientX > ((window.innerWidth - canvasState.canvasWidth)/2)){
            const inputDiv = document.querySelector(".input-container");

            this.textAreaExtraWidth = this.leftLeverStartX - e.clientX  
            let textarea = document.querySelector('.text-input')
            
            let width = (this.textAreaWidth + this.textAreaExtraWidth) > 150 ? (this.textAreaWidth + this.textAreaExtraWidth) : 150
            let left = this.inputContainerLeft - this.textAreaExtraWidth

            textarea.style.width = width + 'px'
            inputDiv.style.left = (left < this.inputContainerLeft ? left : (this.inputContainerLeft + (this.textAreaPrevWidth - width) ))  + 'px'
        }}
        if (this.isDragging) {
            const inputDiv = document.querySelector(".input-container");
                               
            let left = e.clientX - this.dragStartX
            let top = e.clientY - this.dragStartY

            if(left + inputDiv.clientWidth > ((window.innerWidth - canvasState.canvasWidth)/2) + canvasState.canvasWidth){
                left = (((window.innerWidth - canvasState.canvasWidth)/2) + canvasState.canvasWidth) - inputDiv.clientWidth
            }
            if(left < ((window.innerWidth - canvasState.canvasWidth)/2)){
                left = (((window.innerWidth - canvasState.canvasWidth)/2)) 
            }

            if(top + inputDiv.clientHeight > ((window.innerHeight - canvasState.canvasHeight)/2) + canvasState.canvasHeight){
                top = (((window.innerHeight - canvasState.canvasHeight)/2) + canvasState.canvasHeight) - inputDiv.clientHeight
            }
            if(top < ((window.innerHeight - canvasState.canvasHeight)/2)){
                top = (((window.innerHeight - canvasState.canvasHeight)/2)) 
            }
            
            this.left = left - ((window.innerWidth - canvasState.canvasWidth)/2) 
            this.top = top - ((window.innerHeight - canvasState.canvasHeight)/2) 
            
            
            if (inputDiv) {
                inputDiv.style.left = left + "px";
                inputDiv.style.top = top + "px";
            }
        }
    }
    
    windowMouseUpHandler() {
        this.isDragging = false;
        this.rightLeverDown = false;
        this.leftLeverDown = false;
    }

    mouseDownHandler(e){
        this.setParams()
        const x =  e.pageX - e.target.offsetLeft;
        const y =  e.pageY - e.target.offsetTop;
        this.left = x
        this.top = y
      
        const textarea = this.createInput(((window.innerWidth - canvasState.canvasWidth)/2) + x, ((window.innerHeight - canvasState.canvasHeight)/2) + y);
        const inputContainer = document.querySelector(".input-container");

        textarea.style.height = "auto";
        
        textarea.addEventListener('input', () => {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`
        })

        textarea.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.socket.emit('draw', {
                    id: this.id,
                    figure: {
                        type: 'text',
                        scale: canvasState.scale,
                        y: this.top + 15,
                        x: this.left + 5,
                        left: this.left,
                        lines: textarea.value.split(/\s+/),
                        textareaWidth: textarea.clientWidth,
                    },
                    params: {
                        fontColor: toolState.strokeColorVar,
                        fontSize: toolState.fontSize,
                        bold: toolState.bold,
                        underlined: toolState.underlined,
                        strikethrough: toolState.strikethrough,
                        italic: toolState.italic
                    }
                })

                inputContainer.remove();
                toolState.setTextArea(null)
            }
        });
    }

   
    static printText({ctx, scale, textareaWidth, x, y, left, lines,fontColor,fontSize,bold,underlined,strikethrough,italic}){
        ctx.save();
        this.scaleCanvas(ctx, scale)

        var currentLine = "";
        var lineHeight = fontSize;
        ctx.lineWidth = fontSize / 10
     
        ctx.strokeStyle = fontColor
        ctx.fillStyle = fontColor

        ctx.font = `${bold ? 'bold' : ''} ${italic ? 'italic' : ''} ${fontSize}px Arial`;

        for (var i = 0; i < lines.length; i++) {
            var testLine = currentLine + lines[i] + " ";
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            console.log(testLine)

            var x = left;
            if (testWidth > textareaWidth - 5) {
                for (var j = 0; j < currentLine.length; j++) {
                    var char = currentLine[j];
                    var metrics = ctx.measureText(char);
                    var charWidth = metrics.width;

                    ctx.fillText(char, x, y);

                    if(underlined){
                        if (char !== " ") {
                            ctx.beginPath();
                            ctx.moveTo(x, y + 2);
                            ctx.lineTo(x + charWidth, y + 2); 
                            ctx.stroke();
                        }
                    }
                    if(strikethrough){
                        if (char !== " ") {
                            ctx.beginPath();
                            ctx.moveTo(x, y + 2 - (fontSize / 3)); 
                            ctx.lineTo(x + charWidth, y + 2 - (fontSize / 3));
                            ctx.stroke();
                        }
                    }

                    x += charWidth;
                }

              currentLine = lines[i] + " ";
              y += lineHeight;
            } else {
              currentLine = testLine;
            }
        }
        
        x = left

        for (var j = 0; j < currentLine.length; j++) {
            var char = currentLine[j];
            var metrics = ctx.measureText(char);
            var charWidth = metrics.width;

            ctx.fillText(char, x, y);

            if(underlined){
                if (char !== " ") {
                    ctx.beginPath();
                    ctx.moveTo(x, y + 2); 
                    ctx.lineTo(x + charWidth, y + 2); 
                    ctx.stroke();
                }
            }
            if(strikethrough){
                if (char !== " ") {
                    ctx.beginPath();
                    ctx.moveTo(x, y + 2 - (fontSize / 2.5)); 
                    ctx.lineTo(x + charWidth, y + 2 - (fontSize / 2.5)); 
                    ctx.stroke();
                }
            }
            
            x += charWidth;
        }

        ctx.beginPath()
        Tool.setParams(ctx)
        canvasState.uploadCanvas()
        ctx.restore();
    }

    createInput(x, y) {
        if(toolState.textarea){
            document.querySelector(".input-container").remove();
            toolState.setTextArea(null)
        }
        
        const inputContainer = document.createElement("div");
        inputContainer.classList.add('input-container');

        const textarea = document.createElement("textarea");
        textarea.classList.add('text-input');
        textarea.style.fontSize = `${toolState.fontSize}px`;
    
        if(x + 150 > ((window.innerWidth - canvasState.canvasWidth) / 2) + canvasState.canvasWidth){  
            x = (((window.innerWidth - canvasState.canvasWidth) / 2) + canvasState.canvasWidth) - 160
        }
        if(y + 40 > ((window.innerHeight - canvasState.canvasHeight) / 2) + canvasState.canvasHeight){  
            y = (((window.innerHeight - canvasState.canvasHeight) / 2) + canvasState.canvasHeight) - 45
        }

        inputContainer.style.left = x + "px";
        inputContainer.style.top = y + "px";

        if (toolState.bold) {
            textarea.style.fontWeight = 'bold';
        }
    
        if (toolState.italic) {
            textarea.style.fontStyle = 'italic';
        }

        if (toolState.strokeColorVar) {
            textarea.style.color = toolState.strokeColorVar;
        }

        if (toolState.strikethrough && toolState.underlined) {
            textarea.style.textDecoration = 'line-through underline';
        }else{
            if(toolState.strikethrough){
                textarea.style.textDecoration = 'line-through';
            }
            if(toolState.underlined){
                textarea.style.textDecoration = 'underline';
            }
        }
    
        inputContainer.addEventListener("mousedown", (e) => {
            this.dragStartX = e.clientX - inputContainer.getBoundingClientRect().left;
            this.dragStartY = e.clientY - inputContainer.getBoundingClientRect().top; 
            this.isDragging = true
        });

        textarea.addEventListener('mousedown', (e) => {
            e.stopPropagation()   
        })
        textarea.addEventListener('focus', () => {
            inputContainer.style.outline = '2px solid black'
            this.isDragging = false
        })
        textarea.addEventListener('blur', () => {
            inputContainer.style.outline = '2px dashed gray'
        })
        
        const leftInputElement = document.createElement("div");
        leftInputElement.classList.add("input-element-left");
        inputContainer.appendChild(leftInputElement);

        inputContainer.appendChild(textarea);
        
        const rightInputElement = document.createElement("div");
        rightInputElement.classList.add("input-element-right");
        inputContainer.appendChild(rightInputElement);

  
        leftInputElement.addEventListener("mousedown", (e) => {
            this.isDragging = false
            e.stopPropagation()
            this.leftLeverDown = true
            this.leftLeverStartX = e.clientX
            this.textAreaWidth = textarea.clientWidth
            this.inputContainerLeft = parseInt(window.getComputedStyle(inputContainer).getPropertyValue("left"));
            this.textAreaPrevWidth = textarea.clientWidth
        });

        
        rightInputElement.addEventListener("mousedown", (e) => {
            this.isDragging = false
            e.stopPropagation()
            this.rightLeverDown = true
            this.leftLeverStartX = e.clientX
            this.textAreaWidth = textarea.clientWidth
            this.inputContainerLeft = parseInt(window.getComputedStyle(inputContainer).getPropertyValue("left"));
        });
       
        this.canvas.parentElement.appendChild(inputContainer);
    
        toolState.setTextArea(textarea)
        return textarea;
    }

}