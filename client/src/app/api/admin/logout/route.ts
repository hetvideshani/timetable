// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure: true,
        maxAge: -1, 
        path: '/',
        sameSite: 'strict',
    }));

    return NextResponse.json({
        status: 200,
        DATA: {
            message: 'User logged out successfully',
        },
        FUNCTIONNAME: 'logout',
    })    
}
