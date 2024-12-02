// NEW
import React, { useState } from 'react';
import { Button, Snackbar, SnackbarContent, LinearProgress } from '@mui/material';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Papa from 'papaparse';
import { importInventory } from 'db/queries/import-inventory';
import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {green} from '@mui/material/colors';
import Box from '@mui/material/Box';
import ErrorIcon from '@mui/icons-material/Error';
import { red } from '@mui/material/colors';
import { set } from 'lodash';

const FileUploadButton = ({ t, w }) => {
  const fileInput = React.useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploading, setUploading] = useState(false); 
  const [uploadError, setUploadError] = useState(false); 

  const handleFileInput = (e) => {
    try{
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        alert('File must be a CSV');
        return;
      }
      if (file.size > 1024 * 1024) {
        // 1MB
        alert('File is too large');
        return;
      }
      
      setOpenSnackbar(true);
      setMessage('Uploading file...');

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transform: (value) => value === "" ? null : value,
        complete: async (result) => {
          const totalRows = result.data.length;
          const errorRows = [];
          let processedRows = 0;
          setUploading(true);
          for (const row of result.data) {
            const restrictionStatus = row['Unrestricted/Restricted'] === 'Restricted' ? true : false;
            const chemicalData = {
              qrCode: row['Qr Code'],
              casNumber: row['cas No'],
              activeStatus: true,
              auditStatus: true,
              lastAudit: new Date(),
              chemicalName: row['Chemical Name'],
              quantity: parseInt(row['Amount(units)']),
              supplier: row['Supplier'],
              researchGroup: row['Research Group'],
              description: row['Description'],
              quartzyNumber: row['Quartzy Number'],
              restrictionStatus: restrictionStatus,
              building: row['Building'],
              room: row['Room'],
              subLocation1: row['Sublocation 1'],
              subLocation2: row['Sublocation 2'],
              subLocation3: row['Sublocation 3'],
              subLocation4: row['Sublocation 4'],
            };
            console.log('Adding chemical with params:', chemicalData);
            const validationResult = await validateAndProcessChemical('add', chemicalData);
            // if (validationResult.error) {
            //   setMessage('Failed to upload file');
            //   setUploadError(true);
            //   setUploading(false);
            //   return;
            // }
            if (validationResult.error) {
              errorRows.push(row);
            }

            processedRows++;
            setProgress((processedRows / totalRows) * 100);
          }
          console.log('Processed rows:', processedRows);
          console.log('Error rows:', errorRows);
          if (errorRows.length > 0) {
            setMessage(`Failed to upload ${errorRows.length} rows. Please check the data and try again.`);
            setUploadError(true);
            setUploading(false);
            return;
          } else {
            setMessage('All rows have been successfully uploaded');
          }

          setUploading(false);
          setOpenSnackbar(true);
          // setUploadComplete(true);
          setMessage('File has been successfully uploaded');
          setTimeout(() => {
            setOpenSnackbar(false);
            window.location.reload();
          }, 2000);
        },
      });
    }
  } catch (error) {
      console.error('Failed to upload file:', error);
      setMessage('Failed to upload file');
      setUploadError(true);
      setUploading(false);
      // setOpenSnackbar(true);
      setTimeout(() => {
        setUploadError(false); 
        setOpenSnackbar(false);
      }, 2000);
    }
  };

  const handleButtonClick = () => {
    fileInput.current && fileInput.current.click();
  };

  return (
    <div>
      <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileInput} />
      <Button
        /*style={{ height: '38px', width: { w }, left: '20px' }}*/
        variant="contained"
        startIcon={<ImportExportIcon />}
        color="primary"
        size="large"
        /*aria-label="two layers"*/
        sx={{marginLeft: 1, marginBottom: 1}}
        width='auto'
        /*component="span"*/
        onClick={handleButtonClick}
      >
        {t}
      </Button>
      <Snackbar open = {uploading} autoHideDuration={null}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}>
        <div>
          <SnackbarContent message="Uploading file..." />
          <LinearProgress variant="determinate" value={progress} />
        </div>
      </Snackbar>
      
      <Snackbar open={openSnackbar} autoHideDuration={null}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}>
        <SnackbarContent 
          message={
            <Box display="flex" alignItems="center">
              {message === 'File has been successfully uploaded' && <CheckCircleIcon sx={{ color: green[500], marginRight:1 }} />}
              {message}
            </Box>
          } 
        />
      </Snackbar>
      <Snackbar open={uploadError} autoHideDuration={2000} 
              onClose={() => {
                setUploadError(false);
                setOpenSnackbar(false);
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}>
      <SnackbarContent 
        message={
          <Box display="flex" alignItems="center">
            <ErrorIcon sx={{ color: red[500], marginRight: 1 }} />
            {message}
          </Box>
        } 
      />
    </Snackbar>
    </div>
  );
};

export default FileUploadButton;
