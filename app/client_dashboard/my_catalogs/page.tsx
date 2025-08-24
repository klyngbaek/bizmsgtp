import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Header from "@/app/components/Header";
import { getCatalogs } from '@/app/api/be_utils';

interface Catalog {
    id: string;
    name?: string;
    vertical?: string;
    item_count?: number;
    last_updated?: string;
    status?: string;
}

export default withPageAuthRequired(async function MyCatalogs() {
    const session = await getSession();
    const user_id = session?.user?.email;

    // Fetch catalogs from the API
    const catalogs = await getCatalogs(user_id);

    return (
        <div className="min-h-screen">
            <Header user_id={user_id} />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">My Facebook Catalogs</h1>
                {catalogs.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No catalogs found. Catalogs will appear here once they are connected to your account.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {catalogs.map((catalog: Catalog) => (
                            <div key={catalog.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold mb-2">{catalog.name || 'Unnamed Catalog'}</h2>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">ID: {catalog.id}</p>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <a
                                            href={`https://business.facebook.com/adsmanager/manage/catalogs?act=${catalog.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            View in Catalog Manager
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});
