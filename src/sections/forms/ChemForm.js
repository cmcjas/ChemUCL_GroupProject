'use client';
import React, { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { Button, Grid, TextField, DialogActions, DialogContent } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
// project imports
import { addChemicalAction } from 'services/chemical/form-actions/addChemical';
import { add } from 'lodash';


export default async function ChemForm(props) {

  const [chemicalName, setChemicalName] = useState('');
  const [casNumber, setCasNumber] = useState('');


  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  const debouncedFetchData = debounce((query) => {
    console.log('fetching data for:', query);
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      // Don't fetch if the query is empty
      setCasNumber(null);
      return;
    }
    fetch(`https://commonchemistry.cas.org/api/search?q=${encodeURIComponent(trimmedQuery)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('response: ', response)
        return response.json();
      })
      .then((data) => {
        if (data.results.length > 0) {
          console.log('data: ', data.results[0].rn);
          setCasNumber(data.results[0].rn);
        }
      })
      .catch((error) => console.error(error));
  }, 500);

  useEffect(() => {
    debouncedFetchData(chemicalName);
  }, [chemicalName]); // Depend on the query state

  const data1 = props.r
  const data2 = props.l

  const [selectedLocationID, setSelectedLocationID] = useState('');
  const [selectedGroupID, setSelectedGroupID] = useState('');

  const [message, setMessage] = useState('');

return (
  <div>
  <Grid container spacing={3} sx={{ height: "80vh"}}> {/* Ensure this is a container to apply spacing correctly */}
    <Grid item xs={12} > {/* This Grid item wraps the SubCard */}
      
        <div>
          <form 
            action={async (formData) => {
                formData.append('locationID', selectedLocationID);
                formData.append('researchGroupID', selectedGroupID);
                try {
                  await addChemicalAction(formData);
                  setMessage('Added Successfully');
                } catch (error) {
                  setMessage('Error adding chemical');
                }
            }}
          >
          <DialogContent>
              <div>
                  <TextField
                      autoFocus
                      margin="dense"
                      name="qrCode"
                      label="QR Code"
                      type="string"
                      sx={{marginRight: 2}}
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      name="chemicalName"
                      label="Chemical Name"
                      required="true"
                      type="string"
                      onChange={(e) => setChemicalName(e.target.value)}
                  />
              </div>
              <div>
                  <TextField
                      autoFocus
                      margin="dense"
                      name="casNumber"
                      required="true"
                      label="CAS Number"
                      type="string"
                      sx={{marginRight: 2}}
                      value={casNumber !== '' ? casNumber : undefined}
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      name="supplier"
                      label="Supplier"
                      type="string"
                  />
              </div>
              <div>
              <TextField
                      autoFocus
                      margin="dense"
                      name="quartzyNumber"
                      label="quartzyNumber"
                      type="string"
              />
              <Autocomplete
                  id="group-autocomplete"
                  options={data1}
                  getOptionLabel={(option) => option.groupName || null}
                  isOptionEqualToValue={(option, value) => option.researchGroupID === value.researchGroupID}
                  onChange={(e, value) => setSelectedGroupID(value ? value.researchGroupID : '')}
                  renderInput={(params) => (
                      <TextField
                      {...params}
                      label="Select Owner"
                      required
                      fullWidth
                      margin="normal"
                      />
                  )}
              />
              </div>
              <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">Select Chemical Type</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Select Chemical Type"
                      name="chemicalType"
                      required="true"
                      sx={{marginBottom: 1.5}}
                  >
                      <MenuItem value={'Chemical'}>Chemical</MenuItem>
                      <MenuItem value={'Poisons'}>Poisons</MenuItem>
                      <MenuItem value={'Explosives'}>Explosives</MenuItem>
                      <MenuItem value={'Chemical Weapon'}>Chemical Weapon</MenuItem>
                      <MenuItem value={'Pyrophorics'}>Pyrophorics</MenuItem>
                      <MenuItem value={'Drug Precursor'}>Drug Precursor</MenuItem>
                      <MenuItem value={'New Type'}>New Type</MenuItem>
                  </Select>
              </FormControl>

            <Autocomplete
            id="location-autocomplete"
            options={data2}
            getOptionLabel={(option) => `${option.building} ${option.room} ${option.subLocation1} ${option.subLocation2 === null ? '' : option.subLocation2} 
            ${option.subLocation3 === null ? '': option.subLocation3} ${option.subLocation4=== null ? '' : option.subLocation4}`}
            isOptionEqualToValue={(option, value) => option.locationID === value.locationID}
            onChange={(e, value) => setSelectedLocationID(value ? value.locationID : '')}
            renderInput={(params) => <TextField {...params} label="Select an Existing Location" required />}
            fullWidth
            />

            <TextField
                autoFocus
                margin="dense"
                name="description"
                label="Safety Information"
                type="string"
                sx = {{width: 350, "& .MuiInputBase-root": {height: 100}}}
            />
          </DialogContent>
          <DialogActions>
              <Button type="submit" color="primary">
                  Add
              </Button>
          </DialogActions>
          </form>
          <p>{message}</p> {/* Display message from server action */}
      </div>

    </Grid>
  </Grid>
  </div>
);
};
