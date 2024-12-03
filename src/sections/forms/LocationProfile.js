import { Autocomplete, Grid, } from '@mui/material';

import EnhancedTable from 'views/table/intLocTable';


const LocationProfile = (props) => {

  const dataChem = props.c;
  const locationName = props.l;

  return (
    <div>
    <Grid container spacing={3} sx={{ height: "80vh"}}> 
      <Grid item xs={12} > 
        <EnhancedTable s={dataChem} l={locationName} />
      </Grid>
    </Grid>
    </div>
  );
};
export default LocationProfile;
