import { observer } from "mobx-react-lite";
import toolState from "../../store/toolState";
import '../../styles/fontSize.scss'

const FontSize = () => {
    return (
        <div className="font-size">
            {[14, 16, 18, 22, 24, 28, 32, 36, 40].map((value) => 
            <div className="font-size__item" onClick={() => {toolState.setFontSize(value)}}>
                {toolState.fontSize == value && <hr/>}
                {value}px
            </div>)}
        </div>
    );
};

export default observer(FontSize);