'use client';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { findUser } from 'db/queries/User';
import { validateAndProcessUser } from 'services/user/userActionHandler';

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
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Button } from '../../../node_modules/@mui/material/index';
import { set } from 'lodash';
import { is } from 'date-fns/locale';
import { updateUserAction } from 'services/user/form-actions/updateUser';


// table data
function createData(ID, name, role, email, status, audit) {
  return {
    ID,
    name,
    role,
    email,
    status,
    audit
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
    id: 'ID',
    numeric: false,
    disablePadding: true,
    label: 'ID'
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Full Name'
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Role'
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email'
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Active'
  },
  {
    id: 'audit',
    numeric: true,
    disablePadding: false,
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

const EnhancedTableToolbar = ({ numSelected, passID }) => {


  const toggleUserStatus = (id, newStatus) => {
    validateAndProcessUser('update', {
      userID: id,
      activeStatus: newStatus,
    });
    // You might want to add some state management here to re-render the component or manage global state
  };

  return (

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
        All Users
      </Typography>
    )}
    <Box sx={{ flexGrow: 1 }} />
    {numSelected > 0 && (
      <Tooltip title="Delete User">
        <IconButton size="large">
          <PersonRemoveIcon onClick={() => passID.forEach(deleteUsers)}/>
        </IconButton>
      </Tooltip>
    )}
    {numSelected > 0  && (
      <Tooltip title="Deactivate User">
        <IconButton size="large" onClick={() => passID.forEach((id) => toggleUserStatus(id, false))}>
          <PersonAddDisabledIcon />
        </IconButton>
      </Tooltip>
    )}
    {numSelected > 0 && (
      <Tooltip title="Activate User">
        <IconButton size="large" onClick={() => passID.forEach((id) => toggleUserStatus(id, true))}>
          <PersonAddIcon />
        </IconButton>
      </Tooltip>
    )}
    
  </Toolbar>
)};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const deleteUsers = (id) => {
    const removeUser= validateAndProcessUser('delete', {userID: id}, '/manage-user-page');
};


// ==============================|| TABLE - DATA TABLE ||============================== //

function EnhancedTable(props) {

  const roleChangeOne = (userID) => {
    validateAndProcessUser('update', {
      userID: userID, 
      permission: 'Temporary Staff'
    });
  }

  const roleChangeTwo = (userID) => {
    validateAndProcessUser('update', {
      userID: userID, 
      permission: 'Research Student'
    });
  }

  // display data into table
  
  const rows = [
    ...props.s
    .map((item) => createData(item.userID, item.name, item.permission, item.email, item.activeStatus.toString(), item.permission)),
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
        const newSelectedId = rows.map((n) => n.ID);
        const passSelectedId = rows.map((n) => n.ID);
        setSelected(newSelectedId);
        setSelectedId(passSelectedId);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, ID) => {
    const selectedIndex = selected.indexOf(ID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    const selectedRowData = rows.filter((row) => newSelected.includes(row.ID));

    setSelectedValue(selectedRowData);
    setSelected(newSelected);

    // Assuming each row data has an 'id' field
    if(selectedRowData.length > 0) {
      const ids = selectedRowData.map(row => row.ID); // Collect all IDs
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

  const isSelected = (ID) => selected.indexOf(ID) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  const fetchData = async () => {
    await findUser({}, page, rowsPerPage);
  }

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  return (
    <MainCard>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} passID={selectedId} />

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
                  const isItemSelected = isSelected(row.ID);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.ID)}
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
                        {row.ID}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right">
                        {row.audit === 'Research Student' && (
                          <Button onClick={() => roleChangeOne(row.ID)} variant="contained" 
                          color="secondary" sx={{ width:120 }}>Grant Audit</Button>
                        )}
                        {row.audit === 'Temporary Staff' && (
                          <Button onClick={() => roleChangeTwo(row.ID)} variant="contained" 
                          color="error" sx={{ width: 120 }}>Audit Granted</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows
                  }}
                >
                  <TableCell colSpan={5} />
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
