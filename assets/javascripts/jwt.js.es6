export function jwt(apiUrl) {
  return new Promise(resolve => {
    setTimeout(() => {
      
      const jwt = (localStorage.getItem('jwt') ? localStorage.getItem('jwt') : false);
      const jwtRefresh = (localStorage.getItem('jwt-xl') ? localStorage.getItem('jwt-xl') : false);

      if (!jwt && !jwtRefresh) {
        resolve(false);
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
            resolve(result.token);
          }
          else {
            resolve(false);
          }
        },
        error => {
          resolve(false);
        });

      }
      else {
        resolve(jwt);
      }

    }, 1000);
  });
}