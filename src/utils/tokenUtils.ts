import jwt, { JwtPayload } from 'jsonwebtoken'
import {SECRET_JWT} from './env'

// Generate JWT token using Secret
export const createToken = (email: string): string => {
    return jwt.sign({ email }, SECRET_JWT, { expiresIn: '1h' })
 }


 export const verifyToken = (token: string): string | JwtPayload => {
    try {
       return jwt.verify(token, SECRET_JWT)
    } catch (error) {
       throw new Error('Invalid token')
    }
 }