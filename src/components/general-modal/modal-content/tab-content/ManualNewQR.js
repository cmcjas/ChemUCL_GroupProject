import React, { useState } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { generateMultipleQRCodes } from 'utils/QRUtils'; // Adjust the import path as necessary

const GenerateNewQR = () => {
  const [qrId, setQrId] = useState(''); // State for QR ID input
  const [upTo, setUpTo] = useState(''); // State for Up to input

  const handleQrIdChange = (event) => {
    setQrId(event.target.value);
  };

  const handleUpToChange = (event) => {
    setUpTo(event.target.value);
  };

  const handleExportQRCode = (exportType) => {
    if (!qrId) {
      console.error('QR ID must be provided');
      return;
    }
    const options = { value: qrId, exportType };
    if (upTo) options.upTo = upTo;
    generateMultipleQRCodes(options);
  };

  return (
    <div>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* QR ID Input */}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="QR ID" variant="outlined" value={qrId} onChange={handleQrIdChange} />
        </Grid>

        {/* Up to Input */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Up to"
            variant="outlined"
            value={upTo}
            onChange={handleUpToChange}
            placeholder="Leave blank for single QR Code"
          />
        </Grid>
      </Grid>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => handleExportQRCode('print')} style={{ marginRight: '10px' }}>
          Print
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleExportQRCode('download')}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default GenerateNewQR;
