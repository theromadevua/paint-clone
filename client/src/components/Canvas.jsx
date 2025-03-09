import {observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import io from 'socket.io-client'
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import Eraser from '../tools/Eraser';
import Circle from '../tools/Circle';
import Line from '../tools/Line';
import Text from '../tools/Text';
import '../styles/canvas.scss'

let socket = io('http://localhost:5000');

const Canvas = () => {
    const {id} = useParams()
    const canvasRef = useRef()

    useEffect(() => {
        if(socket && canvasState.sessionId){
            socket.emit('connection', {id})
            canvasState.loadCanvas()
        }
        
    }, [socket, canvasState.sessionId])

    useEffect(() => {
        if(canvasRef.current){
            canvasState.setCanvas(canvasRef.current)
        }
    }, [canvasRef.current])

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    useEffect(() => {
        if(window.innerWidth < 700){
            canvasRef.current.width = 350
            canvasRef.current.height = 250
            canvasState.setScale(2)
        }
    }, [])
    
    useEffect(() => {
        if(socket){
            socket.on('draw', (data) => drawHandler(data))
            socket.on('id', (data) => canvasState.setId(data))
            socket.on('undo', (data) => canvasState.undo(data))
            socket.on('redo', (data) => canvasState.redo(data))
            socket.on('users', (data) => canvasState.setUsers(data))
        }
    }, [socket])

    useEffect(() => {
        socket.emit("join", id)
        canvasState.setSocket(socket)
        canvasState.setSessionId(id)
        toolState.setTool(new Brush(canvasRef.current, socket, id))
    }, [])

  

    const drawHandler = (data) => {
        console.log(data)
        const figure = data.figure
        const params = data.params
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type){
            case 'brush':
                Brush.draw({ctx, scale: figure.scale, x: figure.x, y: figure.y, lineWidth: params.lineWidth, color: params.color})
                break
            case 'rect':
                Rect.staticDraw({ctx, scale: figure.scale, x: figure.x, y: figure.y, width: figure.width, height: figure.height, color: params.color} )
                break
            case 'eraser':
                Eraser.staticDraw({ctx, scale: figure.scale, x: figure.x, y: figure.y, width: figure.width, height: figure.height, lineWidth: params.lineWidth})
                break
            case 'circle':
                Circle.staticCircleDraw({ctx, scale: figure.scale, x: figure.x, y: figure.y, r: figure.r, color: params.color})
                break
            case 'updateCanvas':
                canvasState.updateCanvas(figure.data)
                break
            case 'line':
                Line.staticDraw({ctx, scale: figure.scale, x: figure.x, y: figure.y, currentX: figure.currentX, currentY: figure.currentY, lineWidth: params.lineWidth, color: params.color})
                break
            case 'text':
                Text.printText({
                    ctx, 
                    x: figure.x, 
                    y: figure.y, 
                    scale: figure.scale,
                    textareaWidth: figure.textareaWidth, 
                    left: figure.left, 
                    lines: figure.lines,
                    fontColor: params.fontColor,
                    fontSize: params.fontSize,
                    bold: params.bold,
                    underlined: params.underlined,
                    strikethrough: params.strikethrough,
                    italic: params.italic})
                break
            case 'finish':
                ctx.beginPath()
                break
        }
    }

    return (
        <div className="canvas">
            <canvas className='canvas_element' width={700} height={500} onMouseDown={() => {mouseDownHandler()}} ref={canvasRef}></canvas>
        </div>
    );
};

export default observer(Canvas);