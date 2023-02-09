import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const createOrGetUser = async (res: any) => {
  const decoded: { name: string; picture: string; sub: string } = jwtDecode(
    res.credential,
  );

  const { name, picture, sub } = decoded;

  const user = {
    _id: sub,
    _type: 'user',
    userName: name,
    image: picture,
  };

  const env = process.env.NODE_ENV;

  if (env === 'development') {
    await axios.post(`http://localhost:3000/api/auth`, user);
  } else if (env === 'production') {
    await axios.post(`https://next-js-pincture.vercel.app/api/auth`, user);
  }
};
