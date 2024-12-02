import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from 'react';

// material-ui
import { Grid, TextField, Typography, Button, Checkbox, FormGroup, FormControlLabel, Chip } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { validateAndProcessLocation } from 'services/location/locationActionHandler';

// project imports
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';
import SubCard from 'components/ui-component/cards/SubCard';
import CustomDateTime from 'components/forms/components/DateTime/CustomDateTime';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { sub } from 'date-fns';


const SystemLogsFilter = ({ dataUser, onFilterChange, open, onClose }) => {

  let [building, setBuilding] = useState('');
  let [room, setRoom] = useState('');
  let [subLocation1, setSublocation1] = useState('');
  let [subLocation2, setSublocation2] = useState('');
  let [subLocation3, setSublocation3] = useState('');
  let [subLocation4, setSubLocation4] = useState('');
  let [name, setName] = useState('');
  let [action, setAction] = useState('');

  const [fromDate, setFromDate] = React.useState(new Date('2024-01-01'));
  const [toDate, setToDate] = React.useState(new Date('2024-01-01'));

  const [checkedState, setCheckedState] = useState({
    all: false,
    poisons: false,
    explosives: false,
    chemicalWeapon: false,
    pyrophorics: false,
    drugPrecursor: false,
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
      drugPrecursor: checked,
    });
  };

  // Function to handle toggling individual checkboxes
  const handleToggleCheckbox = (event) => {
    const { name, checked } = event.target;
    const newState = { ...checkedState, [name]: checked };
  
    // Determine if all other checkboxes are checked after the current change.
    const allChecked = Object.values(newState).filter((value, index) => index > 0).every((val) => val);
  
    // Update 'all' checkbox based on other checkboxes.
    // Note: Assumes 'all' is the first property in your state object.
    newState.all = allChecked;
  
    setCheckedState(newState);
  };

  const restricted = Object.entries(checkedState)
  .filter(([key, value]) => key !== 'all' && value === true)
  .map(([key]) => key);

  const handleApplyFilters = () => {

    const filters = { name, action, building, room, subLocation1, subLocation2, restricted, fromDate, toDate};
    console.log('filters: ', filters);
    
    onFilterChange(filters); // Invoke the passed function with the input value as argument
    // onClose(); // Close the dialog
  };

  // drop down location values define
  const  [buildingOptions, setBuildingOptions] = useState([]);
  const  [roomOptions, setRoomOptions] = useState([]);
  const  [subLocation1Options, setSubLocation1Options] = useState([]);
  const  [subLocation2Options, setSubLocation2Options] = useState([]);
  const  [subLocation3Options, setSubLocation3Options] = useState([]);
  const  [subLocation4Options, setSubLocation4Options] = useState([]);

  const fetchBuildingOptions = async () => {
    const buildingOptionsResponse = await validateAndProcessLocation('find', {});
    const allBuildings = buildingOptionsResponse.locations.map((location) => location.building);
    const uniqueBuildings = [...new Set(allBuildings)];
    console.log('uniqueBuildings: ', uniqueBuildings);
    setBuildingOptions(uniqueBuildings);
  };

  useEffect(() => {
    fetchBuildingOptions();
  }, []);


  const fetchRoomOptions = async () => {
    const roomOptionsResponse = await validateAndProcessLocation('find', {building: building});
    const allRooms = roomOptionsResponse.locations.map((location) => location.room);
    const formattedRooms = allRooms.map((room) => room === '' ? 'None' : room);
    // const filteredRooms = allRooms.filter((room) => room !== '');
    const uniqueRooms = [...new Set(formattedRooms)];
    console.log('uniqueRooms: ', uniqueRooms);
    setRoomOptions(uniqueRooms);
  };
  useEffect(() => {
    if (building) {
      fetchRoomOptions();

    }
  }, [building]);

  const fetchSubLocation1Options = async () => {
    const subLocation1OptionsResponse = await validateAndProcessLocation('find', {building: building, room: room});
    const allSubLocation1 = subLocation1OptionsResponse.locations.map((location) => location.subLocation1);
    const formattedSubLocation1 = allSubLocation1.map((subLocation1) => subLocation1 === '' ? 'None' : subLocation1);
    // const filteredSubLocation1 = allSubLocation1.filter((subLocation1) => subLocation1 !== '');
    const uniqueSubLocation1 = [...new Set(formattedSubLocation1)];
    console.log('uniqueSubLocation1: ', uniqueSubLocation1);
    setSubLocation1Options(uniqueSubLocation1);
  };
  useEffect(() => {
    if (room) {
      fetchSubLocation1Options();

    }
  }, [room]);

  const fetchSubLocation2Options = async () => {
    const subLocation2OptionsResponse = await validateAndProcessLocation('find', {building: building, room: room, subLocation1: subLocation1});
    const allSubLocation2 = subLocation2OptionsResponse.locations.map((location) => location.subLocation2);
    const formattedSubLocation2 = allSubLocation2.map((subLocation2) => subLocation2 || 'None');
    const validSubLocation2 = formattedSubLocation2.filter((subLocation2) => subLocation2 !== null);
    // const filteredSubLocation2 = allSubLocation2.filter((subLocation2) => subLocation2 !== '');
    const uniqueSubLocation2 = [...new Set(validSubLocation2)];
    console.log('uniqueSubLocation2: ', uniqueSubLocation2);
    setSubLocation2Options(uniqueSubLocation2);
  };

  useEffect(() => {
    if (subLocation1) {
      fetchSubLocation2Options();
    }
  }, [subLocation1]);

  const fetchSubLocation3Options = async () => {
    const subLocation3OptionsResponse = await validateAndProcessLocation('find', {building: building, room: room, subLocation1: subLocation1, subLocation2: subLocation2});
    const allSubLocation3 = subLocation3OptionsResponse.locations.map((location) => location.subLocation3);
    const formattedSubLocation3 = allSubLocation3.map((subLocation3) => subLocation3 || 'None');
    const validSubLocation3 = formattedSubLocation3.filter((subLocation3) => subLocation3 !== null);
    const uniqueSubLocation3 = [...new Set(validSubLocation3)];
    console.log('uniqueSubLocation3: ', uniqueSubLocation3);
    setSubLocation3Options(uniqueSubLocation3);
  };

  useEffect(() => {
    if (subLocation2) {
      fetchSubLocation3Options();
    }
  }, [subLocation2]);

  const fetchSubLocation4Options = async () => {
    const subLocation4OptionsResponse = await validateAndProcessLocation('find', {building: building, room: room, subLocation1: subLocation1, subLocation2: subLocation2, subLocation3: subLocation3});
    const allSubLocation4 = subLocation4OptionsResponse.locations.map((location) => location.subLocation4);
    const formattedSubLocation4 = allSubLocation4.map((subLocation4) => subLocation4 || 'None');
    const validSubLocation4 = formattedSubLocation4.filter((subLocation4) => subLocation4 !== null);
    const uniqueSubLocation4 = [...new Set(validSubLocation4)];
    console.log('uniqueSubLocation4: ', uniqueSubLocation4);
    setSubLocation4Options(uniqueSubLocation4);
  };

  useEffect(() => {
    if (subLocation3) {
      fetchSubLocation4Options();
    }
  }, [subLocation3]);


  return (
    <div>
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <SubCard title="Location">
            <Grid container spacing={3}>
                {/* For large screens (lg), each takes up 3 of 12 columns (4 columns in total).
                  For medium screens (md), each takes up 6 of 12 columns (2 columns in total).
                  For small screens (xs) and smaller, each takes up the full width (12 columns, or 1 column per row). */}
              <Grid item xs={12} sm={6} md={6} lg={3}>
              <Autocomplete 
                    disablePortal 
                    options={buildingOptions} 
                    onChange={(e, newValue) => setBuilding(newValue)}
                    renderInput={(params) => <TextField {...params} label="Building" />}
              />

              <Autocomplete
                      disablePortal
                      options={roomOptions}
                      value={room}
                      onChange={(e, newValue) => setRoom(newValue)}
                      renderInput={(params) => <TextField {...params} label="Room" />}
              />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
              <Autocomplete
                    disablePortal
                    options={subLocation1Options || ['None']}
                    value={subLocation1}
                    onChange={(e, newValue) => setSublocation1(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 1" />}
              />
              <Autocomplete
                    disablePortal
                    options={subLocation2Options || ['None']}
                    value={subLocation2}
                    onChange={(e, newValue) => setSublocation2(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 2" />}
              />
                </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
              <Autocomplete
                    disablePortal
                    options={subLocation3Options || ['None']}
                    value={subLocation3}
                    onChange={(e, newValue) => setSublocation3(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 3" />}
              />
              <Autocomplete
                    disablePortal
                    options={subLocation4Options || ['None']}
                    value={subLocation4}
                    onChange={(e, newValue) => setSubLocation4(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 4" />}
              />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>

      {/* SubCards section */}
      <Grid container spacing={3}>
        {/* SubCard 1 */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <SubCard title="Period">
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={'FROM'}
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}  
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={'TO'}
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}  
                />
              </LocalizationProvider>
            </Grid>
          </SubCard>
        </Grid>
        {/* SubCard 2 */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <SubCard title="Action">
            <Grid container >
            <Grid item xs={12}>
              <Autocomplete
                id="group-autocomplete"
                options={[
                  { value: null, label: 'None'},
                  { value: 'add', label: 'Added' },
                  { value: 'update', label: 'Updated' },
                  { value: 'delete', label: 'Disposed' }                    
                ]}
                getOptionLabel={(option) => option.label || null}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(e, value) => { 
                  if (value && 'value' in value) {
                    setAction(value.value);
                  } else {
                    setAction(null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter By Action"
                    name="action"
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
              />
            </Grid>
            </Grid>
          </SubCard>
        </Grid>
        {/* SubCard 3 */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <SubCard title="User">
          <Autocomplete
                id="group-autocomplete"
                options={dataUser.users.map((user) => ({name: user.name, value: user.name}))}
                getOptionLabel={(option) => option.name || null}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                onChange={(e, value) => {
                  if (value && 'name' in value) {
                    console.log('value name: ', value);
                    setName(value.name);
                  } else {
                    setName(null);
                  }
                }}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Filter By User Name"
                    name="name"
                    required
                    fullWidth
                    margin="normal"
                    />
                )}
              />
          </SubCard>
        </Grid>
        {/* SubCard 4 */}
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <SubCard title="Restricted">
            <Grid item>
              <FormControlLabel control={<Checkbox checked={checkedState.all} onChange={handleToggleAll} />} label="All" />
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox name="poisons" checked={checkedState.poisons} onChange={handleToggleCheckbox} />} label="Poisons" />
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox name="explosives" checked={checkedState.explosives} onChange={handleToggleCheckbox} />} label="Explosives" />
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox name="chemicalWeapon" checked={checkedState.chemicalWeapon} onChange={handleToggleCheckbox} />} label="Chemical Weapon" />
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox name="pyrophorics" checked={checkedState.pyrophorics} onChange={handleToggleCheckbox} />} label="Pyrophorics" />
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox name="drugPrecursor" checked={checkedState.drugPrecursor} onChange={handleToggleCheckbox} />} label="Drug Precursor" />
            </Grid>
          </SubCard>
        </Grid>
      </Grid>

      {/* Apply Filters Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default SystemLogsFilter;
