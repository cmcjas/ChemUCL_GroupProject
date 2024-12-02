import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, TextField, Typography, Button, FormGroup, FormControlLabel, Autocomplete, Chip, InputLabel } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormControl from 'components/ui-component/extended/Form/FormControl';
// project imports
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';
import SubCard from 'components/ui-component/cards/SubCard';
import CustomDateTime from 'components/forms/components/DateTime/CustomDateTime';
import { set } from 'store';
import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';
import { validateAndProcessLocation } from 'services/location/locationActionHandler';
import { current } from '../../../../node_modules/@reduxjs/toolkit/dist/index';
import { trim } from 'lodash';



const ChemInfoChild = ({data}) => {
  const [editMode, setEditMode] = useState(false);
  const [qrID, setQrID] = useState(data[0].qrID);
  const [chemicalName, setChemicalName] = useState(data[0].chemicalName);
  const [casNumber, setCasNumber] = useState(data[0].casNumber);
  const [building, setBuilding] = useState(data[0].location.building);
  const [room, setRoom] = useState(data[0].location.room);
  const [subLocation1, setSubLocation1] = useState(data[0].location.subLocation1);
  const [subLocation2, setSubLocation2] = useState(data[0].location.subLocation2);
  const [subLocation3, setSubLocation3] = useState(data[0].location.subLocation3);
  const [subLocation4, setSubLocation4] = useState(data[0].location.subLocation4);

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

  if (!Array.isArray(data)) {
    // Handle case where chemInfo is not an array
    return <div>{data}</div>;
  }

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

  const handleEditClick = () => {
    console.log("Edit button clicked");
    setEditMode(true);
  }

  const handleSaveClick = async () => {
    const convertedSubLocation1 = subLocation1 === 'None' ? null : subLocation1;
    const convertedSubLocation2 = subLocation2 === 'None' ? null : subLocation2;
    const convertedSubLocation3 = subLocation3 === 'None' ? null : subLocation3;
    const convertedSubLocation4 = subLocation4 === 'None' ? null : subLocation4;
    console.log("Save button clicked")
    const params = {
      chemicalID: data[0].chemicalID,
      qrID: qrID !== null ? qrID.toString() : null,
      chemicalName,
      casNumber,
      building,
      room,
      subLocation1: convertedSubLocation1,
      subLocation2: convertedSubLocation2,
      subLocation3: convertedSubLocation3,
      subLocation4: convertedSubLocation4,

    };
    const result = await validateAndProcessChemical('update', params, '/inventory-page');
    setEditMode(false);
    if (result.error) {
      console.log('error: reach', result.error);
    // Handle validation error
      return { error: result.error };
    }
    console.log('result: ', result);

  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  return (
    <div>
      {/* SubCards section */}
      <Grid container spacing={3}>
        {/* SubCard 1 */}
        {data.map((item, index) => (
          <React.Fragment key={index}>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <SubCard>
              <Grid container spacing={2}>
                <Grid item>
                  <TextField label='QR ID' defaultValue={item.qrID} id='qrID' onChange={(e) => setQrID(e.target.value)} disabled={item.qrID !== null || !editMode} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField defaultValue={item.description} label='Safety Information' disabled/>
                </Grid>
              </Grid>
            </SubCard>
          </Grid>
          
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <SubCard>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField label='Item Name' defaultValue={item.chemicalName} onChange={(e) => setChemicalName(e.target.value)} disabled={!editMode} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField label={'Cas No.'} value={casNumber} onChange={(e) => setCasNumber(e.target.value)} disabled={!editMode} />
                </Grid>
              </Grid>
            </SubCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <SubCard title="Location">
              <Grid container spacing={2}>
                {/* For large screens (lg), each takes up 3 of 12 columns (4 columns in total).
                    For medium screens (md), each takes up 6 of 12 columns (2 columns in total).
                    For small screens (xs) and smaller, each takes up the full width (12 columns, or 1 column per row). */}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete 
                    disablePortal 
                    options={buildingOptions} 
                    value={building} 
                    onChange={(e, newValue) => setBuilding(newValue)}
                    renderInput={(params) => <TextField {...params} label="Building" />}
                    disabled={!editMode} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete
                    disablePortal
                    options={roomOptions}
                    value={room}
                    onChange={(e, newValue) => setRoom(newValue)}
                    renderInput={(params) => <TextField {...params} label="Room" />}
                    disabled={!editMode} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete
                    disablePortal
                    options={subLocation1Options || ['None']}
                    value={subLocation1}
                    onChange={(e, newValue) => setSubLocation1(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 1" />}
                    disabled={!editMode} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete
                    disablePortal
                    options={subLocation2Options || ['None']}
                    value={subLocation2}
                    onChange={(e, newValue) => setSubLocation2(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 2" />}
                    disabled={!editMode} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete
                    disablePortal
                    options={subLocation3Options || ['None']}
                    value={subLocation3}
                    onChange={(e, newValue) => setSubLocation3(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 3" />}
                    disabled={!editMode} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete
                    disablePortal
                    options={subLocation4Options || ['None']}
                    value={subLocation4}
                    onChange={(e, newValue) => setSubLocation4(newValue)}
                    renderInput={(params) => <TextField {...params} label="Sublocation 4" />}
                    disabled={!editMode} />
                </Grid>
              </Grid>
            </SubCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <SubCard>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField label='Restricted Status' defaultValue={item.restrictionStatus ? "Restricted" : "Unrestricted"}  disabled/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField label='Owner' defaultValue={item.researchGroup.groupName || 'None'} disabled/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField label='Supplier' defaultValue={item.supplier} disabled/>
                </Grid>
              </Grid>
            </SubCard>
          </Grid>
          </React.Fragment>
        ))}
      </Grid>

      {/* Edit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        {editMode ? (
          <>
            <Button variant="contained" color="primary" onClick={handleSaveClick} sx={{marginLeft: 1, marginBottom: 1}}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancelClick} sx={{marginLeft: 1, marginBottom: 1}}>
              Cancel
            </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEditClick} sx={{marginLeft: 1, marginBottom: 1}}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChemInfoChild;
