
import React, { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { HandleSelectColumns } from 'views/table/intTable';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


const ColumnHeaderToggle = () => {
  // State to keep track of checked items
  const [checkedState, setCheckedState] = useState({
    supplier: true,
    amount: true,
    location: true,
    type: true,
    owner: true,
    added: true,
    updated: true,
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked,
    });
  };


  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Select Columns to Display
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox name="supplier" checked={checkedState.supplier} onChange={handleCheckboxChange} />}
          label="Supplier"
        />
        <FormControlLabel
          control={<Checkbox name="amount" checked={checkedState.amount} onChange={handleCheckboxChange} />}
          label="Amount"
        />
        <FormControlLabel
          control={<Checkbox name="location" checked={checkedState.location} onChange={handleCheckboxChange} />}
          label="Location"
        />
        <FormControlLabel
          control={<Checkbox name="type" checked={checkedState.type} onChange={handleCheckboxChange} />}
          label="Type"
        />
        <FormControlLabel
          control={<Checkbox name="owner" checked={checkedState.owner} onChange={handleCheckboxChange} />}
          label="Owner"
        />
        <FormControlLabel
          control={<Checkbox name="added" checked={checkedState.added} onChange={handleCheckboxChange} />}
          label="Added"
        />
        <FormControlLabel
          control={<Checkbox name="updated" checked={checkedState.updated} onChange={handleCheckboxChange} />}
          label="Updated"
        />
      </FormGroup>

      <HandleSelectColumns p={checkedState} />
    </div>
  );
};

export default ColumnHeaderToggle;