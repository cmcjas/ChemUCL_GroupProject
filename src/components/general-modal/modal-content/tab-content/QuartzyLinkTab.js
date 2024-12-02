import React, { useState } from 'react';
// material-ui
import { Grid, TextField, Button } from '@mui/material';
import SubCard from 'components/ui-component/cards/SubCard';

import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';
import { validateAndProcessQrCode } from 'services/qr-code/qrCodeActionHandler';

const QuartzyLinkTab = ({data, onClose}) => {
  const qrID = data.qrID;

const [quartzyCode, setQuartzyCode] = useState('');

const handleLink = async () => {
  const result = await validateAndProcessChemical('find', {quartzyNumber: quartzyCode});
  if(result.error) {
    console.log(result.error);
    return;
  } else {
    console.log('QuartzyCode matched', result);
    const qrLink = await validateAndProcessQrCode('update', {qrID: qrID.toString(), chemicalID: result.chemicals[0].chemicalID, type: 'CHEMICAL'});
    console.log('QR Link', qrLink);
    onClose();
  }
}

  return (
    <div>
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <SubCard title="Link to existing Chemical">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quartzy Code"
                  multiline
                  rows={4}
                  placeholder="Enter in Quartzy code to link to existing Chemical"
                  variant="outlined"
                  value={quartzyCode}
                  onChange={(e) => setQuartzyCode(e.target.value)}
                />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
      {/* Link Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleLink}>
          Link
        </Button>
      </div>
    </div>
  );
};

export default QuartzyLinkTab;
