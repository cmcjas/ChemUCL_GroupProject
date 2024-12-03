'use client';

import React, { useState } from 'react'; // Consolidated React and useState imports
import PropTypes from 'prop-types';

// material-ui imports
import { Modal, IconButton, CardContent } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
// Assuming InventoryFilter is the dynamic content for "inventory"

export default function ScanModal({ open, onClose, childComponent }) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MainCard
          sx={{
            maxWidth: '600px',
            height: '70%', // Adjust according to your content's needs
            width: '80%', // Adjust according to your content's needs
            m: 1, // Margin to ensure it doesn't touch the edges
            paddingTop: `env(safe-area-inset-top)`
          }}
          title="QR Scanner"
          content={false}
          secondary={
            <IconButton onClick={onClose} size="large">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <CardContent>
            {/* Render the dynamically determined content component */}
            {childComponent}
          </CardContent>
        </MainCard>
      </Modal>
    </>
  );
}

ScanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  childComponent: PropTypes.node
};
