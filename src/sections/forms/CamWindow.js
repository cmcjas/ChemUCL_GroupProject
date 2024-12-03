import { Autocomplete, Grid, TextField, Chip, Button } from '@mui/material';

// project imports
// import MainCard from 'components/ui-component/cards/MainCard';
import SubCard from 'components/ui-component/cards/SubCard';
// import FormControl from 'components/ui-component/extended/Form/FormControl';
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';
// import SecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
// import { gridSpacing } from 'store/constant';

import ScanQR from 'components/scan';
// assets
// import Visibility from '@mui/icons-material/Visibility';
// import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
// import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
// import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';

const CamWindow = ({fetchAndSetChemicalData, locationID}) => (
  <div>
    <Grid container spacing={3}>
      {' '}
      {/* Ensure this is a container to apply spacing correctly */}
      <Grid item xs={12}>
        {' '}
        {/* This Grid item wraps the SubCard */}
        <ScanQR fetchAndSetChemicalData={fetchAndSetChemicalData} locationID={locationID}/>
      </Grid>
    </Grid>
  </div>
);
export default CamWindow;
