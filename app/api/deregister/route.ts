import { type NextRequest } from 'next/server'
import { deregisterNumber, getTokenForWaba } from "../be_utils"
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async function phones(request: NextRequest) {
    const body = await request.json();
    const { wabaId, phoneId } = body;
    const acesssToken = await getTokenForWaba(wabaId);
    await deregisterNumber(phoneId, acesssToken); // TODO: need error handling
    return new Response(JSON.stringify({ response: 'ok' }));
});
