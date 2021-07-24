import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader(
        "Set-Cookie",
        [cookie.serialize("jwtToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: new Date(0).getMilliseconds(),
            sameSite: "strict",
            path: "/"
        }),
        cookie.serialize("userRole", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: new Date(0).getMilliseconds(),
            sameSite: "strict",
            path: "/"
        }),
        cookie.serialize("userId", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: new Date(0).getMilliseconds(),
            sameSite: "strict",
            path: "/"
        })
        ]
    );
    
    res.statusCode = 200;
    res.json({success: true });
}