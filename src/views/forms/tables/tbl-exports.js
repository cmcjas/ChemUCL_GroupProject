'use client';

import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
// import { ButtonBase, Tooltip } from '@mui/material';
import { Button, Tabs, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';

// third-party
import { CSVLink } from 'react-csv';

// assets
import { IconDeviceFloppy } from '@tabler/icons-react';

// ==============================|| CSV Export ||============================== //

const CSVExport = ({ data, filename, headers }) => {
  const theme = useTheme();

  return (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Button
        /*style={{ height: '38px', width: '120px', left: '20px' }}*/
        variant="contained"
        startIcon={<IosShareIcon />}
        /*aria-label="two layers"*/
        sx={{ marginLeft: 1, marginBottom: 1 }}
        size="large"
        color="primary"
      >
        Export CSV
      </Button>
    </CSVLink>
  );
};

CSVExport.propTypes = {
  data: PropTypes.array,
  filename: PropTypes.string,
  headers: PropTypes.string
};

export default CSVExport;
