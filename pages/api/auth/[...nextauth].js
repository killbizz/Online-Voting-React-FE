import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import getBackendResponse from '../../../lib/endpoints'
import moment from 'moment';

async function refreshAccessToken(tokenObject) {
    console.log("--- REFRESH-TOKEN ---");
    try {
        // Get a new set of tokens with a refreshToken
        const tokenResponse = await getBackendResponse("token/refresh", "GET", null, tokenObject.refreshToken);
        return {
            ...tokenObject,
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            userId: tokenResponse.user_id,
            userName: tokenResponse.user_name
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
        if (user) {
            // This will only be executed at login. Each next invocation will skip this part.
            token.accessToken = user.access_token;
            token.refreshToken = user.refresh_token;
            token.userId = user.user_id;
            token.userName = user.user_name;
        }
        const decoded = jwt.decode(token.accessToken);

        // I have to refresh the token 5 minutes before accessTokenExpireDate
        const shouldRefresh = moment(decoded["exp"] * 1000).subtract(5, "minutes").isBefore(moment());

        // If the token is still valid, just return it.
        if (!shouldRefresh) {
            return Promise.resolve(token);
        }

        token = refreshAccessToken(token);
        return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
        // Here we pass accessToken to the client to be used in authentication with your API
        if(token?.accessToken){
            const decodedAccessToken = jwt.decode(token.accessToken);
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.roles = decodedAccessToken["roles"];
            session.error = token.error ? token.error : undefined;
            session.user.id = token.userId;
            session.user.name = token.userName;
        }
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