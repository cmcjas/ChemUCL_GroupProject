'use client';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import InventoryDisplay from 'app/(dashboard)/inventory-page/page';
import { findChemical } from 'db/queries/Chemical';
import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';


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
import { deleteChemical } from 'db/queries/Chemical';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GeneralModal from 'components/general-modal/GeneralModal';
import ChemInfoChild from 'components/general-modal/modal-content/ChemInfoChild';
import { da } from 'date-fns/locale';
import { find } from 'lodash';


// table data
function createData(id, qrID, name, supplier, amount, location, type, owner, added, updated) {
  return {
    id,
    qrID,
    name,
    supplier,
    amount,
    location,
    type,
    owner,
    added,
    updated,
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
let headCells = [
  {id: 'qrID',
    numeric: false,
    disablePadding: true,
    label: 'QR ID'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Item Name'
  },
  {
    id: 'supplier',
    numeric: true,
    disablePadding: false,
    label: 'Supplier'
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Amount (units)'
  },
  {
    id: 'location',
    numeric: true,
    disablePadding: false,
    label: 'Location'
  },
  {
    id: 'type',
    numeric: true,
    disablePadding: false,
    label: 'Type'
  },
  {
    id: 'owner',
    numeric: true,
    disablePadding: false,
    label: 'Owner'
  },
  {
    id: 'added',
    numeric: true,
    disablePadding: false,
    label: 'Added'
  },
  {
    id: 'updated',
    numeric: true,
    disablePadding: false,
    label: 'Updated'
  }
];

// Function to update headCells based on passState
export function HandleSelectColumns(props) {
  // Clear the existing headCells array
  headCells = [  
    {
      id: 'qrID',
      numeric: true,
      disablePadding: false,
      label: 'QR ID'
    },
    {
      id: 'name',
      numeric: true,
      disablePadding: false,
      label: 'Item Name'
    }
];

  const passState = props.p;

  // Iterate over each key in passState
  Object.keys(passState).forEach((key) => {
    if (passState[key] === true) { // Check if the value for the key is true
      // Construct the object based on the key and update headCells
      const cell = {
        id: key, 
        numeric:  true, 
        disablePadding: false,
        label: capitalizeFirstLetter(key) 
      };
      headCells.push(cell);
    }
  });
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        All Chemicals
      </Typography>
    )}
    <Box sx={{ flexGrow: 1 }} />
    {numSelected > 0 && (
      <Tooltip title="Delete Item">
        <IconButton size="large">
          <DeleteIcon onClick={() => passID.forEach(deleteChem)}/>
        </IconButton>
      </Tooltip>
    )}
  </Toolbar>
  )
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const deleteChem = (id) => {
  const deleteChem = validateAndProcessChemical('delete', {chemicalID: id}, '/inventory-page');
}


// ==============================|| TABLE - DATA TABLE ||============================== //

function EnhancedTable(props) {

  createData = (data) => {
    return data;
  };

  // Helper function to map item properties to headCell ids
  const mapItemToHeadCells = (item, headCells) => {
    const data = { 'id': item.chemicalID, 'qrID': item.qrID,  'name': item.chemicalName};
    const locationName = item.location.building + ' ' + item.location.room + ' ' + item.location.subLocation1 + ' ' + item.location.subLocation2 + ' ' + item.location.subLocation3 + ' ' + item.location.subLocation4;
    headCells.forEach(cell => {
      switch (cell.id) {
        case 'supplier':
          data.supplier = item.supplier;
          break;
        case 'amount':
          data.amount = item.quantity;
        case 'type':
          data.type = item.chemicalType; // Assuming 'type' maps to 'chemicalType'
          break;
        case 'location':
          data.location = locationName; // Assuming 'location' maps to 'locationName'
          break;
        case 'owner':
          data.owner = item.researchGroup?.groupName ?? 'None'; // Assuming 'owner' maps to 'researchGroup.groupName'
          break;
        case 'added':
          data.added = new Date(item.dateAdded).toISOString().split('T')[0]; // Assuming 'added' maps to 'dateAdded'
          break;
        case 'updated':
          data.updated = new Date(item.dateUpdated).toISOString().split('T')[0]; // Assuming 'updated' maps to 'dateUpdated'
          break;
        default:
          console.warn(`Unhandled cell id: ${cell.id}`);
      }
    });
    return data;
  };

  // Dynamically create rows based on headCells configuration
  const rows = [
    ...props.s.map((item) => {
      const itemData = mapItemToHeadCells(item, headCells);
      // console.log(itemData); // Log the output of mapItemToHeadCells for each item
      return createData(itemData);
    })
  ];

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('updated');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedValue, setSelectedValue] = useState([]);
  const [chemicalData, setChemicalData] = useState(null);

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
        const newSelectedId = rows.map((n) => n.name);
        const passSelectedId = rows.map((n) => n.id);
        setSelected(newSelectedId);
        setSelectedId(passSelectedId);
      }
      return;
    }
    setSelected([]);
  };


  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];


    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    const selectedRowData = rows.filter((row) => newSelected.includes(row.name.toString()));

    setSelectedValue(selectedRowData);
    setSelected(newSelected);

    // Assuming each row data has an 'id' field
    if(selectedRowData.length > 0) {
      const ids = selectedRowData.map(row => row.id); // Collect all IDs
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const [modelOpen, setModelOPen] = useState(false);

  const chemInfo = async (chemicalID) => {
      const chemicalResult = await validateAndProcessChemical('find', {chemicalID: chemicalID});
      setChemicalData(chemicalResult.chemicals);
      if (chemicalResult && chemicalResult.chemicals) {
        setModelOPen(true);
      }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  useEffect(() => {
    // Perform side effects here
    // This will run when `page` or `rowsPerPage` changes.
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    await InventoryDisplay({ page, rowsPerPage });
    await findChemical({}, page, rowsPerPage);
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
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
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
                        {row.qrID}
                      </TableCell>

                       
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <p style={{cursor: 'pointer'}} onClick={() => {chemInfo(row.id); }}>{row.name}</p>
                      </TableCell>
                    
                      {headCells.map((headCell) => {
                        // Skip rendering the TableCell if id is 'name'
                        if (headCell.id === 'name') {
                          return null; // Return null to skip this iteration
                        }
                        if (headCell.id === 'qrID') {
                          return null;
                        }
                        // Check if the headCell's id exists in the row, if so, render the TableCell
                        if (row.hasOwnProperty(headCell.id)) {
                          return (
                            <TableCell align="right">
                              {row[headCell.id]}
                            </TableCell>
                          );
                        }
                        // If the id doesn't exist in the row, you could return null or handle it differently
                        return null;
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows
                  }}
                >
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <GeneralModal
          maxWidth="1000px"
          open={modelOpen} 
          onClose={() => {setModelOPen(false)}}
          childComponent={<ChemInfoChild data={chemicalData} />}
          title="Chemical Information"
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
  )
}

export default EnhancedTable;