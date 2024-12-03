'use client';

import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import EnhancedTable, { PassArgReq } from 'views/table/reqTable';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Tab, Tabs, Typography } from '@mui/material';

// assets

// tab content
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

// ================================|| UI TABS - SAMPLE ||================================ //

export default function SimpleTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        variant="scrollable"
        onChange={handleChange}
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
        <EnhancedTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
        cupidatat skateboard dolor brunch.
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EnhancedTable s />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <EnhancedTable s={false} />
      </TabPanel>
    </>
  );
}