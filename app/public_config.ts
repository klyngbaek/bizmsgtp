const publicConfig =
{
    "app_id": process.env.FB_APP_ID,
    "redirect_uri": "",
    "contact_email": process.env.CONTACT_EMAIL,
    "config_id": process.env.FB_TP_CONFIG_ID,
    "business_id": process.env.FB_BUSINESS_ID,
    "graph_api_version": process.env.FB_GRAPH_API_VERSION,
    "tp_configs": (process.env.FB_TP_CONFIG_IDS ?? '').split(','),
    "public_es_feature_options": {
        "v2": [],
        "v3-alpha-1": [
            "marketing_messages_lite",
            "cloud_api",
            "conversions_api",
            "mm_mapi",
            "ctwa",
            "api_access_only"
        ],
        "v3": [
            "marketing_messages_lite",
            "api_access_only",
        ],
    },
    "public_es_versions": [
        "v2",
        "v3-alpha-1",
        "v3",
    ],
    "public_es_feature_types": {
        "v2": [
            "whatsapp_business_app_onboarding",
            "only_waba_sharing"
        ],
        "v3-alpha-1": [
            "whatsapp_business_app_onboarding",
        ],
        "v3": [
            "whatsapp_business_app_onboarding",
            "api_access_only"
        ],
    },
};

export default publicConfig;