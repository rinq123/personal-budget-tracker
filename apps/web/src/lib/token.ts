type JwtPayload = {
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];

    if (!base64Url) {
      return null;
    }

    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(base64Url.length / 4) * 4, "=");

    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}


export function isTokenExpired(token : string): boolean{
    const payload = decodeJwtPayload(token);
    if(!payload?.exp){
        return true;
    }

    return Date.now() >= payload.exp * 1000;
}


export function getTokenExpiryTime(token: string): number | null {
    const payload = decodeJwtPayload(token);

    if(!payload){
        return null;
    }
    if(!payload.exp){
        return null;
    }

    return payload?.exp * 1000;
}
