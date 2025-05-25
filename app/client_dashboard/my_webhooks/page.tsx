import LiveWebhooks from "@/app/components/LiveWebhooks";
import Header from "@/app/components/Header";
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function Home({ }) {
  const { user } = await getSession();
  const userId = user ? user.email : '';

  return (
    <>
      <Header user_id={userId} />
      <main className="flex min-h-screen flex-col items-center justify-between p-6">
        <div>
          Listening for webhook events...
          <LiveWebhooks />
        </div>
      </main >
    </>
  );
});
