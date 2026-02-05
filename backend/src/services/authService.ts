import { db } from '../config/firebase';

/**
 * AuthService
 * create and  access code OTP
 *sdt and email
 */
export class AuthService {
    private collection = db.collection('access_codes');

    // otp 
    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    //create code for email and sdt 
    async createAccessCode(identifier: string): Promise<string> {
        if (!identifier) {
            throw new Error('identifier is required');
        }

        const code = this.generateCode();

        await this.collection.doc(identifier).set({
            code: code,
            createdAt: new Date()
        });

        console.log('access code created', {
            identifier: identifier
        });

        return code;
    }

    // check validate code 
    async validateAccessCode(identifier: string, code: string): Promise<boolean> {
        if (!identifier || !code) {
            return false;
        }

        const docRef = this.collection.doc(identifier);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            //  console.warn('access code not found', { identifier });
            return false;
        }

        const data = snapshot.data();

        if (!data || data.code !== code) {
            console.warn('invalid access code', { identifier });
            return false;
        }

        // clear code 
        await docRef.update({
            code: '',
            verifiedAt: new Date()
        });

        // console.log('access code verified successfully', {
        //     identifier: identifier
        // });

        return true;
    }
}
