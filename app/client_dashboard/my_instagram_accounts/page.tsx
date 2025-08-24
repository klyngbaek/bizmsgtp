import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Header from "@/app/components/Header";
import { getInstagramAccounts } from '@/app/api/be_utils';

interface InstagramAccount {
    id: string;
    username?: string;
    name?: string;
    followers_count?: number;
    media_count?: number;
    account_type?: string;
    status?: string;
    connected_page_id?: string;
}

export default withPageAuthRequired(async function MyInstagramAccounts() {
    const session = await getSession();
    const user_id = session?.user?.email;

    // Fetch Instagram accounts from the API
    const instagramAccounts = await getInstagramAccounts(user_id);

    return (
        <div className="min-h-screen">
            <Header user_id={user_id} />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">My Instagram Accounts</h1>
                {instagramAccounts.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No Instagram accounts found. Instagram accounts will appear here once they are connected to your account.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {instagramAccounts.map((account: InstagramAccount) => (
                            <div key={account.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold mb-2">@{account.username || 'Unnamed Account'}</h2>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">Username: @{account.username}</p>
                                            <p className="text-sm text-gray-600">ID: {account.id}</p>
                                        </div>
                                    </div>
                                    <div className="ml-4 space-y-2">
                                        <a
                                            href={`https://www.instagram.com/${account.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                                        >
                                            View on Instagram
                                        </a>
                                        <br />
                                        <a
                                            href={`https://business.facebook.com/latest/overview?asset_id=${account.id}&asset_type=INSTAGRAM_ACCOUNT`}
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
                )}
            </div>
        </div>
    );
});
