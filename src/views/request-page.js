'use client';

// material-ui
import EnhancedTable from './table/reqTable';
import React, { useState } from 'react';
import { Box, Typography, Button, Tab, Tabs, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import PropTypes from 'prop-types';
import { TestData } from 'data/testingReq';
import Link from 'next/link';

import SortIcon from '@mui/icons-material/Sort';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const RequestPage = () => {
  // search bar

  const [reqsearch, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getfilteredData = (reqsearch, props) => {
    if (!reqsearch) {
      return props.s;
    }
    return props.s.filter((item) => item.name.toLowerCase().includes(reqsearch.toLowerCase()));
  };

  // tab logics

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel({ children, value, index, ...other }) {
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && (
          <Box
            sx={{
              p: 3
            }}
          >
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  function PassArgReq(s) {
    if (s === true || s === false) {
      const filterData = TestData.filter((item) => item.status === s);

      return getfilteredData(reqsearch, { s: filterData });
    }
    return getfilteredData(reqsearch, { s: TestData });
  }

  return (
    // display table

    <MainCard title="All Requests">
      <Tabs>
        <form>
          <TextField type="text" style={{ width: '300px' }} placeholder="Search All Requests" value={reqsearch} onChange={handleChange} />
        </form>
        <div style={{ marginLeft: 'auto', marginRight: '60px' }}>
          <Button style={{ height: '38px', width: '100px', left: '40px' }} startIcon={<SortIcon />} variant="contained" color="primary">
            Filter
          </Button>
        </div>
      </Tabs>

      {/* tab display */}
      <Tabs
        value={value}
        variant="scrollable"
        onChange={tabChange}
        sx={{
          mb: 3,
          '& a': {
            minHeight: 'auto',
            minWidth: 10,
            py: 1.5,
            px: 1,
            mr: 2.2,
            color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          },
          '& a.Mui-selected': {
            color: theme.palette.primary.main
          },
          '& a > svg': {
            mb: '0px !important',
            mr: 1.1
          }
        }}
      >
        <Tab component={Link} href="#" label="All" {...a11yProps(0)} />
        <Tab component={Link} href="#" label="New" {...a11yProps(1)} />
        <Tab component={Link} href="#" label="Approved" {...a11yProps(2)} />
        <Tab component={Link} href="#" label="Cancelled" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EnhancedTable s={PassArgReq('')} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
        cupidatat skateboard dolor brunch.
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EnhancedTable s={PassArgReq(true)} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <EnhancedTable s={PassArgReq(false)} />
      </TabPanel>
    </MainCard>
  );
};

export default RequestPage;
