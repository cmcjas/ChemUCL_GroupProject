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

{/*<Button sx={{marginLeft: 4}} size="large" startIcon={<SortIcon />} variant="contained" color="primary" onClick={handleOpen}>
        Filter
  </Button>*/}
  export default function GeneralModal({ open, onClose, childComponent, maxWidth, title }) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MainCard
          sx={{
            maxWidth: maxWidth || '800px',
            width: '80%',
            m: 1,
            overflow: 'hidden', // Ensures the card itself does not overflow
            paddingTop: `env(safe-area-inset-top)`,
            display: 'flex', // Make the MainCard a flex container
            flexDirection: 'column', // Stack children vertically
          }}
          title={title || ""}
          content={false}
          secondary={
            <IconButton onClick={onClose} size="large">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {/* Scrollable content area */}
          <Box
            sx={{
              overflowY: 'auto', // Make content scrollable vertically
              maxHeight: '70vh', // Adjust maxHeight to control when scrolling kicks in
            }}
          >
            <CardContent>
              {childComponent}
            </CardContent>
          </Box>
        </MainCard>
      </Modal>
    );
  }
  
  GeneralModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    childComponent: PropTypes.node,
  };
