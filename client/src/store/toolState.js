import {makeAutoObservable} from 'mobx'
import Tool from '../tools/Tool'
import canvasState from './canvasState'

class ToolState {
    tool = null
    type = 'brush'
    activeMenu = ''
    fontSizeMenu = false
    lineWidthVar = 1
    fontSize = 14
    bold = false
    italic = false
    strikethrough = false
    underlined = false
    textarea = null
    fillColorVar = 'black'
    strokeColorVar = 'black'

    constructor(){
        makeAutoObservable(this)
    }

    activateFontSizeMenu(value){
        if(value){
            this.fontSizeMenu = true
        }else{
            this.fontSizeMenu = false
        }
    }

    activateLineMenu(value){
        if(value){
            this.activeMenu = 'line-width'
        }else{
            this.activeMenu = ''
        }
    }

    activateColorPicker(value){
        if(value){
            this.activeMenu = 'color-picker'
        }else{
            this.activeMenu = ''
        }
    }

    activateTextSettingsMenu(value){
        if(value){
            this.activeMenu = 'text-settings'
        }else{
            this.activeMenu = ''
        }
        this.fontSizeMenu = false
    }


    setTool(tool){
        if(this.tool){
            this.tool.destroyEvents()
            this.tool = null
        }
        this.tool = tool
        this.tool.listen()
    }

    setTextArea(textarea){
        this.textarea = textarea
    }

    setType(type){
        this.type = type
        if(type == 'text'){
            this.activateTextSettingsMenu(true)
        }else{
            this.activateTextSettingsMenu(false)
        }
    }

    setFillColor(color){
        this.fillColorVar = color
        Tool.setParams(canvasState.ctx)
    }

    setStrokeColor(color){
        this.strokeColorVar = color
        Tool.setParams(canvasState.ctx)
    }

    setLineWidth(width){
        this.lineWidthVar = width
        this.activateLineMenu(false)
        Tool.setParams(canvasState.ctx)
    }

    setFontSize(value){
        this.fontSize = value
        Tool.setParams(canvasState.ctx)
    }

    setBold(){
        this.bold = !this.bold
        Tool.setParams(canvasState.ctx)
    }

    setItalic(){
        this.italic = !this.italic
        Tool.setParams(canvasState.ctx)
    }

    setStrikethrough(){
        this.strikethrough = !this.strikethrough
        Tool.setParams(canvasState.ctx)
    }

    setUnderlined(){
        this.underlined = !this.underlined
        Tool.setParams(canvasState.ctx)
    }
}

export default new ToolState()