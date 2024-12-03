import React, { useState } from 'react';
import { Button,  Grid, TextField, DialogActions, DialogContent, Tabs, Tab, Box} from '@mui/material';

import { useFormState } from 'react-dom';
import { addUserAction } from 'services/user/form-actions/addUser';
import { addResearchGroupAction } from 'services/research-group/form-actions/addResearchGroup';

import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { set } from 'lodash';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


export default function UserForm(props) {

  const data1 = props.r

  const [message, setMessage] = useState('');

  const [selectedGroupID, setSelectedGroupID] = useState('');

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log(tabValue)
  
  return (
    <div>
    <Grid container spacing={3} sx={{ height: "60vh"}}> {/* Ensure this is a container to apply spacing correctly */}
      <Grid item xs={12} > {/* This Grid item wraps the SubCard */}
        
      <div>
        <form 
          action={async (formData) => {
            if (tabValue === 0) {
              formData.append('researchGroupID', selectedGroupID);
              try {
                await addUserAction(formData);
                setMessage('Added Successfully')
              }catch (error) {
                setMessage('Error adding user');
              }
            } else {
              try {
                await addResearchGroupAction(formData);
                setMessage('Added Successfully')
              }catch (error) {
                setMessage('Error adding research group');  
              }  
            }
          }}
        >
        <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Create User" />
          <Tab label="Create Research Group" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
        <div>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    required="true"
                    label="Full Name"
                    type="string"
                />
                <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">Select User Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select User Role"
                        name="permission"
                        required="true"
                        sx={{marginBottom: 1.5}}
                    >
                        <MenuItem value={'Admin'}>Admin</MenuItem>
                        <MenuItem value={'Staff'}>Staff</MenuItem>
                        <MenuItem value={'Research Student'}>Research Student</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <TextField
                    autoFocus
                    margin="dense"
                    name="email"
                    required="true"
                    label="Email"
                    type="string"
                />
            </div>
            <Autocomplete
                  id="group-autocomplete"
                  options={data1}
                  getOptionLabel={(option) => option.groupName || null}
                  isOptionEqualToValue={(option, value) => option.groupID === value.groupID}
                  onChange={(e, value) => setSelectedGroupID(value ? value.groupID : '')}
                  renderInput={(params) => (
                      <TextField
                      {...params}
                      label="Select Owner"
                      fullWidth
                      margin="normal"
                      />
                  )}
              />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <TextField
            autoFocus
            margin="dense"
            name="groupName"
            required="true"
            label="Research Group Name"
            type="string"
          />
        </TabPanel>
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