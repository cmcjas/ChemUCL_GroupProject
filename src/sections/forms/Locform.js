'use client';
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { Button, Grid, TextField, DialogActions, DialogContent } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
// project imports
import { addLocationAction } from 'services/location/form-actions/addLocation';


export default async function LocForm() {

  const [message, setMessage] = useState('');

return (
  <div>
  <Grid container spacing={3} sx={{ height: "80vh"}}> {/* Ensure this is a container to apply spacing correctly */}
    <Grid item xs={12} > {/* This Grid item wraps the SubCard */}
      
        <div>
          <form 
            action={async (formData) => {
              try {
                await addLocationAction(formData);
                setMessage('Added Successfully');
              }catch (error) {
                setMessage('Error adding location');
              }
            }}
          >
          <DialogContent>
          <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Building</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select Building"
                    name="building"
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
                    name="room"
                    required="true"
                    label="Room"
                    type="string"
                    sx={{ marginRight: 2 }}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    name="subLocation1"
                    required="true"
                    label="Sub Location 1"
                    type="string"
                  />
                </div>
                <div>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="subLocation2"
                    label="Sub Location 2"
                    type="string"
                    sx={{ marginRight: 2 }}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    name="subLocation3"
                    label="Sub Location 3"
                    type="string"
                  />
                </div>
                <TextField
                  autoFocus
                  margin="dense"
                  name="subLocation4"
                  label="Sub Location 4"
                  type="string"
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
