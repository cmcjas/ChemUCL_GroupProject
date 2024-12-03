import React, { useEffect, useRef, useState } from 'react';

import { Modal, Box, Button, Paper, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Transitions from 'components/ui-component/extended/Transitions';
import MainCard from 'components/ui-component/cards/MainCard';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const QRCodePopUp = ({ open, handleClose }) => {
  const popUpRef = useRef(null);
  const [modalStyle] = React.useState(getModalStyle);

  useEffect(() => {
    const updateModalPosition = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (popUpRef.current) {
        const popUpWidth = screenWidth * 0.6;
        const popUpHeight = screenHeight * 0.6;
        const centerX = screenWidth / 2 - popUpWidth / 2;
        const centerY = screenHeight / 2 - popUpHeight / 2;

        popUpRef.current.style.setProperty('position', 'fixed');
        popUpRef.current.style.setProperty('width', `${popUpWidth}px`);
        popUpRef.current.style.setProperty('height', `${popUpHeight}px`);
        popUpRef.current.style.setProperty('top', `${centerY}px`);
        popUpRef.current.style.setProperty('left', `${centerX}px`);
      }
    };

    // Initial setup
    updateModalPosition();

    // Add event listener for window resize
    window.addEventListener('resize', updateModalPosition);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateModalPosition);
    };
  }, [open]);

  return (
    <Transitions position="center" in={open}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }}
      />
      <Paper
        ref={popUpRef}
        style={{
          width: '400px',
          height: '400px',
          padding: '16px',
          zIndex: 1001,
          boxShadow: 'none'
        }}
      >
        <MainCard
          style={modalStyle}
          sx={{
            position: 'absolute',
            width: { xs: 280, lg: 450 },
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          title="Title"
          content={false}
          secondary={
            <IconButton onClick={handleClose} size="large">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Button
            justifyContent="center"
            size="small"
            variant="contained"
            onClick={handleClose}
            sx={{ position: 'absolute', bottom: '16px', left: '16px' }}
          >
            Scan QR Code
          </Button>
        </MainCard>
      </Paper>
    </Transitions>
  );
};

export default QRCodePopUp;
