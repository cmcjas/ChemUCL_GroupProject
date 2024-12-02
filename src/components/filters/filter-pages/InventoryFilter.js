import {  Grid, TextField, Chip, Button} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

// project imports
//import MainCard from 'components/ui-component/cards/MainCard';
import React, { useState } from 'react';
import SubCard from 'components/ui-component/cards/SubCard';
//import FormControl from 'components/ui-component/extended/Form/FormControl';

//import SecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
//import { gridSpacing } from 'store/constant';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


const InventoryFilter = ({ dataChem, data1, data2, onFilterChange }) => {

  let [locationName, setLocationName] = useState('');
  let [chemicalType, setChemicalType] = useState('');
  let [researchGroupID, setResearchGroupID] = useState('');
  let [supplier, setSupplier] = useState('');

  // Handler for the click event of the button

  const handleApplyFilters = () => {

    const filters = { locationName, chemicalType, researchGroupID, supplier };
    
    onFilterChange(filters); // Invoke the passed function with the input value as argument
  };

  return (
    <div>
    <Grid container spacing={3} style={{ marginBottom: '20px' }}> {/* Ensure this is a container to apply spacing correctly */}
      <Grid item xs={12}> {/* This Grid item wraps the SubCard */}
        <SubCard title="Filter Chemical">
        <Autocomplete
          id="group-autocomplete"
          options={data2}
          getOptionLabel={(option) => option.locationName || null}
          isOptionEqualToValue={(option, value) => option.locationID === value.locationName}
          onChange={(e, value) => {
            if (value && 'locationName' in value) {
              setLocationName(value.locationName);
            } else {
              setLocationName(null);
            }
          }}
          renderInput={(params) => (
              <TextField
              {...params}
              label="Filter By Location"
              name="locationName"
              required
              fullWidth
              margin="normal"
              />
          )}
        />

        <FormControl fullWidth required>
          <InputLabel id="demo-simple-select-label">Filter By Chemical Type</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Filter By Type"
              name="chemicalType"
              sx={{marginBottom: 1.5}}
              value={chemicalType}
              onChange={(e) => setChemicalType(e.target.value)}  
          >
              <MenuItem value={null}>None</MenuItem>
              <MenuItem value={'Chemical'}>Chemical</MenuItem>
              <MenuItem value={'Poisons'}>Poisons</MenuItem>
              <MenuItem value={'Explosives'}>Explosives</MenuItem>
              <MenuItem value={'Chemical Weapon'}>Chemical Weapon</MenuItem>
              <MenuItem value={'Pyrophorics'}>Pyrophorics</MenuItem>
              <MenuItem value={'Drug Precursor'}>Drug Precursor</MenuItem>
              <MenuItem value={'New Type'}>New Type</MenuItem>
          </Select>
        </FormControl>
        </SubCard>
      </Grid>
    </Grid>
    <Grid item xs={12}>
          <SubCard>
          <Autocomplete
            id="group-autocomplete"
            options={data1}
            getOptionLabel={(option) => option.groupName || null}
            isOptionEqualToValue={(option, value) => option.groupID === value.groupID}
            onChange={(e, value) => {
              if (value && 'researchGroupID' in value) {
                setResearchGroupID(value.researchGroupID);
              } else {
                setResearchGroupID(null); 
              }
            }}
            renderInput={(params) => (
                <TextField
                {...params}
                label="Filter By Owner"
                name="researchGroupID"
                required
                fullWidth
                margin="normal"
                />
            )}
          />
          <Autocomplete
            id="group-autocomplete"
            options={dataChem}
            getOptionLabel={(option) => option.supplier || null}
            isOptionEqualToValue={(option, value) => option.chemicalID === value.supplier}
            onChange={(e, value) => {
              if (value && 'supplier' in value) {
                setSupplier(value.supplier);
              } else {
                // Handle the case where 'value' is null or 'value.groupId' is not available
                // You might want to clear the selection or set a default value
                setSupplier(null); // or any other default or placeholder value
              }
            }}
            renderInput={(params) => (
                <TextField
                {...params}
                label="Filter By Supplier"
                name="supplier"
                required
                fullWidth
                margin="normal"
                />
            )}
          />
          </SubCard>
        </Grid>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
export default InventoryFilter;
