import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Header from "@/app/components/Header";
import { getAdAccounts } from '@/app/api/be_utils';

interface AdAccount {
  ad_account_id: string;
  name?: string;
  access_token: string;
}

export default withPageAuthRequired(async function MyAdAccounts() {
  const session = await getSession();
  const user_id = session?.user?.email;

  // Fetch ad account names from Facebook Graph API
  const adAccountsWithNames = await getAdAccounts(user_id);

  return (
    <div className="min-h-screen">
      <Header user_id={user_id} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Ad Accounts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adAccountsWithNames.map((account: AdAccount) => (
            <div key={account.ad_account_id} className="border rounded-lg p-4 hover:bg-gray-50">
              <h2 className="text-lg font-semibold">{account.name}</h2>
              <p className="text-sm text-gray-500">ID: {account.ad_account_id}</p>
              <a
                href={`https://adsmanager.facebook.com/adsmanager/manage/accounts?act=${account.ad_account_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                View in Ads Manager
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}); 