import appleSignin, { AppleIdTokenType } from 'apple-signin-auth';

const clientID = process.env.APPLE_CLIENT_ID;
const teamID = process.env.APPLE_TEAM_ID;
const keyIdentifier = process.env.APPLE_KEY_IDENTIFIER;
const privateKey = process.env.APPLE_PRIVATE_KEY;
const redirectPath = process.env.APPLE_REDIRECT_PATH;
const appEnv = process.env.APP_ENV || 'development';
const prodUrl = process.env.PROD_URL;

function getRedirectUri(): string {
    if (appEnv === 'production') {
        return `${prodUrl}${redirectPath}`;
    }
    // For development, we'll use localhost
    return `http://localhost:3000${redirectPath}`;
}

function getClientSecret(): string {
    if (!clientID || !teamID || !keyIdentifier || !privateKey) {
        throw new Error('Missing Apple client credentials');
    }
    return appleSignin.getClientSecret({
        clientID,
        teamID,
        privateKey,
        keyIdentifier,
        expAfter: 15777000, // 6 months
    });
}

export async function verifyAppleToken(idToken: string): Promise<AppleIdTokenType> {
    try {
        const verifiedToken = await appleSignin.verifyIdToken(idToken, {
            audience: clientID,
            ignoreExpiration: false,
        });

        return verifiedToken;
    } catch (error) {
        console.error('Error verifying Apple token:', error);
        throw error;
    }
}

export async function getAuthorizationToken(code: string) {
    try {
        const clientSecret = getClientSecret();
        const redirectUri = getRedirectUri();

        if (!clientID) {
            throw new Error('Missing Apple client ID');
        }
        const tokenResponse = await appleSignin.getAuthorizationToken(code, {
            clientID,
            clientSecret,
            redirectUri,
        });

        return tokenResponse;
    } catch (error) {
        console.error('Error getting authorization token:', error);
        throw error;
    }
}

export async function refreshAuthorizationToken(refreshToken: string) {
    try {
        const clientSecret = getClientSecret();

        if (!clientID) {
            throw new Error('Missing Apple client ID');
        }

        const tokenResponse = await appleSignin.refreshAuthorizationToken(refreshToken, {
            clientID,
            clientSecret,
        });

        return tokenResponse;
    } catch (error) {
        console.error('Error refreshing authorization token:', error);
        throw error;
    }
}
