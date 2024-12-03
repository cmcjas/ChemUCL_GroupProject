// NEW
import React, { useState } from 'react';
import { Button, Snackbar, SnackbarContent, LinearProgress } from '@mui/material';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Papa from 'papaparse';
import { importInventory } from 'db/queries/import-inventory';
// import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';
import { validateAndProcessUser } from 'services/user/userActionHandler';
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

  const handleFileInput = async (e) => {
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

        // const validationResult = await validateAndProcessUser('add', userData);
        // if (validationResult.error) {
        //   setMessage('Failed to upload file: ' + validationResult.error);
        //   setUploadError(true);
        //   return;
        // }

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          transform: (value) => value === "" ? null : value,
          complete: async (result) => {
            const totalRows = result.data.length;
            let processedRows = 0;
            setUploading(true);
            for (const row of result.data) {
              const userData = {
                name: row['Full Name'],
                email: row['Email'],
                activeStatus: true,
                permission: row['Role(Admin/Staff/Research Student)'],
                researchGroup: row['Research Group'],
                logs:[]
              };
              console.log('Adding user with params:', userData);
              // await validateAndProcessUser('add', userData);
              const validationResult = await validateAndProcessUser('add', userData);
              if (validationResult.error) {
                setMessage('Failed to upload file');
                setUploadError(true);
                setUploading(false);
                return;
              }
              processedRows++;
              setProgress((processedRows / totalRows) * 100);
            }
            setUploading(false);
            setOpenSnackbar(true);
            // setUploadComplete(true);
            setMessage('File has been successfully uploaded');
            setTimeout(() => {
              setOpenSnackbar(false);
              window.location.reload();
            }, 2000);
          }
        });
      }
          //   if (!uploadError) {
          //     setTimeout(() => {
          //     setOpenSnackbar(false);
          //     window.location.reload();
          //   }, 2000);
          // }
          
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

