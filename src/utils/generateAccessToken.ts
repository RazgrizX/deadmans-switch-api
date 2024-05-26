import jwt from 'jsonwebtoken';

function generateAccessToken(userId: string) {
  return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET!, {
    expiresIn: 1800,
  });
}

export default generateAccessToken;
