'use client';

import React, { useState, useEffect } from 'react'; // Consolidated React and useState imports
import PropTypes from 'prop-types';

// material-ui imports
import { Button, Modal, IconButton, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {getSession} from 'next-auth/react';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
// Assuming InventoryFilter is the dynamic content for "inventory"


export default function LocationModal({ open, onClose, childComponent, input1, input2, input3, input4, input5, input6, input7}) {

  let inputs = [input3, input4, input5, input6, input7];
  let title = " " + inputs.filter(input => input !== null).join(' >> ') + " ";

  const [userRole, setUserRole] = useState(null);

  const { data: session } = getSession();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        const role = session.user?.role;
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };
    fetchSession();
  }, []);

  const [modelOpen, setModelOPen] = useState(false);

  return (
    <>
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
            maxWidth: '1000px',
            height: '90%', // Adjust according to your content's needs
            width: '80%', // Adjust according to your content's needs
            m: 1, // Margin to ensure it doesn't touch the edges
            overflow: 'auto',
            paddingTop: `env(safe-area-inset-top)`,
          }}
            title={"Location ( " + input1 + " ) " + ' >> ' + " " + input2 + " " + ' >> ' + " " + title}
            
          content={false}
          secondary={
            <div>
            <IconButton onClick={onClose} size="large">
              <CloseIcon fontSize="small" />
            </IconButton>
            </div>

          }
        >
        {(userRole === 'Admin' || userRole === 'Staff' || userRole === 'Temporary Staff') && (
          <Button
            sx={{ marginLeft: 6, marginTop: 2 }}
            size="large"
            variant="contained"
            color="secondary"
            onClick={() => displayCam('true')}
            startIcon={<QrCodeScannerIcon />}
          >
            Audit Using Scan
          </Button>)}

          <CardContent>
            {/* Render the dynamically determined content component */}
            {childComponent}
          </CardContent>
        </MainCard>
      </Modal>
    </>
  );
}

LocationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  childComponent: PropTypes.node,
};

