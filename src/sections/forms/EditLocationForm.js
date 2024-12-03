'use client';
import React, { useState } from 'react';
import { Button, Grid, TextField, DialogActions, DialogContent } from '@mui/material';
import { useFormState } from 'react-dom';
import { updateLocationAction } from 'services/location/form-actions/updateLocation';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


export default function EditLocationForm(props) {

  const [message, setMessage] = useState('');

  return (
    <div>
      <Grid container spacing={3} sx={{ height: '80vh' }}>
        <Grid item xs={12}>
          <div>
            <form 
              action={async (formData) => {
                  formData.append('locationID', props.i);
                  try{
                    await updateLocationAction(formData);
                    setMessage('Updated Successfully');
                  }catch (error) {
                    setMessage('Error updating location');
                  }
              }}
            >
              <DialogContent>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select New Building ({props.a})</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="building"
                    label="Select New Building"
                    required="true"
                    sx={{ marginBottom: 0.5 }}
                  >
                    <MenuItem value="Charles Ingrid Building">Charles Ingrid Building</MenuItem>
                    <MenuItem value="Building Two">Building Two</MenuItem>
                  </Select>
                </FormControl>
                <div>
                  <TextField
                    autoFocus
                    margin="dense"
                    required="true"
                    name="room"
                    label={props.b}
                    type="string"
                    sx={{ marginRight: 2 }}
                    placeholder="Enter New room"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    name="subLocation1"
                    required="true"
                    label={props.c}
                    type="string"
                    placeholder="Enter New Sub Location 1"
                  />
                </div>
                <div>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="subLocation2"
                    label={props.d}
                    type="string"
                    sx={{ marginRight: 2 }}
                    placeholder="Enter New Sub Location 2"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    name="subLocation3"
                    label={props.e}
                    type="string"
                    placeholder="Enter New Sub Location 3"
                  />
                </div>
                <TextField
                  autoFocus
                  margin="dense"
                  name="subLocation4"
                  label={props.f}
                  type="string"
                  placeholder="Enter New Sub Location 4"
                />
              </DialogContent>
              <DialogActions>
              <Button type="submit" variant="contained" color="primary" sx={{marginLeft: 1, marginBottom: 1}}>
                Save
              </Button>
              </DialogActions>
            </form>
            {message && <p>{message}</p>} {/* Display message from server action */}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
