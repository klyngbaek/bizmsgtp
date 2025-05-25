import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getTokensForUserId, getWholeWaba } from '@/app/api/be_utils';
import Header from "@/app/components/Header";

interface Waba {
  id: string;
  name?: string;
  business_id: string;
  status: string;
}

export default withPageAuthRequired(async function MyWabas() {
  const { user } = await getSession();
  const userId = user ? user.email : '';
  const tokens = await getTokensForUserId(userId);

  const wabas = await Promise.all(tokens.map((row, _key) => {
    const waba_id = row.waba_id;
    const access_token = row.access_token;
    return getWholeWaba(waba_id, access_token);
  }));

  console.log(wabas);

  return (
    <div className="min-h-screen">
      <Header user_id={userId} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My WhatsApp Business Accounts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wabas.map((waba: Waba) => (
            <div key={waba.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <h2 className="text-lg font-semibold">{waba.name || 'Unnamed WABA'}</h2>
              <p className="text-sm text-gray-500">ID: {waba.id}</p>
              <p className="text-sm text-gray-500">Business ID: {waba?.on_behalf_of_business_info?.id}</p>
              <a
                href={`https://business.facebook.com/latest/settings/whatsapp_account?business_id=${waba.on_behalf_of_business_info?.id}&waba_id=${waba.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                View in Business Manager
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
