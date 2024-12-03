'use client';
// material-ui
import { Typography } from '@mui/material';
import EnhancedTable from './table/logTable';
import React, { useState } from 'react';
import { Button, Tabs, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Box} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';


// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import FilterModal from 'components/filters/FilterModal';
import CSVExport from './forms/tables/tbl-exports';
import SystemLogsFilter from 'components/filters/filter-pages/SystemLogsFilter';

// ==============================|| SAMPLE PAGE ||============================== //

const SystemLogPage = (props) => {

  const dataLoc = props.l;
  const dataUser = props.u;
  const dataLog = props.s;

  // search bar & Filters

  const [logsearch, setSearchTerm] = useState('');

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const [filterCriteria, setFilterCriteria] = useState('');

  const handleFilterChange = (newCriteria) => {
    setFilterCriteria(newCriteria);
  };


  const name = filterCriteria.name;
  const action = filterCriteria.action;
  const building = filterCriteria.building;
  const room = filterCriteria.room;
  const subLocation1 = filterCriteria.subLocation1;
  const subLocation2 = filterCriteria.subLocation2;
  const restricted = filterCriteria.restricted;
  const fromDate = filterCriteria.fromDate;
  const toDate = filterCriteria.toDate;

  const filters = { name, action, building, room, subLocation1, subLocation2, restricted, fromDate, toDate};


  const getFilteredData = (logsearch, dataLog, filters) => {
    return dataLog.filter((item) => {
      // Filter by search term
      const matchesSearchTerm = logsearch ? item.chemical.chemicalName.toLowerCase().includes(logsearch.toLowerCase()) : true;

      const matchesBuilding = filters.building ? item.chemical.location.building == filters.building : true;
  
      const matchesRoom = filters.room ? item.chemical.location.room == filters.room : true;
  
      const matchesSublocation1 = filters.subLocation1 ? item.chemical.location.subLocation1 == filters.subLocation1 : true;
  
      const matchesSubcation2 = filters.subLocation2 ? item.chemical.location.subLocation2 === filters.subLocation2 : true;
  
      const matchesName = filters.name ? item.user.name == filters.name : true;
  
      const matchesAction = filters.action ? item.actionType == filters.action : true;

      // if (!filters.restricted) {
      //   filters.restricted = null;
      // } else {
      //   filters.restricted = filters.restricted;
      // }
      // const restricted = Array.isArray(filters.restricted) && filters.restricted.length > 0 ? filters.restricted.includes(item.chemical.chemicalType) : true;

      const restricted = Array.isArray(filters.restricted) && filters.restricted.length > 0 ? filters.restricted.includes(item.chemical.chemicalType) : true;


      item.timestamp = new Date(item.timestamp)

      const matchesFromDate = filters.fromDate ? item.timestamp >= filters.fromDate : true;
      const matchesToDate = filters.toDate ? item.timestamp <= filters.toDate : true;
      const matchesDate = matchesFromDate && matchesToDate;

      return matchesSearchTerm && matchesBuilding && matchesRoom && matchesSublocation1 && matchesSubcation2 && matchesName && matchesAction && restricted && matchesDate;
    });
  };

  const filteredData = getFilteredData(logsearch, dataLog.logs, filters);
  console.log('filteredData:', filteredData);

  const filteredDataCSV = filteredData.map((item) => {
    return {
      'Log ID': item.logID,
      'QR Code': item.chemical.qrCode,
      'Chemical ID': item.chemicalID,
      'Chemical Name': item.chemical.chemicalName,
      'Supplier': item.chemical.supplier,
      'Action': item.actionType,
      'User': item.user.name,
      'User ID': item.userID,
      'Research Group ID': item.user.researchGroupID,
      'Date ': item.timestamp,
    };
  });
  console.log('filteredDataCSV:', filteredDataCSV);

  const headers = [
    { label: 'Log ID', key: 'Log ID' },
    { label: 'Item Name', key: 'Item Name' },
    { label: 'Action', key: 'Action' },
    { label: 'Person', key: 'Person' },
    { label: 'Date', key: 'Date' },
  ];

  const [modelOpen, setModelOPen] = useState(false);

  
  
  const handleCloseModal = () => {
    setModelOPen(false);
  };

  return (
    // display table

    <MainCard title="System Logs">
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
        <form>
            <TextField
            type="text"
            style={{width: '300px'}}
            placeholder="Search All Logs"
            value={logsearch}
            onChange={handleChange}
            />
        </form>
        </Grid>
        {/*<Grid item>
        
          <CSVExport data={filteredData} filename='system_logs.csv' header={headers}/>
        
        </Grid>*/}
        <Grid item>
          <Box display='flex' flexDirection= {{ xs: 'column', sm: 'row' }} justifyContent='center' alignItem='center' >
          <CSVExport data={filteredDataCSV} filename='system_logs.csv' header={headers}/>
            <Button sx={{marginLeft: 1, marginBottom:1}} size="large" startIcon={<SortIcon />} 
                        variant="contained" 
                        onClick={() => setModelOPen(true)}
                        color="primary">Filter</Button>
                <FilterModal 
                    childComponent={<SystemLogsFilter dataUser={dataUser} onFilterChange={handleFilterChange} open={modelOpen} onClose={handleCloseModal} />} 
                    maxWidth="1200px"
                    open={modelOpen} 
                    onClose={() => {setModelOPen(false)}}
                />
          </Box>
        </Grid>
      </Grid>
      <Typography variant="body2">
        <EnhancedTable s={filteredData} />
      </Typography>

    </MainCard>
  )
  };

export default SystemLogPage;
