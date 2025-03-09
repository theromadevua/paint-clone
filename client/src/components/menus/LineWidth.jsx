import toolState from "../../store/toolState";
import {observer } from 'mobx-react-lite'
import '../../styles/line_width.scss'

const LineWidth = () => {
    const setWidth = (value) => {
        toolState.setLineWidth(value)
    }
    return (
        <div className="line-width">
            {[1,4,8,12,20].map((value) => {
                return (
                    <div className="line-width__item" onClick={() => setWidth(value)}>
                        {toolState.lineWidthVar == value && <hr/>}
                        {value}px
                        <div className="line-width__line" style={{height: value}}></div>
                    </div>
                )
            })}
        </div>
    );
};

export default observer(LineWidth);