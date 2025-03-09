import {makeAutoObservable} from 'mobx'
import axios from 'axios'
class CanvasState {
    canvas = null
    canvasWidth = 700
    canvasHeight = 500
    ctx = null
    id = null
    socket = null
    sessionId = null
    scale = 1
    usersCounter = 1

    constructor(){
        makeAutoObservable(this)
    }

    async uploadCanvas(){
        const canvas = document.querySelector('.canvas_element')
        await axios.post('http://localhost:5000/image', {id: this.sessionId, img: canvas.toDataURL()})
    }

    async loadCanvas(){
        try {
            await axios.get(`http://localhost:5000/image?id=${this.sessionId}`)
            .then((data) => {
                const img = new Image()
                img.src = data.data
                this.ctx = this.canvas.getContext('2d')
              
                img.onload = () => {
                    console.log('sdds')
                    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
                    this.ctx.drawImage(img, 0,0, this.canvas.width, this.canvas.height)
                    this.ctx.stroke()
                }

            })
        } catch (error) {
            console.log(error)
        }
        
    }

    setUsers(users){
        console.log(users)
        this.usersCounter = users
    }

    setId(id){
        this.id = id
    }

    setScale(scaleValue){
        this.scale = scaleValue
        this.canvasWidth = 700 / this.scale
        this.canvasHeight = 500 / this.scale
    }

    setSessionId(id){
        this.sessionId = id
        console.log(this.sessionId)
    }

    setSocket(socket){
        this.socket = socket
        
    }

    setCanvas(canvas){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.ctx2 = canvas.getContext('2d')
    }

    pushToUndo(data){
        this.socket.emit('pushToUndo', this.sessionId, data)
    }

    pushToRedo(data){
        this.socket.emit('pushToRedo', this.sessionId, data)
    }

    updateCanvas(data){
        const img = new Image()
        img.src = data
        img.onload =  () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
        }
        this.uploadCanvas({img: this.canvas.toDataURL(), id: this.sessionId})
    }

    undo({dataUrl, socketId}) {
        console.log(socketId, " ", this.id)
        if(dataUrl){
            
            let img = new Image()
            img.src = dataUrl
            img.onload = () => {
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                this.ctx.drawImage(img, 0,0, this.canvas.width, this.canvas.height)
                this.socket.emit('draw', {
                    id: this.sessionId,
                    figure: {
                        type: 'updateCanvas',
                        data: this.canvas.toDataURL()
                    }
                })
            }
            if(socketId == this.id){
                this.pushToRedo(this.canvas.toDataURL())
            }
            
        }else{
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.socket.emit('draw', {
                id: this.sessionId,
                figure: {
                    type: 'updateCanvas',
                    data: this.canvas.toDataURL()
                }
            })
            if(socketId == this.id){
                this.pushToRedo(this.canvas.toDataURL())
            }
        }
    }

    redo({dataUrl, socketId}) {
            
            let img = new Image()
            img.src = dataUrl
            img.onload = () => {
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                this.ctx.drawImage(img, 0,0, this.canvas.width, this.canvas.height)
                this.socket.emit('draw', {
                    id: this.sessionId,
                    figure: {
                        type: 'updateCanvas',
                        data: this.canvas.toDataURL()
                    }
                })
            }
            if(socketId == this.id){
                this.pushToUndo(this.canvas.toDataURL())
            }
       
            
    
    }
}

export default new CanvasState()