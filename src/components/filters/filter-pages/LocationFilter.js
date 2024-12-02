import {  Grid, TextField, Chip, Button} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

// project imports
//import MainCard from 'components/ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import SubCard from 'components/ui-component/cards/SubCard';
//import FormControl from 'components/ui-component/extended/Form/FormControl';
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';
//import SecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
//import { gridSpacing } from 'store/constant';
import { validateAndProcessLocation } from 'services/location/locationActionHandler';

// assets
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


const LocationFilter = ({onFilterChange}) => {

  
  let [building, setBuilding] = useState('');
  let [room, setRoom] = useState('');
  let [subLocation1, setSublocation1] = useState('');
  let [subLocation2, setSublocation2] = useState('');
  let [subLocation3, setSublocation3] = useState('');
  let [subLocation4, setSubLocation4] = useState('');

  const handleApplyFilters = () => {

    const filters = { building, room, subLocation1, subLocation2, subLocation3 };
    
    onFilterChange(filters); // Invoke the passed function with the input value as argument
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
          <SubCard title="Filter Location">
                {/* For large screens (lg), each takes up 3 of 12 columns (4 columns in total).
                  For medium screens (md), each takes up 6 of 12 columns (2 columns in total).
                  For small screens (xs) and smaller, each takes up the full width (12 columns, or 1 column per row). */}
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
export default LocationFilter;
