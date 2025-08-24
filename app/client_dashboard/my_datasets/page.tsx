import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Header from "@/app/components/Header";
import { getDatasets } from '@/app/api/be_utils';

interface Pixel {
    id: string;
    name?: string;
    code?: string;
    status?: string;
    last_fired_time?: string;
}

export default withPageAuthRequired(async function MyPixels() {
    const session = await getSession();
    const user_id = session?.user?.email;

    // Fetch pixels from the API
    const pixels = await getDatasets(user_id);

    return (
        <div className="min-h-screen">
            <Header user_id={user_id} />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">My Facebook Pixels</h1>
                {pixels.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No pixels found. Pixels will appear here once they are connected to your account.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pixels.map((pixel: Pixel) => (
                            <div key={pixel.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold mb-2">{pixel.name || 'Unnamed Pixel'}</h2>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">ID: {pixel.id}</p>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <a
                                            href={`https://business.facebook.com/events_manager2/pixel/${pixel.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            View in Events Manager
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
