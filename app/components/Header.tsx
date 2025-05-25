import Image from "next/image";
import TpButtonInner from "@/app/components/Button";
import publicConfig from "@/app/public_config";
import { getAppDetails } from "@/app/api/be_utils";

export default async function Header({ user_id }) {

    const appId = publicConfig.app_id;
    const appDetails = await getAppDetails(appId);
    const app_name = appDetails.name;
    const logo_url = appDetails.logo_url;

    return (
        <>
            <div className="border-solid border-black border-0 m-2 rounded-md flex justify-between">
                <div>
                    <a href='/client_dashboard' className="cursor-pointer">
                        <Image
                            className="relative"
                            src={logo_url}
                            alt={app_name}
                            width={30}
                            height={30}
                            priority
                        />
                    </a>
                </div>
                <div className="flex items-center">
                    <div className="mr-4">
                        <a href="/privacy">Privacy Policy</a>
                    </div>
                    <div className="rounded-lg px-4 py-1 mr-4 bg-gray-200">
                        {user_id}
                    </div>
                    <TpButtonInner title="Logout" href="/api/auth/logout" />
                </div>
            </div>
        </>
    );
}
