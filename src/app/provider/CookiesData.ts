import Cookies from 'js-cookie';

const cookieProfile = typeof window !== 'undefined' ? Cookies.get("data") : null;
export const cookieParse = cookieProfile ? JSON.parse(cookieProfile) : [];
