import { observer } from 'mobx-react-lite';
import arrowDown from '../../assets/img/arrow-down.png'
import toolState from '../../store/toolState';
import FontSize from './FontSize';
import '../../styles/text_settings.scss'

const TextSettings = () => {
    return (
        <div className="text-settings">
            <div className='text-settings__btn-container'>
                <div className={`text-settings__btn bold ${toolState.bold && 'active'}`} onClick={() => {toolState.setBold()}}>
                    b
                </div>
                <div className={`text-settings__btn italic ${toolState.italic && 'active'}`} onClick={() => {toolState.setItalic()}}>
                    i
                </div>
                <div className={`text-settings__btn underlined ${toolState.underlined && 'active'}`} onClick={() => {toolState.setUnderlined()}}>
                    u
                </div>
                <div className={`text-settings__btn strikethrough ${toolState.strikethrough && 'active'}`} onClick={() => {toolState.setStrikethrough()}}>
                    s
                </div>
            </div>
            <div className="text-settings__font-size-input"  style={toolState.fontSizeMenu ? {borderRadius: '5px 5px 0px 0px'} : {}} >
                {toolState.fontSize}px
                
                <img src={arrowDown} style={toolState.fontSizeMenu ? {transform: 'rotate(180deg)'} : {}} onClick={() => {toolState.activateFontSizeMenu(!toolState.fontSizeMenu)}}/>
             
                {toolState.fontSizeMenu && <FontSize/>}
            </div>
            
        </div>
    );
};

export default observer(TextSettings);