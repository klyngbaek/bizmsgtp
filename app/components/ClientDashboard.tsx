'use client';

import { useState, useEffect } from 'react';
import { formatErrors } from '@/app/errorformat';
import TpButton from '@/app/components/Button';
import BspBanner from '@/app/components/BspBanner';
import { feGraphApiPostWrapper } from '@/app/fe_utils';

let waba_id_outer = null;
let phone_number_id_outer = null;
let waba_ids_outer = null;
let business_id_outer = null;
let ad_account_ids_outer = null;
let page_ids_outer = null;
let code_outer = null;

export default function ClientDashboard({ app_id, app_name, bm_id, is_loc_enabled, user_id, tp_configs, public_es_feature_options, public_es_versions, public_es_feature_types }) {


    // es options
    const [esOptionFeatureType, setEsOptionFeatureType] = useState("");
    const [esOptionFeatures, setEsOptionFeatures] = useState([]);
    const [esOptionConfig, setEsOptionConfig] = useState(tp_configs[0]);
    const [esOptionVersion, setEsOptionVersion] = useState(public_es_versions[0]);

    // server options
    const [es_option_reg, setEs_option_reg] = useState(true);
    const [es_option_loc, setEs_option_loc] = useState(false);
    const [es_option_sub, setEs_option_sub] = useState(true);

    const computeEsConfig = (esOptionFeatureType, esOptionConfig, esOptionFeatures, esOptionVersion) => {
        const esConfig = {
            config_id: esOptionConfig, // configuration ID goes here
            // auth_type: 'reauthenticate',
            response_type: 'code', // must be set to 'code' for System User access token
            override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types
            extras: {
                sessionInfoVersion: '3',
                version: esOptionVersion,
                featureType: esOptionFeatureType,
                features: esOptionFeatures ? esOptionFeatures.map((feature) => { return { name: feature } }) : null,
            }
        }
        if (esOptionFeatureType === '') {
            delete esConfig.extras.featureType;
        }
        return esConfig;
    }

    const [esConfig, setEsConfig] = useState(JSON.stringify(computeEsConfig(esOptionFeatureType, esOptionConfig, esOptionFeatures, esOptionVersion), null, 4));
    const [bannerInfo, setBannerInfo] = useState("");
    const [lastEventData, setLastEventData] = useState(null);

    // ES Options Setters
    const setEsOptionFeatureTypeSetter = (esOptionFeatureType) => {
        if (esOptionFeatureType === 'only_waba_sharing') setEs_option_reg(false);
        setEsOptionFeatureType(esOptionFeatureType);
        setEsConfig(JSON.stringify(computeEsConfig(esOptionFeatureType, esOptionConfig, esOptionFeatures, esOptionVersion), null, 4));
    }

    const setEsOptionConfigSetter = (esOptionConfig) => {
        setEsOptionConfig(esOptionConfig);
        setEsConfig(JSON.stringify(computeEsConfig(esOptionFeatureType, esOptionConfig, esOptionFeatures, esOptionVersion), null, 4));
    }

    const setEs_option_regSetter = (es_option_regInner) => {
        if (es_option_regInner && esOptionFeatureType === 'only_waba_sharing') setEsOptionFeatureTypeSetter("");
        setEs_option_reg(es_option_regInner);
    }

    const setEs_option_locSetter = (es_option_locInner) => {
        setEs_option_loc(es_option_locInner);
    }

    const setEsOptionVersionSetter = (esOptionVersion) => {
        setEsOptionVersion(esOptionVersion);
        setEsConfig(JSON.stringify(computeEsConfig(esOptionFeatureType, esOptionConfig, esOptionFeatures, esOptionVersion), null, 4));
    }

    // The code is a temporary code that is used to exchange for an access token.
    // The code

    // The returned code must be transmitted to your backend first and then
    // perform a server-to-server call from there to our servers for an access token.

    const saveToken = (waba_id: string, code: string, phone_number_id: string, waba_ids: [string], business_id: string, ad_account_ids: [string], page_ids: [string]) => {
        setBannerInfo('Setting up WABA...');
        return feGraphApiPostWrapper('/api/token', { code, app_id, waba_id, waba_ids, business_id, ad_account_ids, page_ids, phone_number_id, es_option_loc, es_option_reg, es_option_sub, user_id })
            .then(d => {
                const resp_msg = formatErrors(d);
                setBannerInfo("WABA Setup Finished\n" + resp_msg + '\n')
            });
    }

    // this get's called when embedded signup finishes
    const fbLoginCallback = (response) => {
        if (response.authResponse) {
            const code = response.authResponse.code;
            code_outer = code;
            if (waba_id_outer && code_outer) saveToken(waba_id_outer, code_outer, phone_number_id_outer, waba_ids_outer, business_id_outer, ad_account_ids_outer, page_ids_outer);
        }
    }

    const launchWhatsAppSignup = (esConfig) => {
        return () => {
            // Log the action

            // this is async, and might need better error handling
            fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id,
                    action: 'launch_fbl4b'
                }),
            });

            const esConfigJson = JSON.parse(esConfig);
            // Launch Facebook login
            setBannerInfo("ES Started...");
            FB.login(fbLoginCallback, esConfigJson);
        }
    }


    useEffect(() => {

        window.fbAsyncInit = function () {
            FB.init({
                appId: app_id,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v24.0'
            });
        };

        const cb = (event) => {
            if (event.origin !== "https://www.facebook.com") return;
            try {
                const data = JSON.parse(event.data);
                setLastEventData(data);
                console.log("=== ES DATA ===");
                console.log(data);
                if (data.type === 'WA_EMBEDDED_SIGNUP') {
                    const { phone_number_id, waba_id, waba_ids, business_id, ad_account_ids, page_id, page_ids } = data.data;

                    // Exited ES early
                    if (data.data.current_step) {
                        setBannerInfo('ES Exited Early\n' + JSON.stringify(data.data, null, 2));
                        console.log('=== Exited Early ===');
                        console.log(data.data);
                    }
                    // ES User Clicked Finish Button
                    else {
                        waba_id_outer = waba_id;
                        phone_number_id_outer = phone_number_id;
                        waba_ids_outer = waba_ids || [waba_id];
                        business_id_outer = business_id || [];
                        ad_account_ids_outer = ad_account_ids || [];
                        page_ids_outer = page_ids ? page_ids : (page_id ? [page_id] : []);
                        console.log(data.data);
                        console.log('=== message session version ===\n', 'code_outer: ', code_outer, '\nwaba_id_outer:', waba_id_outer, '\nphone_number_id_outer:', phone_number_id_outer);
                        if (waba_id_outer && code_outer) saveToken(waba_id_outer, code_outer, phone_number_id_outer, waba_ids_outer, business_id_outer, ad_account_ids_outer, page_ids_outer);
                    }

                }
            } catch (err) {
                // this is expected to happen but not much we can do about it since FBL4B can return other things
                console.log('=== catch triggered ===')
                console.log(event);
                console.log(err);
            }
        }

        window.addEventListener('message', cb);

        return () => {
            window.removeEventListener('message', cb);
        };

    }, [app_id,])

    const bannerChild = (<pre>{bannerInfo + '\n' + '\n' + JSON.stringify(lastEventData, null, 2)}</pre>);

    const handleOptionChange = (event) => {
        const optionValue = [...event.target.selectedOptions];
        const newESOptionFeatures = optionValue.map((value) => value.value);
        setEsOptionFeatures(newESOptionFeatures);
        setEsConfig(JSON.stringify(computeEsConfig(esOptionFeatureType, esOptionConfig, newESOptionFeatures, esOptionVersion), null, 4));
    };

    const loggedInSection = (

        <>
            <div className="flex flex-row grow rounded-lg m-2 px-5 py-4 border-gray-300">

                <div className="mr-5 mb-0 rounded-lg border border-transparent px-5 py-4 border-gray-300 bg-gray-100 text-xs">
                    <TpButton href={`client_dashboard/my_webhooks`} title="My Webhooks" subtitle={"Debug tool showing all your incoming webhooks"} />
                    <TpButton href={`client_dashboard/my_wabas`} title="My WABAs" subtitle={"View all your WABAs"} />
                    <TpButton href={`client_dashboard/my_pages`} title="My Pages" subtitle={"View all your Facebook Pages"} />
                    <TpButton href={`client_dashboard/my_ad_accounts`} title="My Ad Accounts" subtitle={"View all your Facebook Ad Accounts"} />
                    <TpButton href={`client_dashboard/my_inbox`} title="My Inbox" subtitle={"Send and receive messages across all your phone numbers"} />
                </div>

                <div className="mr-5 mb-0 rounded-lg border border-transparent px-5 py-4 border-gray-300 bg-gray-100 text-xs">
                    <div>
                        <h1>App ID: <a target="_blank" href={`https://developers.facebook.com/apps/${app_id}`}>{app_id}</a></h1>
                        <h1>BM ID: <a target="_blank" href={`https://business.facebook.com/latest/settings/whatsapp_account?business_id=${bm_id}`}>{bm_id}</a></h1>
                    </div>
                    <br />
                    {is_loc_enabled ? <div className="align-middle"><label>Share LoC <input type="checkbox" checked={es_option_loc} onChange={(e) => setEs_option_locSetter(e.target.checked)}></input></label></div> : null}

                    <b>Server Options</b>
                    <div className="align-middle"><label>Register Number <input type="checkbox" checked={es_option_reg} onChange={(e) => setEs_option_regSetter(e.target.checked)}></input></label></div>
                    <div className="align-middle"><label>Subscribe Webhooks <input type="checkbox" checked={es_option_sub} onChange={(e) => setEs_option_sub(e.target.checked)}></input></label></div>

                    <br />

                    <div><b>ES Options</b></div>
                    <div>[OPTIONS]</div>
                    <div className="align-middle">
                        <label>ES Version =
                            <select value={esOptionVersion} onChange={(e) => { console.log(e.target.value); setEsOptionVersionSetter(e.target.value) }}>
                                {public_es_versions.map((version) => (
                                    <option key={version} value={version}>{version}</option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <label>ES FeatureType =
                            <select value={esOptionFeatureType} onChange={(e) => { console.log(e.target.value); setEsOptionFeatureTypeSetter(e.target.value) }}>
                                {
                                    public_es_feature_types[esOptionVersion].map((featureType) => (
                                        <option key={featureType} value={featureType}>{featureType}</option>
                                    ))
                                }
                                <option value="">none</option>
                            </select>
                        </label>
                    </div>
                    <div className="align-middle">
                        <label>ES Features =
                            <select multiple={true} value={esOptionFeatures} onChange={handleOptionChange}>
                                {
                                    public_es_feature_options[esOptionVersion].map((feature) => (
                                        <option key={feature} value={feature}>{feature}</option>
                                    ))
                                }
                            </select>
                        </label>
                    </div>
                    <div className="align-middle">
                        <label>TP Config =
                            <select onChange={(e) => { console.log(e.target.value); setEsOptionConfigSetter(e.target.value) }}>
                                {
                                    tp_configs.map((config) => (
                                        <option key={config} value={config}>{config}</option>
                                    ))
                                }
                            </select>
                        </label>
                    </div>
                    <br />
                    <div>[RESULTING JSON]</div>
                    <textarea cols={30} rows={20} value={esConfig} onChange={(e) => { setEsConfig(e.target.value) }} />
                </div>
                <div className="mr-5 mb-0 rounded-lg border border-transparent px-5 py-4 border-gray-300 bg-gray-100 text-xs">
                    <TpButton onClick={launchWhatsAppSignup(esConfig)} title="Launch FBL4B" subtitle={`Share your Meta assets with ${app_name}`} />
                </div>
            </div>

            BSPBanner
            <BspBanner>
                {bannerChild}
            </BspBanner >

        </>
    );
    return loggedInSection;
}
