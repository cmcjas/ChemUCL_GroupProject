'use client';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { findLog } from 'db/queries/Log';
import { validateAndProcessLog } from 'services/log/logActionHandler';

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

// assets

// table data
function createData(logID, chemicalName, supplier, locationName, action, person, description, date) {
  return {
    logID,
    chemicalName,
    supplier,
    locationName,
    action,
    person,
    description,
    date
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
    id: 'logID',
    numeric: false,
    disablePadding: true,
    label: 'Log ID'
  },
  {
    id: 'chemicalName',
    numeric: true,
    disablePadding: false,
    label: 'Item Name'
  },
  {
    id: 'supplier',
    numeric: true,
    disablePadding: false,
    label: 'Supplier'
  },
  {
    id: 'locationName',
    numeric: true,
    disablePadding: false,
    label: 'Location Name'
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action'
  },
  {
    id: 'person',
    numeric: true,
    disablePadding: false,
    label: 'Person'
  },
  {
    id: 'description',
    numeric: true,
    disablePadding: false,
    label: 'Description'
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Date'
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

const EnhancedTableToolbar = ({ numSelected }) => (
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
        All Logs
      </Typography>
    )}
    <Box sx={{ flexGrow: 1 }} />
  </Toolbar>
);

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

// ==============================|| TABLE - DATA TABLE ||============================== //

function EnhancedTable(props) {

  const rows = props.s.map((item) => {
    
    // Check if item.chemical is not null and item.chemical.chemicalName is not null
    const chemicalName = item.chemical && item.chemical.chemicalName
      ? item.chemical.chemicalName
      : item.description.split(/[\s,]+/)[0]; // Extracts the first word from description if chemicalName is null or item.chemical is null
    const supplier = item.chemical && item.chemical.supplier
      ? item.chemical.supplier
      : item.description.split(/[\s,]+/)[1]; // Extracts the second word from description if supplier is null or item.chemical is null

    if (item.chemical) {}
    const locationName = item.chemical
      ? item.chemical.location.locationName
      : item.description.split(',').pop().trim(); // Extracts the third word from description if locationName is null or item.chemical.location is null

    return createData(
      item.logID,
      chemicalName,
      supplier,
      locationName,
      item.actionType,
      item.user.name,
      item.description,
      new Date(item.timestamp).toISOString().split('T')[0]
    );
  });

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('amount');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedValue, setSelectedValue] = useState([]);

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
        const newSelectedId = rows.map((n) => n.logID);
        setSelected(newSelectedId);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, logID) => {
    const selectedIndex = selected.indexOf(logID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, logID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    const selectedRowData = rows.filter((row) => newSelected.includes(row.logID));

    setSelectedValue(selectedRowData);
    setSelected(newSelected);

    console.log(selectedRowData); 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const isSelected = (logID) => selected.indexOf(logID) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  const fetchData = async () => {
    await validateAndProcessLog('find', {page: page, rowsPerPage: rowsPerPage});
    // await findLog({}, page, rowsPerPage);
  }

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  return (
    <MainCard>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />

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
                  const isItemSelected = isSelected(row.logID);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.logID)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.logID}
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
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.logID}
                      </TableCell>
                      <TableCell align="right">{row.chemicalName}</TableCell>
                      <TableCell align="right">{row.supplier}</TableCell>
                      <TableCell align="right">{row.locationName}</TableCell>
                      <TableCell align="right">{row.action}</TableCell>
                      <TableCell align="right">{row.person}</TableCell>
                      <TableCell align="right">{row.description}</TableCell>
                      <TableCell align="right">{row.date}</TableCell>
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

