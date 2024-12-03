import React, { useState, useEffect, useRef } from 'react';
import SubCard from 'components/ui-component/cards/SubCard';
import { Grid } from '@mui/material';

import LocChem from 'components/locChem';
import LocationModal from 'sections/LocationModal';

import QrScanner from 'qr-scanner';
import { validateAndProcessQrCode } from 'services/qr-code/qrCodeActionHandler';
import NewQRCode from 'components/general-modal/modal-content/NewQRCode';
import ChemInfoChild from 'components/general-modal/modal-content/ChemInfoChild'

const QRCodeFilter = ({ onScanResult, onClose }) => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState(null); // Initialize as null for conditional rendering

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
              // Check if the result is a hexadecimal value
              if (/^[0-9A-F]+$/i.test(result.data)) {
                // Stop the scanner as we have a hexadecimal value
                qrScanner.stop();

                const qrData = { qrID: result.data };
                const scanResult = await validateAndProcessQrCode('scan', qrData);

                console.log('scanResult: ', scanResult)

                
                if (scanResult && scanResult.type === 'NEW') {
                  onScanResult(<NewQRCode data={scanResult} onClose={onClose}/>, "1600px", "QR Code Scan");
                } else if (scanResult && scanResult.type === 'CHEMICAL') {
                  onScanResult(<ChemInfoChild data={scanResult.data} />, "1000px", "Chemical Information");
                } else if (scanResult && scanResult.type === 'LOCATION') {
                  const parts = ['building', 'room', 'subLocation1', 'subLocation2', 'subLocation3', 'subLocation4']
                  .map(key => scanResult.data[0][key]) // Map keys to values
                  .filter(value => value !== null && value !== undefined && value !=='') // Filter out falsy values (null, undefined, '', etc.)
                  .join(' >> '); // Join remaining values with ' >> '
                  onScanResult(<LocChem locationName={scanResult.data[0].locationName} returnData={scanResult.data}/>, "1000px", "Location ( " + scanResult.data[0].locationName + " ) " + parts);
                } else {
                  // Handle other types of scan results if necessary
                }
              } else {
                // If not a hexadecimal, you might want to log or handle this case differently
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
  }, [onScanResult]);

  return (
    <div>
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <SubCard>
            <Grid container spacing={2}>
              <video ref={videoRef} style={{ width: '100%' }} />
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </div>
  );
};
export default QRCodeFilter;