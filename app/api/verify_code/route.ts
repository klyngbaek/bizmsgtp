import { type NextRequest, NextResponse } from 'next/server'
import { getTokenForWaba, verifyCode } from "../be_utils"
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export const POST = withApiAuthRequired(async function verifyCodeEndpoint(request: NextRequest) {
    const body = await request.json();
    const { wabaId, phoneId, otpCode } = body;
    const accessToken = await getTokenForWaba(wabaId);
    await verifyCode(phoneId, accessToken, otpCode);
    return new NextResponse('{"register":"ok"}');
});
