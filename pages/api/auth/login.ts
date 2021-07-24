import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";

// setting secure cookies (httpOnly: true)
export default (req: NextApiRequest, res: NextApiResponse) => {
    if(req.body.jwtToken !== undefined){
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("jwtToken", req.body.jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 60 * 60 * 6,
                sameSite: "strict",
                path: "/"
            })
        );
    }
    if(req.body.userRole !== undefined){
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("userRole", req.body.userRole, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 60 * 60 * 6,
                sameSite: "strict",
                path: "/"
            })
        );
    }
    if(req.body.userId !== undefined){
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("userId", req.body.userId, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 60 * 60 * 6,
                sameSite: "strict",
                path: "/"
            })
        );
    }
    res.statusCode = 200;
    res.json({success: true });
}