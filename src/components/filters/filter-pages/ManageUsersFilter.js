import {  Grid, TextField, Chip, Button} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

// project imports
//import MainCard from 'components/ui-component/cards/MainCard';
import SubCard from 'components/ui-component/cards/SubCard';
import React, { useState } from 'react';
//import FormControl from 'components/ui-component/extended/Form/FormControl';
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';
//import SecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
//import { gridSpacing } from 'store/constant';

// assets
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


const ManageUsersFilter = ({ data1, onFilterChange }) => {

  let [role, setRole] = useState('');
  let [researchGroup, setResearchGroup] = useState('');
  let [auditStatus, setAudit] = useState('');
  let [activeStatus, setActive] = useState('');

  const handleApplyFilters = () => {

    const filters = { role, researchGroup, auditStatus, activeStatus };
    
    onFilterChange(filters); // Invoke the passed function with the input value as argument
  };

  return (
    <div>
    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <SubCard title="Filter User">
              <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Filter By Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Filter By Role"
                    name="role"
                    sx={{marginBottom: 1.5}}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}  
                >
                    <MenuItem value={null}>None</MenuItem>
                    <MenuItem value={'Admin'}>Admin</MenuItem>
                    <MenuItem value={'Staff'}>Staff</MenuItem>
                    <MenuItem value={'Research Student'}>Research Student</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Filter By Active Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Filter By Active Status"
                    name="activeStatus"
                    sx={{marginBottom: 1.5}}
                    value={activeStatus}
                    onChange={(e) => setActive(e.target.value)}  
                >
                    <MenuItem value={null}>None</MenuItem>
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={'false'}>Deactivated</MenuItem>
                </Select>
            </FormControl>

              <Autocomplete
                id="group-autocomplete"
                options={data1}
                getOptionLabel={(option) => option.groupName || null}
                isOptionEqualToValue={(option, value) => option.groupID === value.groupID}
                onChange={(e, value) => {
                  if (value && 'researchGroupID' in value) {
                    setResearchGroup(value.researchGroupID);
                  } else {
                    setResearchGroup(null);
                  }
                }}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Filter By Research Group"
                    name="researchGroupID"
                    required
                    fullWidth
                    margin="normal"
                    />
                )}
              />
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Filter By Audit Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Filter By Audit Status"
                    name="auditStatus"
                    sx={{marginBottom: 1.5}}
                    value={auditStatus}
                    onChange={(e) => setAudit(e.target.value)}  
                >
                    <MenuItem value={null}>None</MenuItem>
                    <MenuItem value={true}>Granted to Researcher</MenuItem>
                    <MenuItem value={false}>Not Granted to Researcher</MenuItem>
                </Select>
            </FormControl>
                
          </SubCard>
        </Grid>
      </Grid>
    
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
export default ManageUsersFilter;
