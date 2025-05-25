import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Header from "@/app/components/Header";
import { getPages } from '@/app/api/be_utils';

interface Page {
  page_id: string;
  name?: string;
  access_token: string;
  ad_campaign?: string;
}

export default withPageAuthRequired(async function MyPages() {
  const session = await getSession();
  const user_id = session?.user?.email;

  // Fetch page names from Facebook Graph API
  const pagesWithNames = await getPages(user_id);

  return (
    <div className="min-h-screen">
      <Header user_id={user_id} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Facebook Pages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagesWithNames.map((page: Page) => (
            <div key={page.page_id} className="border rounded-lg p-4 hover:bg-gray-50">
              <h2 className="text-lg font-semibold">{page.name || 'Unnamed Page'}</h2>
              <p className="text-sm text-gray-500">ID: {page.page_id}</p>
              {page.ad_campaign && (
                <p className="text-sm text-gray-500">Ad Campaign: {page.ad_campaign}</p>
              )}
              <a
                href={`https://www.facebook.com/${page.page_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                View on Facebook
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}); 