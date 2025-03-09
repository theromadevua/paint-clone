import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Eraser from "../tools/Eraser";
import Rect from "../tools/Rect";
import {observer } from 'mobx-react-lite'
import eraser from '../assets/img/eraser.png'
import brush from '../assets/img/brush.png'
import rect from '../assets/img/rect.png'
import undo from '../assets/img/undo.png'
import text from '../assets/img/text.png'
import line from '../assets/img/line.png'
import circle from '../assets/img/circle.png'
import downloadImg from '../assets/img/download.png'
import set_color from '../assets/img/set_color.png'
import lineWidth from '../assets/img/line-width.png'
import { useEffect, useRef, useState } from "react";
import LineWidth from "./menus/LineWidth";
import Line from "../tools/Line";
import Circle from "../tools/Circle";
import Text from "../tools/Text";
import TextSettings from "./menus/TextSettings";
import { HexColorPicker } from "react-colorful";
import '../styles/toolbar.scss'

const ToolBar = () => {
    const [color, setColor] = useState('black')
    const colorInputRef = useRef()

    const changeColor = (color) => {
        toolState.setStrokeColor(color)
        toolState.setFillColor(color)
        setColor(color)
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL('image/jpeg');
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${canvasState.sessionId}.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    useEffect(() => {
        
    }, [])


    return (
        <div className="toolbar" onClick={(e) => {e.stopPropagation()}}>
            {toolState.activeMenu == 'line-width' && <LineWidth/>}
            {toolState.activeMenu == 'text-settings' && <TextSettings/>}
            {toolState.activeMenu == 'color-picker' && <HexColorPicker color={color} onChange={changeColor} />}
            

            <div className={`toolbar__btn brush ${toolState.type == 'brush' && 'active'}`} onClick={() => {toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}}>
                <img src={brush}/>
            </div>
            <div className={`toolbar__btn rect ${toolState.type == 'line' && 'active'}`} onClick={() => {toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}}>
                <img src={line}/>
            </div>
            <div className={`toolbar__btn rect ${toolState.type == 'rect' && 'active'}`} onClick={() => {toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}}>
                <img src={rect}/>
            </div>
            <div className={`toolbar__btn rect ${toolState.type == 'circle' && 'active'}`} onClick={() => {toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}}>
                <img src={circle}/>
            </div>
            <div className={`toolbar__btn eraser ${toolState.type == 'eraser' && 'active'}`} onClick={() => {toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}}>
                <img src={eraser}/>
            </div>
            <div className={`toolbar__btn text ${toolState.type == 'text' && 'active'}`} onClick={() => {toolState.setTool(new Text(canvasState.canvas, canvasState.socket, canvasState.sessionId))}}>
                <img src={text}/>
            </div>





            <div className="toolbar__btn line-width-btn" onClick={() => {toolState.activateLineMenu(true)}}>
                <img src={lineWidth}/>
            </div>

            <div className="toolbar__btn color_input" onClick={() => {toolState.activateColorPicker(true)}} style={{border: `3px solid ${color}`}}>
                <img src={set_color}/>
            </div>

           

            <div className="toolbar__btn download" onClick={() => {download()}}>
                <img src={downloadImg}/>
            </div>

            <div className="toolbar__btn undo" onClick={() => {canvasState.socket.emit('undo', canvasState.sessionId)}}>
                <img src={undo}/>
            </div>
            <div className="toolbar__btn redo" onClick={() => {canvasState.socket.emit('redo', canvasState.sessionId)}}>
                <img src={undo}/>
            </div>
        </div>
    );
};

export default observer(ToolBar);