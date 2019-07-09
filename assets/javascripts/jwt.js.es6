export function jwt(apiUrl) {

  const jwt = (localStorage.getItem('jwt') ? localStorage.getItem('jwt') : false);
  const jwtRefresh = (localStorage.getItem('jwt-xl') ? localStorage.getItem('jwt-xl') : false);

  if (!jwt && !jwtRefresh) {
    return new Promise(function(resolve, reject) {
      resolve(false);
    });
  }

  // decodes JWT
  const decodeJWT = function(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  const decodedJWT = jwt ? decodeJWT(jwt) : null;
  const decodedJWTRefresh = jwtRefresh ? decodeJWT(jwtRefresh) : null;
  const now = Math.floor(new Date().getTime() / 1000);

  if( (!jwt && decodedJWTRefresh.exp >= now) || (decodedJWT.exp - now <= 86400) ) {
    return fetch(`${apiUrl}/auth/refresh`, {
      body: JSON.stringify({
        token: localStorage.getItem('jwt-xl')
      }),
      headers: ({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Origin": `${window.location.protocol}//${window.location.host}`
      }), 
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('jwt-xl', data.refresh);
      return data.token;
    })
    .catch(error => console.error(error)) 
  }
  else {
    return new Promise(function(resolve, reject) {
      resolve(jwt);
    });
  }
}