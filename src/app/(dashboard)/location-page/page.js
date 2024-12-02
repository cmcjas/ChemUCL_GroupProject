import LocationPage from "views/location-page";
import { validateAndProcessLocation } from 'services/location/locationActionHandler';

export default async function LocationDisplay() {
    const dataLoc = await validateAndProcessLocation('find', {});
    return <LocationPage l={dataLoc.locations} />;
}

