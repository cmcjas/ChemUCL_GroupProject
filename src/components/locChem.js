import { findChemical } from "db/queries/Chemical";
import LocationProfile from "sections/forms/LocationProfile";
import { Button } from '@mui/material';
import EditLocationForm from 'sections/forms/EditLocationForm';
import AddFormModal from 'sections/AddFormModal';
import React, { useState, useEffect } from 'react';
import ScanModal from "sections/ScanModal";
import CamWindow from "sections/forms/CamWindow";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { getSession } from 'next-auth/react';
import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';


async function fetchChemicalData(locationID) {
  // Perform fetch or other async operation here
  return findChemical({ locationID });
}

function LocChem({ locationName, returnData }) {

  const passData = returnData;
  const locationID = returnData.locationID;

  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);
  
  // Define setAuditStatus in a scope accessible to loadData
  const setAuditStatus = async () => {
    const findResult = await validateAndProcessChemical('find', { locationID });
    console.log(findResult);
    if (findResult && findResult.chemicals) {
      for (const chemical of findResult.chemicals) {
        await validateAndProcessChemical('update', { chemicalID: chemical.chemicalID, auditStatus: false });
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      // Ensure audit status is set before fetching chemical data
      await setAuditStatus();
      const chemicalData = await fetchChemicalData(locationID);
      setDataChem(chemicalData);
    }
    loadData();
  }, [locationID]); // Re-fetch when `locationID` changes

  const [displayEdit, setDisplayEdit] = useState(false);
  const [displayCam, setDisplayCam] = useState(false);
  const [dataChem, setDataChem] = useState(null); // Placeholder for chemical data

  const fetchAndSetChemicalData = async () => {
    try {
      const chemicalData = await fetchChemicalData(locationID); // Assuming fetchChemicalData is your query function
      console.log('chemicalData: ', chemicalData);
      setDataChem(chemicalData); // This updates the state with the fetched data
    } catch (error) {
      console.error('Failed to fetch chemical data:', error);
    }
  };


  return (
    <div>
      {/* {['Admin', 'Staff', 'Temporary Staff'].includes(session?.user.role) && ( 
      <Button sx={{marginLeft: 6, marginTop: 2}} size="large" variant="contained" color="secondary" 
        startIcon={<QrCodeScannerIcon />} onClick={() => setDisplayCam(true)}>
            Audit Using Scan
      </Button>)} */}
      <Button sx={{marginLeft: 6, marginTop: 2}} size="large" variant="contained" color="secondary" 
        startIcon={<QrCodeScannerIcon />} onClick={() => setDisplayCam(true)}>
            Audit Using Scan
      </Button>
      
      {dataChem && (
        <LocationProfile c={dataChem} l={locationName} />
      )}

      {/* Conditionally rendered AddFormModal */}
      {displayEdit && (
        <AddFormModal
          childComponent={<EditLocationForm i={passData.locationID} a={passData.building} b={passData.room} c={passData.subLocation1} 
          d={passData.subLocation2} e={passData.subLocation3} f={passData.subLocation4} />}
          maxWidth="500px"
          height="70%"
          title="Edit Location"
          open={displayEdit}
          onClose={() => setDisplayEdit(false)}
        />
      )}

      {/* Conditionally rendered AddFormModal */}
      {displayCam && (<ScanModal
        childComponent={<CamWindow fetchAndSetChemicalData={fetchAndSetChemicalData} locationID={locationID}/>}
        open={displayCam}
        onClose={() => setDisplayCam(false)}
      />
      )}

      {/* Edit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDisplayEdit(true)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

export default LocChem;