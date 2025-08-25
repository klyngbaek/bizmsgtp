import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getTokensForUserId, getWholeWaba } from '@/app/api/be_utils';
import Header from "@/app/components/Header";

interface Waba {
  id: string;
  name?: string;
  business_id: string;
  status: string;
  on_behalf_of_business_info?: {
    id: string;
  };
  access_token?: string;
}

export default withPageAuthRequired(async function MyWabas() {
  const { user } = await getSession();
  const userId = user ? user.email : '';
  const tokens = await getTokensForUserId(userId);

  const wabas = await Promise.all(tokens.map(async (row, _key) => {
    const waba_id = row.waba_id;
    const access_token = row.access_token;
    const wabaData = await getWholeWaba(waba_id, access_token);
    return {
      ...wabaData,
      access_token: access_token
    };
  }));

  console.log(wabas);

  return (
    <div className="min-h-screen">
      <Header user_id={userId} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My WhatsApp Business Accounts</h1>
        <div className="space-y-4">
          {wabas.map((waba: Waba) => (
            <div key={waba.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{waba.name || 'Unnamed WABA'}</h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">ID: {waba.id}</p>
                    <p className="text-sm text-gray-600">Business ID: {waba?.on_behalf_of_business_info?.id}</p>
                    <p className="text-sm text-gray-600">Access Token: <a href={`https://developers.facebook.com/tools/debug/accesstoken/?access_token=${waba.access_token}&version=v23.0`} target="_blank" rel="noopener noreferrer"><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{waba.access_token ? `${waba.access_token.substring(0, 20)}...` : 'No token'}</span></a></p>
                  </div>
                </div>
                <div className="ml-4">
                  <a
                    href={`https://business.facebook.com/latest/settings/whatsapp_account?business_id=${waba.on_behalf_of_business_info?.id}&waba_id=${waba.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View in Business Manager
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
