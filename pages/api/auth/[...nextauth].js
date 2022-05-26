import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import getBackendResponse from '../../../lib/endpoints'
import moment from 'moment';

async function refreshAccessToken(tokenObject) {
    console.log("--- REFRESH ---");
    try {
        // Get a new set of tokens with a refreshToken
        const tokenResponse = await getBackendResponse("token/refresh", "GET", null, tokenObject.refreshToken);
        return {
            ...tokenObject,
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            userId: tokenResponse.user_id
        }
    } catch (error) {
        return {
            ...tokenObject,
            error: "RefreshAccessTokenError",
        }
    }
}

const providers = [
    CredentialsProvider({
        name: 'Credentials',
        authorize: async (credentials) => {
            try {
                // Authenticate user with credentials
                const jsonCredentials = {
                    email: credentials.email,
                    password: credentials.password
                }
                const user = await getBackendResponse("login", "POST", JSON.stringify(jsonCredentials), undefined);
                // console.log("PROVIDERS: \n");
                // console.log(user)
                if (user.response.access_token) {
                    return user.response;
                }
                return null;
            } catch (e) {
                throw new Error(e);
            }
        }
    })
]

const callbacks = {
    jwt: async ({ token, user }) => {
        // console.log("JWT: \n");
        // console.log(user)
        if (user) {
            // This will only be executed at login. Each next invocation will skip this part.
            token.accessToken = user.access_token;
            token.refreshToken = user.refresh_token;
            token.userId = user.user_id;
        }
        // console.log("Token: \n");
        // console.log(token);

        const decoded = jwt.decode(token.accessToken);
        // console.log(decoded);
        // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
        //const shouldRefreshTime = Math.round((Date(decoded["exp"]) - 60 * 60 * 1000) - Date.now());
        const shouldRefresh = moment(decoded["exp"] * 1000).subtract(10, "minutes").isBefore(moment());

        console.log("shouldRefreshToken: " + shouldRefresh);
        // If the token is still valid, just return it.
        if (!shouldRefresh) {
            return Promise.resolve(token);
        }

        // If the call arrives after 23 hours have passed, we allow to refresh the token.
        token = refreshAccessToken(token);
        return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
        // Here we pass accessToken to the client to be used in authentication with your API
        if(token?.accessToken){
            const decodedAccessToken = jwt.decode(token.accessToken);
            const decodedRefreshToken = jwt.decode(token.refreshToken);
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.accessTokenExpiry = decodedAccessToken["exp"];
            session.refreshTokenExpiry = decodedRefreshToken["exp"];
            session.roles = decodedAccessToken["roles"];
            session.error = token.error ? token.error : undefined;
            // TODO : get username e email nel JWT dal backend
            session.user.id = token.userId;
            session.user.name = "Gabriel";
            session.user.email = "admin@admin.com";
        }
        // console.log("SessionSession: \n");
        // console.log(session);
        return Promise.resolve(session);
    },
}

export const options = {
    providers,
    callbacks,
    pages: {},
    secret: `${process.env.JWT_SECRET}`
}

const Auth = (req, res) => NextAuth(req, res, options)
export default Auth;