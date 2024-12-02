import ManageUserPage from 'views/manage-user-page';
import { validateAndProcessResearchGroup } from 'services/research-group/researchGroupActionHandler';
import { validateAndProcessUser } from 'services/user/userActionHandler';

export default async function ManageUserDisplay() {
    const dataUser = await validateAndProcessUser('find', {});
    const data1 = await validateAndProcessResearchGroup('find', {});
    return <ManageUserPage u={dataUser.users} r={data1.researchGroups} />;
}
