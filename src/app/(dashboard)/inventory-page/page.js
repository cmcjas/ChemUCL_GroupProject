import InventoryPage from 'views/inventory-page';
import { validateAndProcessChemical } from 'services/chemical/chemicalActionHandler';
import { validateAndProcessResearchGroup } from 'services/research-group/researchGroupActionHandler';
import { validateAndProcessLocation } from 'services/location/locationActionHandler';

export default async function InventoryDisplay() {
    const dataChem = await validateAndProcessChemical('find', {});
    const data1 = await validateAndProcessResearchGroup('find', {});
    const data2 = await validateAndProcessLocation('find', {});
    return <InventoryPage c={dataChem.chemicals} r={data1.researchGroups} l={data2.locations} />;
}

// import { useEffect, useState } from 'react';

// // Assuming InventoryPage is your component
// const InventoryDisplay = ({ page, rowsPerPage }) => {
//   const [dataChem, setDataChem] = useState(null);
//   const [data1, setData1] = useState(null);
//   const [data2, setData2] = useState(null);

//   // Fetch dataChem regularly
//   useEffect(() => {
//     const fetchDataChem = async () => {
//       const result = await findChemical({}, page, rowsPerPage);
//       setDataChem(result);
//     };

//     // Fetch immediately and then set an interval for updates
//     fetchDataChem();
//     const intervalId = setInterval(fetchDataChem, 10000); // Update every 10 seconds, adjust as needed

//     // Cleanup on component unmount
//     return () => clearInterval(intervalId);
//   }, [page, rowsPerPage]); // Re-run effect if page or rowsPerPage changes

//   // Fetch data1 and data2 once on component mount
//   useEffect(() => {
//     const fetchData1 = async () => {
//       const result = await findResearchGroup({});
//       setData1(result);
//     };

//     const fetchData2 = async () => {
//       const result = await findLocation({});
//       setData2(result);
//     };

//     fetchData1();
//     fetchData2();
//   }, []); // Empty dependency array means this effect runs once on mount

//   // Render component with the latest data
//   return dataChem ? <InventoryPage c={dataChem} r={data1} l={data2} /> : <div>Loading...</div>;
// };


// export default InventoryDisplay;


