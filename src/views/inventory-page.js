'use client';
// material-ui
import { Typography } from '@mui/material';
import EnhancedTable from './table/intTable';
import React, { useState, useEffect } from 'react';
import { Box, Button, Tabs, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';

import SortIcon from '@mui/icons-material/Sort';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileUploadButton from 'components/ui-component/import-csv';
import HeadingForm from 'sections/forms/HeadingForm'
import IosShareIcon from '@mui/icons-material/IosShare';
// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import FilterModal from 'components/filters/FilterModal';
import InventoryFilter from 'components/filters/filter-pages/InventoryFilter';
import DownloadExcelInventory from 'components/ui-component/download-excel-inventory';
import CSVExport from 'views/forms/tables/tbl-exports.js';

import AddFormModal from 'sections/AddFormModal';
import ChemForm from 'sections/forms/ChemForm';

import { getSession } from 'next-auth/react';
import { filter } from 'lodash';

// ==============================|| SAMPLE PAGE ||============================== //

const InventoryPage = (props) => {

  const dataChem = props.c;
  const data1 = props.r;
  const data2 = props.l;

  const [filterCriteria, setFilterCriteria] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  const handleFilterChange = (newCriteria) => {
    setFilterCriteria(newCriteria);
  };

  const locationName = filterCriteria.locationName;
  const chemicalType = filterCriteria.chemicalType;
  const researchGroupID = filterCriteria.researchGroupID;
  const supplier = filterCriteria.supplier;
  const restrictionStatus = filterCriteria.restrictionStatus;

  const filters = { locationName, chemicalType, researchGroupID, supplier, restrictionStatus};

  // search bar & filters

  const [intsearch, setSearchTerm] = useState('');

  const handleChange = event => {
  setSearchTerm(event.target.value);
  };
  
  const getFilteredData = (intsearch, dataChem, filters, session) => {
    return dataChem.filter((item) => {
      // Filter by search term
      const locationName = item.location.building + ' ' + item.location.room + ' ' + item.location.subLocation1 + ' ' + item.location.subLocation2 + ' ' + item.location.subLocation3 + ' ' + item.location.subLocation4;

      const matchesSearchTerm = intsearch ? item.chemicalName.toLowerCase().includes(intsearch.toLowerCase()) : true;
  
      const matchesLocationName = filters.locationName ? locationName == filters.locationName : true;

      const matchesRestrictionStatus = session && session.user && ['Staff', 'Admin', 'Temporary Staff'].includes(session.user.role) ? true : item.restrictionStatus === false;
  
      const matchesChemicalType = filters.chemicalType ? item.chemicalType == filters.chemicalType : true;
  
      const matchesResearchGroupID = filters.researchGroupID ? item.researchGroupID == filters.researchGroupID : true;
  
      const matchesSupplier = filters.supplier ? item.supplier === filters.supplier : true;

      // const matchesStudentRestriction = session.user.role === 'Research Student' ? item.restrictionStatus === false : true;
  
      return matchesSearchTerm && matchesLocationName && matchesChemicalType && matchesResearchGroupID && matchesSupplier && matchesRestrictionStatus;
    });
  };

  const filteredData = getFilteredData(intsearch, dataChem, filters, session);

  const [modelOpen, setModelOPen] = useState(false);
  const [addModelOpen, setAddModelOPen] = useState(false);
  const [headingModelOpen, setHeadingModelOPen] = useState(false);

  const filteredDataExport = filteredData.map((item) => {
    return {
      'Qr Code': item.location.qrCode,
      'Quartzy Number': item.quartzyNumber,
      'CAS No': item.casNumber,
      'Chemical Name': item.chemicalName,
      'Amount(units)': item.quantity,
      'Supplier': item.supplier,
      'Research Group': item.researchGroup.groupName,
      'Restriction Status': item.restrictionStatus? 'Restricted' : 'Unrestricted',
      'Building': item.location.building,
      'Room': item.location.room,
      'Sublocation 1': item.location.subLocation1,
      'Sublocation 2': item.location.subLocation2,
      'Sublocation 3': item.location.subLocation3,
      'Sublocation 4': item.location.subLocation4,
      'Description': item.description,
    };
    }
  );

  const headersExport = [
    { label: 'Qr Code', key: 'Qr Code' },
    { label: 'Quartzy Number', key: 'Quartzy Number' },
    { label: 'CAS No', key: 'CAS No' },
    { label: 'Chemical Name', key: 'Chemical Name' },
    { label: 'Amount(units)', key: 'Amount(units)' },
    { label: 'Supplier', key: 'Supplier' },
    { label: 'Research Group', key: 'Research Group' },
    { label: 'Restriction Status', key: 'Restriction Status' },
    { label: 'Building', key: 'Building' },
    { label: 'Room', key: 'Room' },
    { label: 'Sublocation 1', key: 'Sublocation 1' },
    { label: 'Sublocation 2', key: 'Sublocation 2' },
    { label: 'Sublocation 3', key: 'Sublocation 3' },
    { label: 'Sublocation 4', key: 'Sublocation 4' },
    { label: 'Description', key: 'Description' },
  ];


  return (
    // display table
    <MainCard title="UCL Inventory">
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <form>
            <TextField
              type="text"
              style={{ width: '300px' }}
              placeholder="Search Inventory items"
              value={intsearch}
              onChange={handleChange}
            />
          </form>
        </Grid>        
        <Grid item>
          <Box display='flex' flexDirection={{ xs: 'column', sm:'row'}} justifyContent='center' alignItem='center'>            
          {/* {['Admin', 'Staff', 'Temporary Staff'].includes(session?.user.role) && (  */}
                    
            <FileUploadButton
              t="Import Inventory"
              onFileSelect={(file) => {
                console.log(file);
              }}/>
            
            {/* )} */}
            <Button
              size="large"
              variant="contained"
              color="primary"
              sx={{ marginLeft: 1, marginBottom: 1}}
              onClick={() => setHeadingModelOPen(true)}
            >
              Heading
            </Button>
            <Button
              size="large"
              startIcon={<SortIcon />}
              variant="contained"
              onClick={() => setModelOPen(true)}
              color="primary"
              sx={{ marginLeft: 1, marginBottom: 1}}
            >
              Filter
            </Button>
            <FilterModal
              childComponent={<InventoryFilter dataChem={dataChem} data1={data1} data2={data2} onFilterChange={handleFilterChange}/>}
              maxWidth="600px"
              open={modelOpen}
              onClose={() => {
                setModelOPen(false);
              }}
            />
            <Button
              sx={{marginLeft: 1, marginBottom: 1}}
              color="primary"
              size="large"
              startIcon={<AddOutlinedIcon />}
              variant="contained"
              onClick={() => setAddModelOPen(true)}
            >
              Add Item
            </Button>
            <AddFormModal
              childComponent={<ChemForm r={data1} l={data2}/>}
              maxWidth="600px"
              height="85%"
              title="Add Chemical"
              open={addModelOpen}
              onClose={() => {
                setAddModelOPen(false);
              }}
            />

            <AddFormModal
              childComponent={<HeadingForm />}
              maxWidth="400px"
              height="75%"
              title="Heading Filter"
              open={headingModelOpen}
              onClose={() => {
                setHeadingModelOPen(false);
              }}
            />

            
            <CSVExport data={filteredDataExport} filename='inventory.csv' headers={headersExport} />


          </Box>
          {/* {['Admin', 'Staff', 'Temporary Staff'].includes(session?.user.role) && ( */}
    <DownloadExcelInventory />
  {/* )} */}
        </Grid>
        </Grid>
      
      <Grid item xs={12}>
      <Typography variant="body2">
        <EnhancedTable s={filteredData} />
      </Typography>
      </Grid>
      

    </MainCard>
  );
};

export default InventoryPage;
