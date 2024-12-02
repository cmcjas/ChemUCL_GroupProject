'use client';

import React, { useState } from 'react'; // Consolidated React and useState imports
import PropTypes from 'prop-types';

// material-ui imports
import { Button, Modal, IconButton, CardContent, Box } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
// Assuming InventoryFilter is the dynamic content for "inventory"
import InventoryFilter from 'components/filters/filter-pages/InventoryFilter';
import SystemLogsFilter from 'components/filters/filter-pages/SystemLogsFilter';

// Modal position helper functions (if still needed)
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

export default function ChemInfo({ open, onClose, childComponent, maxWidth }) {
  return (
    <>
      {/* <Button sx={{marginLeft: 4}} size="large" startIcon={<SortIcon/>} variant="contained" color="primary" onClick={handleOpen}>
        Scan
    </Button> */}
      <Modal
        open={open}
        handleClose={onClose}
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
            maxWidth: maxWidth || '800px',
            width: '80%', // Adjust according to your content's needs
            m: 1, // Margin to ensure it doesn't touch the edges
            overflow: 'hidden',
            paddingTop: `env(safe-area-inset-top)`
          }}
          title="Chemical Information"
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

ChemInfo.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  childComponent: PropTypes.node
};
