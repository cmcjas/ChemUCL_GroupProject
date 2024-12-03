import QRCode from 'qrcode';
import JSZip from 'jszip';

import { lastQrCode } from 'db/queries/QrCode';
import { validateAndProcessQrCode } from 'services/qr-code/qrCodeActionHandler';

export const downloadQRCode = async (qrValue) => {
  try {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = 'bold 24px Arial'; // Increase font size and make it bold
    const textMetrics = tempCtx.measureText(qrValue);
    const textWidth = textMetrics.width + 40; // Add some padding to the text width

    const qrSize = Math.max(200, textWidth); // Ensure the QR code is not too small

    const dataUrl = await QRCode.toDataURL(qrValue, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: qrSize,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const qrImage = new Image();
    qrImage.src = dataUrl;
    await new Promise((resolve) => (qrImage.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const padding = 20;
    const textHeight = 50; // Adjust text area height to accommodate larger and bolder font
    // Adjust canvas size to include the QR code, text, and padding
    canvas.width = Math.max(qrImage.width, textWidth) + padding * 2;
    canvas.height = qrImage.height + padding * 2 + textHeight;

    // Draw the general background extending up behind the QR code
    ctx.fillStyle = '#ffffff'; // Set the background color
    // Fill a rectangle that covers the entire canvas area behind the QR code and text
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the QR code centered on the canvas
    ctx.drawImage(qrImage, (canvas.width - qrImage.width) / 2, padding);

    // Adjust text drawing settings for larger and bolder text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Adjust text position to be centered over its background
    ctx.fillText(qrValue, canvas.width / 2, qrImage.height + padding * 1.5 + (textHeight + padding / 2) / 2);

    const finalDataUrl = canvas.toDataURL('image/png');

    return finalDataUrl; // Return the data URL for the QR code image
  } catch (err) {
    console.error('Error generating QR code: ', err);
  }
};

export const printQRCode = async (qrValue, printContainer) => {
  try {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = 'bold 24px Arial';
    const textMetrics = tempCtx.measureText(qrValue);
    const textWidth = textMetrics.width + 40;

    const qrSize = Math.max(200, textWidth);

    const dataUrl = await QRCode.toDataURL(qrValue, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: qrSize,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const qrImage = new Image();
    qrImage.src = dataUrl;
    await new Promise((resolve) => (qrImage.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const padding = 20;
    const textHeight = 50;
    canvas.width = Math.max(qrImage.width, textWidth) + padding * 2;
    canvas.height = qrImage.height + padding * 2 + textHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(qrImage, (canvas.width - qrImage.width) / 2, padding);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(qrValue, canvas.width / 2, qrImage.height + padding * 1.5 + (textHeight + padding / 2) / 2);

    printContainer.appendChild(canvas);
  } catch (err) {
    console.error('Error generating QR code for print: ', err);
  }
};

export const generateMultipleQRCodes = async ({ count, value, upTo, exportType }) => {
  let printIframe;
  let printContainer;
  let qrIds = []; // Array to collect QR IDs and data URLs

  const setupPrintEnvironment = () => {
    printIframe = document.createElement('iframe');
    printIframe.style.position = 'absolute';
    printIframe.style.width = '0px';
    printIframe.style.height = '0px';
    printIframe.style.border = '0px';
    document.body.appendChild(printIframe);

    printContainer = printIframe.contentWindow.document.body;
    printContainer.style.display = 'flex';
    printContainer.style.flexDirection = 'column';
    printContainer.style.alignItems = 'center';
  };

  const generateAndCollectQR = async (qrValue) => {
    const addQrCodeResult = await validateAndProcessQrCode('add', {
      type: 'NEW',
    });

    if (addQrCodeResult.error) {
      console.error('Error adding QR code to database:', addQrCodeResult.error);
      return;
    } else {
      console.log('QR code added to database successfully:', addQrCodeResult.qrCode);
      const qrID = addQrCodeResult.qrCode.qrID;
      // Convert qrID to hexadecimal representation
      const qrIDHex = qrID.toString(16);
      qrValue = qrIDHex; // Use hexadecimal representation for QR code generation

      switch (exportType) {
        case 'print':
          await printQRCode(qrValue, printContainer);
          break;
        case 'download':
          const dataUrl = await downloadQRCode(qrValue);
          if (dataUrl) {
            // Store both the hexadecimal qrID and the data URL
            qrIds.push({ qrID: qrIDHex, dataUrl });
          } else {
            console.error(`Missing data URL for QR code: ${qrValue}`);
          }
          break;
        case 'csv':
          qrIds.push(qrIDHex);
          break;
      }
    }
  };

  if (exportType === 'print') {
    setupPrintEnvironment();
  }

  const lastQRID = await validateAndProcessQrCode('latest', {});
  let baseValue = 0;
  if (lastQRID && !isNaN(parseInt(lastQRID.qrID))) {
    baseValue = parseInt(lastQRID.qrID);
  }

  if (count) {
    const batchSize = 10;
    for (let i = 1; i <= count; i += batchSize) {
      const startValue = baseValue + i;
      const endValue = Math.min(baseValue + i + batchSize - 1, baseValue + count);
      for (let j = startValue; j <= endValue; j++) {
        await generateAndCollectQR(j.toString());
      }
    }
  } else if (value && !upTo) {
    await generateAndCollectQR(value);
  } else if (value && upTo) {
    const start = parseInt(value);
    const end = parseInt(upTo);
    if (!isNaN(start) && !isNaN(end) && end - start <= 100) {
      for (let i = start; i <= end; i++) {
        await generateAndCollectQR(i.toString());
      }
    } else {
      console.error('Invalid range or the difference exceeds the maximum limit of 1000.');
    }
  }

  if (exportType === 'csv') {
    // Directly map qrIds to a new line without a header
    const csvContent = "data:text/csv;charset=utf-8," + qrIds.map(e => `"${e}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "qr_ids.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (exportType === 'download') {
    const zip = new JSZip();
    const folder = zip.folder("QR Codes");
    qrIds.forEach(({ qrID, dataUrl }) => {
      if (dataUrl) {
        const fileName = `qr-code-${qrID}.png`;
        const base64Data = dataUrl.split('base64,')[1];
        if (base64Data) {
          folder.file(fileName, base64Data, {base64: true});
        } else {
          console.error(`Failed to process base64 data for QR code: ${qrID}`);
        }
      } else {
        console.error(`Missing data URL for QR code: ${qrID}`);
      }
    });

    zip.generateAsync({type:"blob"}).then(function(content) {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.download = "qr_codes.zip";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (exportType === 'print' && printIframe) {
    const printWindow = printIframe.contentWindow;
    printWindow.focus();
    printWindow.print();
    setTimeout(() => document.body.removeChild(printIframe), 1000);
  }
};
