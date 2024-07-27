import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import BeastModel from '../models/beast';
import { getAuthorizationToken, verifyAppleToken } from '../services/appleAuth';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default class AuthController {
    static async appleSignIn(req: Request, res: Response) {
        try {
            const { identityToken, code } = req.body;

            let appleUser;
            if (identityToken) {
                appleUser = await verifyAppleToken(identityToken);
            } else if (code) {
                const tokenResponse = await getAuthorizationToken(code);
                appleUser = await verifyAppleToken(tokenResponse.id_token);
            } else {
                return res.status(400).json({ error: 'Missing idToken or code' });
            }

            if (!appleUser.sub) {
                return res.status(400).json({ error: 'Invalid Apple ID token' });
            }

            const email = appleUser.email || `${appleUser.sub}@privaterelay.appleid.com`;

            const beast = await BeastModel.findOrCreateByAppleId(appleUser.sub, email);

            const token = jwt.sign({ id: beast.id }, JWT_SECRET, { expiresIn: '7d' });

            return res.status(200).json({ token, beast });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Invalid Apple authentication' });
        }
    }
}
