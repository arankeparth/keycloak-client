steps:

1) npm install
2) node index.js
3) create realm myrealm and client myclient in keycloak admin console.
4) Set root url and redirect url to http://localhost:3000/*.
5) to login, hit localhost:3000/protected.
6) click register.
7) after registering, hit localhost:3000/logout.
8) then again hit localhost:3000/protected to login using the registered details.
