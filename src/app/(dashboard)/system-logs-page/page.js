import SystemLogPage from 'views/system-logs-page';
import { validateAndProcessLog } from 'services/log/logActionHandler';
import { validateAndProcessUser } from 'services/user/userActionHandler';
import { validateAndProcessLocation } from 'services/location/locationActionHandler';

export default async function SystemLogDisplay() {
    const dataLog = await validateAndProcessLog('find', {});
    const dataUser = await validateAndProcessUser('find', {});
    const dataLoc = await validateAndProcessLocation('find', {});
    console.log(dataLog);
    return <SystemLogPage s={dataLog} l={dataLoc} u={dataUser} />;
}
