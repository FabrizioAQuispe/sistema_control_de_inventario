import Cookies from 'js-cookie';

const ObtenerCookies = () => {
    const cookieProfile = Cookies.get("data");
    const cookieParse = JSON.parse(cookieProfile || "{}");
    return {
        cookieParse
    };
}

export default ObtenerCookies;