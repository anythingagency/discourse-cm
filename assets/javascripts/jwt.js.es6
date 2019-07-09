export async function jwt(apiUrl) {
  const jwt = (localStorage.getItem('jwt') ? localStorage.getItem('jwt') : false);
  const jwtRefresh = (localStorage.getItem('jwt-xl') ? localStorage.getItem('jwt-xl') : false);

  if (!jwt && !jwtRefresh) {
    return false;
  }

  // decodes JWT
  const decodeJWT = function(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  const decodedJWT = (jwt) ? decodeJWT(jwt) : null;
  const decodedJWTRefresh = (jwtRefresh) ? decodeJWT(jwtRefresh) : null;
  const now = Math.floor(new Date().getTime() / 1000);

  if( (!jwt && decodedJWTRefresh.exp >= now) || (decodedJWT.exp - now <= 86400) ) {

    const data = {
      token: jwtRefresh
    };

    let refresh = fetch(`${apiUrl}/auth/refresh`, { 
      body: JSON.stringify(data),
      headers: ({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Origin": `${window.location.protocol}//${window.location.host}`
      }), 
      method: 'POST'  
    }).then(async response => {
      const result = await response.json();
      if(response.status === 200) {
        localStorage.setItem('jwt', result.token);
        localStorage.setItem('jwt-xl', result.refresh);
        return result.token;
      }
      else {
        return false;
      }
    },
    error => {
      return false;
    });

    let response = await refresh;
    return response;
  }
  else {
    return jwt;
  }
}