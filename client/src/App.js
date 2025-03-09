import { Route, Routes, Navigate  } from 'react-router-dom';
import Canvas from './components/Canvas';
import './styles/app.scss'
import ToolBarCompontnt from './components/ToolBarCompontnt';

import Share from './components/Share';
import toolState from './store/toolState';

function App() {
  return (
    <div className="app" onClick={() => {
      toolState.activateColorPicker(false)
      toolState.activateFontSizeMenu(false)
      toolState.activateTextSettingsMenu(false)
    }}>
      <Routes>
        <Route path='/:id' element={<div>
          <Share/>
          <ToolBarCompontnt/>
          <Canvas/>
        </div>}/>
        <Route path="*" element={<Navigate to={`room-${(+new Date).toString(16)}`} />} />
      </Routes>
    </div>
  );
}

export default App;
