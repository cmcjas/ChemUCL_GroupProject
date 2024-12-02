import React, { useState, useEffect, useRef } from 'react'; // Added useEffect and useRef
import { Grid, Snackbar, Alert } from '@mui/material'; // Import Snackbar and Alert
import QrScanner from 'qr-scanner';
import { validateAndProcessQrCode } from 'services/qr-code/qrCodeActionHandler';

const ScanQR = ({ fetchAndSetChemicalData , locationID}) => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility

  useEffect(() => {
    let qrScanner;
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const rearCamera = devices.find((device) => device.kind === 'videoinput' && device.label.includes('back'));
        const constraints = {
          video: {
            deviceId: rearCamera ? { exact: rearCamera.deviceId } : undefined,
            facingMode: 'environment'
          }
        };

        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const scannerOptions = {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment'
          };
          qrScanner = new QrScanner(
            videoRef.current,
            async (result) => {
              console.log('decoded qr code:', result);
              if (/^[0-9A-F]+$/i.test(result.data)) {
                qrScanner.stop();
                const qrData = { qrID: result.data, locationID: locationID};
                console.log('qrData: ', qrData);
                const scanResult = await validateAndProcessQrCode('audit', qrData);

                if (scanResult.error === 'Chemical is not linked to this location') {
                  console.log('scanResult: ', scanResult);
                  setOpenSnackbar(true); // Open the Snackbar
                  return;
                }

                console.log('scanResult: ', scanResult);
                if (scanResult) {
                  fetchAndSetChemicalData();
                }
              } else {
                console.log('Scanned value is not a hexadecimal, ignoring.');
              }
            },
            scannerOptions
          );
          qrScanner.start();
        }
      })
      .catch((err) => {
        console.error('Error accessing the camera', err);
      });

    return () => {
      if (qrScanner) {
        qrScanner.stop();
      }
    };
  }, []);

  return (
    <div>
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <video ref={videoRef} style={{ width: '85%', marginLeft: 'auto', marginRight: 'auto' }} />
          </Grid>
        </Grid>
      </Grid>
      <div>{scanResult.data}</div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          Chemical is not linked to this location
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ScanQR;
