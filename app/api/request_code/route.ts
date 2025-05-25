import { type NextRequest } from 'next/server'
import { getTokenForWaba, requestCode } from "../be_utils"
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function requestCodeEndpoint(request: NextRequest) {
    const body = await request.json();
    const waba_id = body.waba_id;
    const accessToken = await getTokenForWaba(waba_id);
    const phoneNumberId = body.phone_number_id;
    await requestCode(phoneNumberId, accessToken);
    return new Response('{"register":"ok"}');
});