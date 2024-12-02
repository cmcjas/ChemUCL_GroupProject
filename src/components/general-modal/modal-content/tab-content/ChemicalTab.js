import React, { useState, useEffect } from 'react';

// material-ui
import { Grid, TextField, Typography, Button, Checkbox, FormGroup, FormControlLabel, Autocomplete, Chip, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// project imports
import SubCard from 'components/ui-component/cards/SubCard';
import CustomDateTime from 'components/forms/components/DateTime/CustomDateTime';
import { validateAndProcessLocation } from 'services/location/locationActionHandler';
import { validateAndProcessResearchGroup } from 'services/research-group/researchGroupActionHandler';
import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';
import { validateAndProcessQrCode } from 'services/qr-code/qrCodeActionHandler';


const restrictionOptions = [
  {
    value: 'Unrestricted',
    label: 'Unrestricted'
  },
  {
    value: 'General Restriction',
    label: 'General Restriction'
  },
  {
    value: 'Poisons',
    label: 'Poisons'
  },
  {
    value: 'Explosives',
    label: 'Explosives'
  },
  {
    value: 'Chemical Weapons',
    label: 'Chemical Weapons'
  },
  {
    value: 'Pyrophorics',
    label: 'Pyrophorics'
  },
  {
    value: 'Drug Precursor',
    label: 'Drug Precursor'
  }
]


const ChemicalTab = ({data, onClose}) => {
  const qrID = data.qrID;
  const [chemicalName, setChemicalName] = useState('');
  const [casNumber, setCasNumber] = useState('');
  const [supplier, setSupplier] = useState(''); // Added for Supplier
  const [description, setDescription] = useState(''); // Added for Comments

  // Location states
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [subLocation1, setSubLocation1] = useState('');
  const [subLocation2, setSubLocation2] = useState('');
  const [subLocation3, setSubLocation3] = useState('');
  const [subLocation4, setSubLocation4] = useState('');

  // Research Group states
  const [researchGroup, setResearchGroup] = useState('');

  // Restriction Description states
  const [restrictionDescription, setRestrictionDescription] = useState('');

  // Location options states
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [subLocation1Options, setSubLocation1Options] = useState([]);

  // Additional sublocation options states
  const [subLocation2Options, setSubLocation2Options] = useState([]);
  const [subLocation3Options, setSubLocation3Options] = useState([]);
  const [subLocation4Options, setSubLocation4Options] = useState([]);

  // Research Group options states
  const [researchGroupOptions, setResearchGroupOptions] = useState([]);

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

  const fetchCasNumber = debounce((name) => {
    if (!name.trim()) return;
    fetch(`https://commonchemistry.cas.org/api/search?q=${encodeURIComponent(name.trim())}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          setCasNumber(data.results[0].rn); // Assuming 'rn' is the field for CAS Number
        }
      })
      .catch(error => console.error('Error fetching CAS Number:', error));
  }, 500);

  useEffect(() => {
    fetchCasNumber(chemicalName);
  }, [chemicalName]);

  // Fetch building options
  useEffect(() => {
    const fetchBuildingOptions = async () => {
      const response = await validateAndProcessLocation('find', {});
      const buildings = response.locations.map(location => location.building);
      setBuildingOptions([...new Set(buildings)]);
    };
    fetchBuildingOptions();
  }, []);

  // Fetch room options based on selected building
  useEffect(() => {
    const fetchRoomOptions = async () => {
      if (!building) return;
      const response = await validateAndProcessLocation('find', { building });
      const rooms = response.locations.map(location => location.room);
      setRoomOptions([...new Set(rooms)]);
    };
    fetchRoomOptions();
  }, [building]);

  // Fetch subLocation1 options based on selected room
  useEffect(() => {
    const fetchSubLocation1Options = async () => {
      if (!room) return;
      const response = await validateAndProcessLocation('find', { building, room });
      const subLocations = response.locations.map(location => location.subLocation1);
      setSubLocation1Options([...new Set(subLocations)]);
    };
    fetchSubLocation1Options();
  }, [room, building]);

  // Fetch subLocation2 options based on selected subLocation1
  useEffect(() => {
    const fetchSubLocation2Options = async () => {
      if (!subLocation1) return;
      const response = await validateAndProcessLocation('find', { building, room, subLocation1 });
      const subLocations = response.locations.map(location => location.subLocation2).filter(subLocation2 => subLocation2);
      setSubLocation2Options([...new Set(subLocations)].map(subLocation2 => ({ label: subLocation2, value: subLocation2 })));
    };
    fetchSubLocation2Options();
  }, [subLocation1, building, room]);

  // Fetch subLocation3 options based on selected subLocation2
  useEffect(() => {
    const fetchSubLocation3Options = async () => {
      if (!subLocation2) return;
      const response = await validateAndProcessLocation('find', { building, room, subLocation1, subLocation2 });
      const subLocations = response.locations.map(location => location.subLocation3).filter(subLocation3 => subLocation3);
      setSubLocation3Options([...new Set(subLocations)].map(subLocation3 => ({ label: subLocation3, value: subLocation3 })));
    };
    fetchSubLocation3Options();
  }, [subLocation2, building, room, subLocation1]);

  // Fetch subLocation4 options based on selected subLocation3
  useEffect(() => {
    const fetchSubLocation4Options = async () => {
      if (!subLocation3) return;
      const response = await validateAndProcessLocation('find', { building, room, subLocation1, subLocation2, subLocation3 });
      const subLocations = response.locations.map(location => location.subLocation4).filter(subLocation4 => subLocation4);
      setSubLocation4Options([...new Set(subLocations)].map(subLocation4 => ({ label: subLocation4, value: subLocation4 })));
    };
    fetchSubLocation4Options();
  }, [subLocation3, building, room, subLocation1, subLocation2]);

  useEffect(() => {
    const fetchResearchGroupOptions = async () => {
      const response = await validateAndProcessResearchGroup('find', {});
      const researchGroups = response.researchGroups.map(researchGroup => researchGroup.groupName);
      setResearchGroupOptions(researchGroups);
    };
    fetchResearchGroupOptions();
  }, []);

  const handleSave = async () => {
    const params = {
      chemicalName,
      casNumber,
      supplier,
      description,
      building,
      room,
      subLocation1,
      subLocation2: subLocation2 || null,
      subLocation3: subLocation3 || null,
      subLocation4: subLocation4 || null,
      researchGroup,
      restrictionDescription,
      qrID
    };

    try {
      const result = await validateAndProcessChemical('add', params);
      if (result.error) {
        console.error('Error saving chemical:', result.error);
      } else {
        console.log('Chemical saved successfully:', result);
      }
    } catch (error) {
      console.error('Error calling validateAndProcessChemical:', error);
    } finally {
      onClose();
    }
  };

  return (
    <div>
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12}>
          <SubCard title="Chemical Info">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <TextField label="QR ID" required fullWidth value={qrID} InputProps={{ readOnly: true, }} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <TextField label="Name" required fullWidth value={chemicalName} onChange={(e) => setChemicalName(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <TextField label="Cas No." required fullWidth value={casNumber} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <TextField label="Supplier" fullWidth value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Autocomplete
                  options={researchGroupOptions}
                  value={researchGroup}
                  onChange={(event, newValue) => setResearchGroup(newValue)}
                  renderInput={(params) => <TextField {...params} label="Research Group" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id="restriction-description-label">Restricted Status</InputLabel>
                  <Select
                    labelId="restriction-description-label"
                    id="restriction-description"
                    value={restrictionDescription}
                    label="Restricted Status"
                    onChange={(event) => setRestrictionDescription(event.target.value)}
                    required
                  >
                    {restrictionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <SubCard title="Location">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Autocomplete
                  options={buildingOptions}
                  value={building}
                  onChange={(event, newValue) => setBuilding(newValue)}
                  renderInput={(params) => <TextField {...params} label="Building" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Autocomplete
                  options={roomOptions}
                  value={room}
                  onChange={(event, newValue) => setRoom(newValue)}
                  renderInput={(params) => <TextField {...params} label="Room" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Autocomplete
                  options={subLocation1Options}
                  value={subLocation1}
                  onChange={(event, newValue) => setSubLocation1(newValue)}
                  renderInput={(params) => <TextField {...params} label="Sub Location 1" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Autocomplete
                  options={subLocation2Options || []}
                  value={subLocation2Options.find(option => option.value === subLocation2) || null}
                  onChange={(event, newValue) => {
                    setSubLocation2(newValue ? newValue.value : null);
                  }}
                  renderInput={(params) => <TextField {...params} label="Sub Location 2" />}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Autocomplete
                  options={subLocation3Options || []}
                  value={subLocation3Options.find(option => option.value === subLocation3) || null}
                  onChange={(event, newValue) => {
                    setSubLocation3(newValue ? newValue.value : null);
                  }}
                  renderInput={(params) => <TextField {...params} label="Sub Location 3" />}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Autocomplete
                  options={subLocation4Options || []}
                  value={subLocation4Options.find(option => option.value === subLocation4) || null}
                  onChange={(event, newValue) => {
                    setSubLocation4(newValue ? newValue.value : null);
                  }}
                  renderInput={(params) => <TextField {...params} label="Sub Location 4" />}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <SubCard title="Comments">
            <Grid container>
              <TextField fullWidth id="outlined-multiline-flexible" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
      {/* Apply Filters Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
export default ChemicalTab
