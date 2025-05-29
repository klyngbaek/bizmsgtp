"use server";

const privateConfig =
{
    "fb_app_secret": process.env.FB_APP_SECRET,
    "fb_reg_pin": process.env.FB_REG_PIN,
    "fb_verify_token": process.env.FB_VERIFY_TOKEN
}

export default async function getPrivateConfig() {
    return privateConfig;
};