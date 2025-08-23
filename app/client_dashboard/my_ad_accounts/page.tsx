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
        <div className="space-y-4">
          {adAccountsWithNames.map((account: AdAccount) => (
            <div key={account.ad_account_id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{account.name || 'Unnamed Account'}</h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">ID: {account.ad_account_id}</p>
                  </div>
                </div>
                <div className="ml-4">
                  <a
                    href={`https://adsmanager.facebook.com/adsmanager/manage/accounts?act=${account.ad_account_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View in Ads Manager
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}); 