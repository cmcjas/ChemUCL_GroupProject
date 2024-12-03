'use client';

// material-ui
import { Typography } from '@mui/material';
import EnhancedTable from './table/locTable';
import React, { useState, useEffect } from 'react';
import {Box, Button, Tabs, TextField, Grid} from '@mui/material';

import SortIcon from '@mui/icons-material/Sort';
import LocForm from 'sections/forms/Locform';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import AddFormModal from 'sections/AddFormModal';
// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import LocationFilter from 'components/filters/filter-pages/LocationFilter';
import FilterModal from 'components/filters/FilterModal';

// ==============================|| SAMPLE PAGE ||============================== //

const LocationPage = ( props ) => {

  const dataLoc = props.l;
  
  const [filterCriteria, setFilterCriteria] = useState('');

  const handleFilterChange = (newCriteria) => {
    setFilterCriteria(newCriteria);
  };

  const building = filterCriteria.building;
  const room = filterCriteria.room;
  const subLocation1 = filterCriteria.subLocation1;
  const subLocation2 = filterCriteria.subLocation2;

  const filters = { building, room, subLocation1, subLocation2};

  // search bar & Filters

  const [locsearch, setSearchTerm] = useState('');

  const handleChange = event => {
  setSearchTerm(event.target.value);
  };
  
  const getFilteredData = (locsearch, dataLoc, filters) => {
    return dataLoc.filter((item) => {
      // Filter by search term
      // const matchesSearchTerm = locsearch ? item.locationName.toLowerCase().includes(locsearch.toLowerCase()) : true;
      const matchesSearchTerm = locsearch ? (
        item.locationName.toLowerCase().includes(locsearch.toLowerCase()) ||
        item.building.toLowerCase().includes(locsearch.toLowerCase()) ||
        item.room.toLowerCase().includes(locsearch.toLowerCase()) ||
        item.subLocation1.toLowerCase().includes(locsearch.toLowerCase()) ||
        item.subLocation2.toLowerCase().includes(locsearch.toLowerCase()) ||
        item.subLocation3.toLowerCase().includes(locsearch.toLowerCase()) ||
        item.subLocation4.toLowerCase().includes(locsearch.toLowerCase())
      ) : true;
  
      const matchesBuilding = filters.building ? item.building == filters.building : true;
  
      const matchesRoom = filters.room ? item.room == filters.room : true;
  
      const matchesSublocation1 = filters.subLocation1 ? item.subLocation1 == filters.subLocation1 : true;
  
      const matchesSubcation2 = filters.subLocation2 ? item.subLocation2 === filters.subLocation2 : true;
  
      return matchesSearchTerm && matchesBuilding && matchesRoom && matchesSublocation1 && matchesSubcation2;
    });
  };

  const filteredData = getFilteredData(locsearch, dataLoc, filters);

  const [modelOpen, setModelOPen] = useState(false);
  const [addModelOpen, setAddModelOPen] = useState(false);


  return (
    // display table

    <MainCard title="Locations">
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <form>
              <TextField
              type="text"
              style={{width: '300px'}}
              placeholder="Search All Locations"
              value={locsearch}
              onChange={handleChange}
              />
          </form>
        </Grid>
        
        <Grid item>
          <Box display='flex' flexDirection= {{ xs: 'column', sm: 'row' }} justifyContent='center' alignItem='center' >
            <Button sx={{marginLeft: 1, marginBottom: 1}} 
                        startIcon={<SortIcon />} 
                        size="large"
                        variant="contained" 
                        onClick={() => setModelOPen(true)}
                        color="primary"
                      >
                        Filter
                      </Button>
            <FilterModal 
                    childComponent={<LocationFilter  onFilterChange={handleFilterChange}/>} 
                    maxWidth="600px"
                    open={modelOpen} 
                    onClose={() => {setModelOPen(false)}}
                />
            <Button
              sx={{marginLeft: 1, marginBottom: 1}}
              color="primary"
              size="large"
              startIcon={<AddOutlinedIcon />}
              variant="contained"
              onClick={() => setAddModelOPen(true)}
            >
              Add Location
            </Button>
            <AddFormModal
              childComponent={<LocForm />}
              maxWidth="600px"
              height="85%"
              title="Add Location"
              open={addModelOpen}
              onClose={() => {
                setAddModelOPen(false);
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Typography variant="body2">
        <EnhancedTable s={filteredData} />
      </Typography>
    
    </MainCard>
  );
};

export default LocationPage;
