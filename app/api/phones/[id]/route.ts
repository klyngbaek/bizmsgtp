import { type NextRequest } from 'next/server'
import { setAckBotStatus } from "../../be_utils"
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function phones(request: NextRequest) {
    const body = await request.json();
    const { isAckBotEnabled, phoneId } = body;
    console.log(isAckBotEnabled, phoneId);
    const resp = await setAckBotStatus(phoneId, isAckBotEnabled);
    console.log('done', resp);
    return new Response(JSON.stringify({ response: 'ok' }));
});
