export const dynamic = 'force-dynamic'; // static by default, unless reading the request
import { type NextRequest, NextResponse } from 'next/server'
import Ably from 'ably';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

async function createTokenRequest(clientId: string) {
    const ably_key = process.env.ABLY_KEY;
    const ably = new Ably.Realtime(ably_key);
    const r = await ably.auth.createTokenRequest({
        ttl: 5000,
        clientId: clientId
    }, {
        key: ably_key
    });
    ably.close();
    return r;
}

// export async function GET(request: NextRequest) {
export const GET = withApiAuthRequired(async function myApiRoute(request: NextRequest) {
    const res = new NextResponse();
    const { user } = await getSession(request, res);
    // console.log("this is the user', user", user.email);
    const clientId = user.email;
    // console.log('****** TOKEN REQUEST');
    const tokenRequest_outer = await createTokenRequest(clientId);
    // console.log(tokenRequest_outer);
    const response = new NextResponse(JSON.stringify(tokenRequest_outer), { status: 200 });
    return response;
})
