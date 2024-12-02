import React, { useState } from 'react';

// material-ui
import { Grid, TextField, Typography, Button, Checkbox, FormGroup, FormControlLabel, Autocomplete, Chip, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// project imports
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';
import SubCard from 'components/ui-component/cards/SubCard';
import CustomDateTime from 'components/forms/components/DateTime/CustomDateTime';

const top100Films = [
  { label: 'The Dark Knight', id: 1 },
  { label: 'Control with Control', id: 2 },
  { label: 'Combo with Solo', id: 3 },
  { label: 'The Dark', id: 4 },
  { label: 'Fight Club', id: 5 },
  { label: 'demo@company.com', id: 6 },
  { label: 'Pulp Fiction', id: 7 }
];

const currencies = [
  {
    value: '',
    label: 'None'
  },
  {
    value: '1',
    label: 'Charles Ingrid Building'
  },
  {
    value: '2',
    label: 'Lerrya@company.com'
  },
  {
    value: '3',
    label: 'judiya@company.com'
  },
  {
    value: '3',
    label: 'taju_diya@company.com'
  },
  {
    value: '4',
    label: 'judiyaLerrya@company.com'
  }
];

const LocationTab = ({ data, onClose }) => {
  const qrID = data.qrID;

  const [checkedState, setCheckedState] = useState({
    all: false,
    poisons: false,
    explosives: false,
    chemicalWeapon: false,
    pyrophorics: false,
    drugPrecursor: false
  });

  // Function to handle toggling the 'All' checkbox
  const handleToggleAll = (event) => {
    const { checked } = event.target;
    setCheckedState({
      all: checked,
      poisons: checked,
      explosives: checked,
      chemicalWeapon: checked,
      pyrophorics: checked,
      drugPrecursor: checked
    });
  };

  // Function to handle toggling individual checkboxes
  const handleToggleCheckbox = (event) => {
    const { name, checked } = event.target;
    const newState = { ...checkedState, [name]: checked };

    // Determine if all other checkboxes are checked after the current change.
    const allChecked = Object.values(newState)
      .filter((value, index) => index > 0)
      .every((val) => val);

    // Update 'all' checkbox based on other checkboxes.
    // Note: Assumes 'all' is the first property in your state object.
    newState.all = allChecked;

    setCheckedState(newState);
  };

  return (
    <div>
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <SubCard title="Location">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <TextField
                  id="outlined-read-only-input"
                  required
                  fullWidth
                  label="QR ID"
                  value={qrID} // Use the extracted qrID value
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControlSelect currencies={currencies} captionLabel="Building" selected="1" required />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControlSelect currencies={currencies} captionLabel="Room" selected="" required />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControlSelect currencies={currencies} captionLabel="Sub Location 1" selected="" required />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControlSelect currencies={currencies} captionLabel="Sub Location 2" selected="" />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControlSelect currencies={currencies} captionLabel="Sub Location 3" selected="" />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControlSelect currencies={currencies} captionLabel="Sub Location 4" selected="" />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
      {/* Apply Filters Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </div>
    </div>
  );
};

export default LocationTab;
