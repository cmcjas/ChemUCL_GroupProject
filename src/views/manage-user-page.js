'use client';
// material-ui
import { Typography } from '@mui/material';
import EnhancedTable from './table/userTable';
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { Button, TextField} from '@mui/material';

import SortIcon from '@mui/icons-material/Sort';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import FilterModal from 'components/filters/FilterModal';
import ManageUsersFilter from 'components/filters/filter-pages/ManageUsersFilter';
import PropTypes from 'prop-types';
import FileUploadButton from 'services/user/form-actions/import-user-csv';
import { Box, Grid } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

import AddFormModal from 'sections/AddFormModal';
import UserForm from 'sections/forms/UserForm';

//fot import csv
import { useImport } from "@refinedev/core";
import {
  useDataGrid,
  List,
  ImportButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from 'react-query';
import DownloadExcelUser from 'components/ui-component/download-excel-user';


// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { FileUpload } from '../../node_modules/@mui/icons-material/index';

const columns = [
  { field: "id", headerName: "ID", type: "number" },
  { field: "name", headerName: "Full Name", minWidth: 200, flex: 1 },
  { field: "role", headerName: "Role", minWidth: 200, flex: 1 },
  { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
  { field: "status", headerName: "Status", minWidth: 200, flex: 1 },
];

const PostsList = () => {
  const { dataGridProps } = useDataGrid();
  return (
    <List
      headerButtons={<ImportButton inputProps={inputProps} loading={isLoading} />}
    >
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};

const propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
};

// ==============================|| SAMPLE PAGE ||============================== //

const ManageUserPage = ( props ) => { 

  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  const dataUser = props.u;
  const data1 = props.r;


    // search bar & Filters

    const [usersearch, setSearchTerm] = useState('');

    const handleChange = event => {
      setSearchTerm(event.target.value);
    };

    const [filterCriteria, setFilterCriteria] = useState('');

    const handleFilterChange = (newCriteria) => {
      setFilterCriteria(newCriteria);
    };

    const role = filterCriteria.role;
    const activeStatus = filterCriteria.activeStatus;
    const researchGroup = filterCriteria.researchGroup;
    const auditStatus = filterCriteria.auditStatus;
  
    const filters = { role, activeStatus, researchGroup, auditStatus };

    const getFilteredData = (usersearch, dataUser, filters) => {
      return dataUser.filter((item) => {
        // Filter by search term
        const matchesSearchTerm = usersearch ? item.name.toLowerCase().includes(usersearch.toLowerCase()) : true;
    
        const matchesRole = filters.role ? item.permission == filters.role : true;
    
        const matchesActiveStatus = filters.activeStatus ? item.activeStatus == filters.activeStatus : true;
    
        const matchesResearchGroup = filters.researchGroup ? item.researchGroupID == filters.researchGroup : true;
    
        if (filters.auditStatus === true) {
          filters.auditStatus === 'Researcher(Staff)';
        } else {
          filters.auditStatus === 'Researcher';
        }
        const matchesAuditStatus = filters.auditStatus ? item.permission === filters.auditStatus : true;
     
        return matchesSearchTerm && matchesRole&& matchesActiveStatus && matchesResearchGroup && matchesAuditStatus;
      });
    };
  
    const filteredData = getFilteredData(usersearch, dataUser, filters);



  // button state logics

  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen= useMediaQuery(theme.breakpoints.down('sm'));



  const [modelOpen, setModelOPen] = useState(false);

  const [addModelOpen, setAddModelOPen] = useState(false);

  // const { inputProps, isLoading } = useImport();
  // const { isLoading, error, data } = useQuery('users', fetchUsers);

  return (
    // display table

    <MainCard title="Manage Users">
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
        <form>
            <TextField
            type="text"
            style={{width: '300px'}}
            placeholder="Search All Users"
            value={usersearch}
            onChange={handleChange}
            />
        </form>
        </Grid>

            {/* <ImportButton 
              inputProps={inputProps} 
              loading={isLoading} 
              style={{height: '38px', width: '120px', left: '20px'}}
              variant="contained" 
              startIcon={<ImportExportIcon />} 
              aria-label="two layers" 
              sx={{ bgcolor: '#90ee90',color: '#000000' }}
            >
              Import CSV
            </ImportButton> */}
            {/*<Grid item>
              <FileUploadButton t="Import User" w='150px' onFileSelect={(file) => {
                console.log(file);
              }} />
            </Grid>*/}
            <Grid item>
              <Box display='flex' flexDirection={{ xs: 'column', sm:'row'}} justifyContent='center' alignItem='center'>
                <FileUploadButton t="Import User" w='150px' onFileSelect={(file) => {
                  console.log(file);
                }} />
                <Button sx={{marginLeft: 1, marginBottom:1}} size="large" startIcon={<SortIcon />} 
                    variant="contained" 
                    onClick={() => setModelOPen(true)}
                    color="primary">Filter</Button>
                  <FilterModal 
                      childComponent={<ManageUsersFilter data1={data1} onFilterChange={handleFilterChange}/>} 
                      maxWidth="600px"
                      open={modelOpen} 
                      onClose={() => {setModelOPen(false)}}
                  />
                <Button  sx={{marginLeft:1, marginBottom:1}} size="large"
                color="primary"
                startIcon={<AddOutlinedIcon />} variant="contained" onClick={() => setAddModelOPen(true)}>Add User</Button>
                <AddFormModal 
                    childComponent={<UserForm r={data1}/>} 
                    maxWidth="450px"
                    height="60%"
                    title="Add User & Group"
                    open={addModelOpen} 
                    onClose={() => {setAddModelOPen(false)}}
                />
              </Box>
              {['Admin', 'Staff', 'Temporary Staff'].includes(session?.user.role) && (
              <DownloadExcelUser />
              )}
            </Grid>
      </Grid>
      <Typography variant="body2">
        <EnhancedTable s={filteredData} />
      </Typography>

    </MainCard>
  )
  };

export default ManageUserPage;
