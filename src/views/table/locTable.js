'use client';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GeneralModal from 'components/general-modal/GeneralModal';
import LocChem from 'components/locChem';
import AddFormModal from 'sections/AddFormModal';
import EditLocationForm from 'sections/forms/EditLocationForm';
import { deleteLocation } from 'db/queries/Location';
import ButtonBase from '@mui/material/ButtonBase';
import { findLocation } from 'db/queries/Location';
import { validateAndProcessLocation } from 'services/location/locationActionHandler';

// material-ui
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableSortLabel,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  Stack
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { set } from 'lodash';

// assets

// table data
function createData(locationID, locationName, building, room, sub1, sub2, sub3, sub4) {
  return {
    locationID,
    locationName,
    building,
    room,
    sub1,
    sub2,
    sub3,
    sub4
  };
}

// table filter
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) =>
  order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// table header
const headCells = [
  {
    id: 'locationName',
    numeric: false,
    disablePadding: true,
    label: 'Location Name'
  },
  {
    id: 'building',
    numeric: true,
    disablePadding: false,
    label: 'Building'
  },
  {
    id: 'room',
    numeric: true,
    disablePadding: false,
    label: 'Room'
  },
  {
    id: 'sub1',
    numeric: true,
    disablePadding: false,
    label: 'Sub location 1'
  },
  {
    id: 'sub2',
    numeric: true,
    disablePadding: false,
    label: 'Sub location 2'
  },
  {
    id: 'sub3',
    numeric: true,
    disablePadding: false,
    label: 'Sub location 3'
  },
  {
    id: 'sub4',
    numeric: true,
    disablePadding: false,
    label: 'Sub location 4'
  }
];

// ==============================|| TABLE - HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ pl: 3 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE - HEADER TOOLBAR ||============================== //
const EnhancedTableToolbar = ({ numSelected, passID, passData }) => {


  const [displayEdit, setDisplayEdit] = useState(false);

  return (
  <div>
    {displayEdit && (
      <AddFormModal
        childComponent={<EditLocationForm i={passData.locationID} a={passData.building} b={passData.room} c={passData.sub1} 
        d={passData.sub2} e={passData.sub3} f={passData.sub4} />}
        maxWidth="500px"
        height="70%"
        title="Edit Location"
        open={displayEdit}
        onClose={() => setDisplayEdit(false)}
      />
    )}

  <Toolbar
    sx={{
      p: 0,
      pl: 1,
      pr: 1,
      ...(numSelected > 0 && {
        color: (theme) => theme.palette.secondary.main
      })
    }}
  >
    {numSelected > 0 ? (
      <Typography color="inherit" variant="subtitle1">
        {numSelected} selected
      </Typography>
    ) : (
      <Typography variant="h6" id="tableTitle">
        All Locations
      </Typography>
    )}
    <Box sx={{ flexGrow: 1 }} />
    {numSelected === 1 && (
      <Tooltip title="Edit Location">
        <IconButton size="large">
          <EditIcon onClick={() => setDisplayEdit(true)} />
        </IconButton>
      </Tooltip>
    )}
    {numSelected > 0 && (
      <Tooltip title="Delete Location">
        <IconButton size="large">
          <DeleteIcon onClick={() => passID.forEach(deleteLoc)} />
        </IconButton>
      </Tooltip>
    )}
  </Toolbar>
  </div>
)};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const deleteLoc = (id) => {
  const deleteLoc = validateAndProcessLocation('delete', {locationID: id}, '/location-page');

}

// ==============================|| TABLE - DATA TABLE ||============================== //

function EnhancedTable(props) {

  const rows = [
    ...props.s
    .map((item) => createData(item.locationID, item.locationName, item.building, item.room, item.subLocation1, item.subLocation2, item.subLocation3, 
      item.subLocation4)),
  ];

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('amount');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedValue, setSelectedValue] = useState([]);

  const [selectedId, setSelectedId] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      if (selected.length > 0) {
        setSelected([]);
      } else {
        const newSelectedId = rows.map((n) => n.locationName);
        const passSelectedId = rows.map((n) => n.locationID);
        setSelected(newSelectedId);
        setSelectedId(passSelectedId);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, locationName) => {
    const selectedIndex = selected.indexOf(locationName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, locationName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    const selectedRowData = rows.filter((row) => newSelected.includes(row.locationName.toString()));

    setSelectedValue(selectedRowData);
    setSelected(newSelected);

    // Assuming each row data has an 'id' field
    if(selectedRowData.length > 0) {
      const ids = selectedRowData.map(row => row.locationID); // Collect all IDs
      setSelectedId(ids);
    } else {
      setSelectedId(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const isSelected = (locationName) => selected.indexOf(locationName) !== -1;

  const [modelOpen, setModelOpen] = useState(false);
    // State to hold the currently selected row's data
  const [selectedRowData, setSelectedRowData] = useState({});

  // Function to handle row click
  const handleRowClick = (row, event) => {
    if (selectedValue.length > 0){
      event.stopPropagation(); 
    }


    setSelectedRowData({
      locationID: row.locationID,
      locationName: row.locationName,
      building: row.building,
      room: row.room,
      subLocation1: row.sub1,
      subLocation2: row.sub2,
      subLocation3: row.sub3,
      subLocation4: row.sub4,
    });
    setModelOpen(true);
  };

  
  const parts = ['building', 'room', 'subLocation1', 'subLocation2', 'subLocation3', 'subLocation4']
  .map(key => selectedRowData[key]) // Map keys to values
  .filter(value => value !== null && value !== undefined && value !=='') // Filter out falsy values (null, undefined, '', etc.)
  .join(' >> '); // Join remaining values with ' >> '

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  const fetchData = async () => {
    await findLocation({}, page, rowsPerPage);
  }

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  return (
    <MainCard>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} passID={selectedId} passData={selectedValue[0]}/>

        {/* table */}
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  /** Make sure no display bugs if row isn't an OrderData object */
                  if (typeof row === 'number') return null;
                  const isItemSelected = isSelected(row.locationName);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.locationName)}
                      role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.locationID}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" sx={{ pl: 3 }}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none" >
                        <p style={{cursor: 'pointer'}} onClick={(event) => handleRowClick(row, event)}>{row.locationName}</p>
                      </TableCell>
                      <TableCell align="right">{row.building}</TableCell>
                      <TableCell align="right">{row.room}</TableCell>
                      <TableCell align="right">{row.sub1}</TableCell>
                      <TableCell align="right">{row.sub2}</TableCell>
                      <TableCell align="right">{row.sub3}</TableCell>
                      <TableCell align="right">{row.sub4}</TableCell>
                      {/* </ButtonBase> */}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <GeneralModal
          maxWidth="1000px"
          open={modelOpen} 
          onClose={() => {setModelOpen(false)}}
          childComponent={
            <LocChem 
              locationName={selectedRowData.locationName} 
              returnData={selectedRowData}
            />
          }
          title={"Location ( " + selectedRowData.locationName + " ) " + parts}
        />
        {/* table data */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </MainCard>
  );
}

export default EnhancedTable;

