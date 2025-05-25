import Image from "next/image";
import publicConfig from "./public_config";
import { getAppDetails } from "./api/be_utils";

export default async function Home() {

  const { app_id } = publicConfig;
  const appDetails = await getAppDetails(app_id);
  const app_name = appDetails.name;
  const logo_url = appDetails.logo_url;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:lg:h-[360px] z-[-1]">
        <div>
          <Image
            className="relative"
            src={logo_url}
            alt="App Logo"
            width={180}
            height={37}
          />
        </div>
        <div>
          {app_name}
        </div>
      </div>

      {/* Login */}
      <div className="mb-32 grid text-center">

        <a
          href="client_dashboard"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          target="_blank"
          rel=""
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Login
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See your debug tools
          </p>
        </a>
      </div>
    </main>
  );
}
