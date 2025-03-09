import React, { useState, useEffect } from 'react';
import share from '../assets/img/share.png';
import copied from '../assets/img/tick.png'; 
import canvasState from '../store/canvasState';
import { observer } from 'mobx-react-lite';
import '../styles/share.scss'

const Share = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href); 
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className={`share-btn ${isCopied ? 'copied' : ''}`} onClick={handleShareClick}>
      <div className='share-btn__users-counter'>users in room: {canvasState.usersCounter}</div>
      <p>{isCopied ? 'copied' : 'share room link'}</p>
      <img src={isCopied ? copied : share} alt={isCopied ? 'Copied' : 'Share'} />
    </div>
  );
};

export default observer(Share);