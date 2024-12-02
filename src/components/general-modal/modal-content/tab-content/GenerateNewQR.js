import React, { useState } from 'react';
import { Grid, Button, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { generateMultipleQRCodes } from 'utils/QRUtils'; // Adjust the import path as necessary
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const GenerateNewQR = () => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState('1'); // Default to 1
  const [exportType, setExportType] = useState('');

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleExportTypeChange = (event) => {
    setExportType(event.target.value);
  };

  const handleAction = () => {
    dispatch(openSnackbar({
      open: true,
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
      message: 'Generating Codes',
      alert: {
        color: 'primary' 
      },
      actionButton: false,
    }))
    const quantityInt = parseInt(quantity, 10);
    if (!isNaN(quantityInt) && quantityInt > 0) {
      generateMultipleQRCodes({ count: quantityInt, exportType });
    } else {
      console.error('Quantity must be a positive integer');
    }
  };

  return (
    <div>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Quantity Dropdown */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="quantity-select-label">Quantity</InputLabel>
            <Select labelId="quantity-select-label" id="quantity-select" value={quantity} label="Quantity" onChange={handleQuantityChange}>
              {[...Array(1000).keys()].map((number) => (
                <MenuItem key={number + 1} value={number + 1}>
                  {number + 1}
                </MenuItem>
              ))}
            </Select>
            {/* Warning Text */}
            <Typography variant="caption" style={{ color: 'grey', marginTop: '8px' }}>
              * Selecting large quantities may result in a download delay.
            </Typography>
          </FormControl>
        </Grid>

        {/* Export Type Selection */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="export-type-select-label">Export Type</InputLabel>
            <Select
              labelId="export-type-select-label"
              id="export-type-select"
              value={exportType}
              label="Export Type"
              onChange={handleExportTypeChange}
            >
              <MenuItem value="download">Download</MenuItem>
              <MenuItem value="print">Print</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleAction}>
          Execute
        </Button>
      </div>
    </div>
  );
};

export default GenerateNewQR;
