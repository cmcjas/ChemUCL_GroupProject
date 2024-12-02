import Sample from 'views/sample-page';
import { validateAndProcessUser } from 'services/user/userActionHandler';
// ==============================|| PAGE ||============================== //

export default async function SamplePage() {
  const user = await validateAndProcessUser('find', {userId: 2});
  return <Sample user={user} />;
}
