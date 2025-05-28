import ClientDashboard from "@/app/components/ClientDashboard";
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Header from "@/app/components/Header";
import publicConfig from "@/app/public_config";
import { getAppDetails } from "@/app/api/be_utils";

const { app_id, business_id, tp_configs, public_es_feature_options, public_es_versions, public_es_feature_types } = publicConfig;

export default withPageAuthRequired(async function ClientDashBoardWrapper() {

  const { user } = await getSession();
  const userId = user ? user.email : '';

  const appDetails = await getAppDetails(app_id);
  const app_name = appDetails.name;

  return (
    <div className="min-h-screen">
      <Header user_id={userId} />
      <div className="before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-['']  before:lg:h-[360px] z-[-1]">
      </div>
      <div className="flex flex-col items-center justify-between">
        <ClientDashboard app_id={app_id} app_name={app_name} bm_id={business_id} is_loc_enabled={false} user_id={userId} tp_configs={tp_configs} public_es_feature_options={public_es_feature_options} public_es_versions={public_es_versions} public_es_feature_types={public_es_feature_types} />
      </div>
    </div >
  );
},
  { returnTo: '/client_dashboard' }
);