const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();

// Session configuration
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'some_secret_key',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloakConfig = {
    "realm": process.env.KEYCLOAK_REALM || "myrealm",
    "auth-server-url": process.env.KEYCLOAK_AUTH_URL || "http://localhost:8080",
    "ssl-required": "external",
    "resource": process.env.KEYCLOAK_CLIENT_ID || "myclient",
    "credentials": {
      "secret": process.env.KEYCLOAK_CLIENT_SECRET || "myclientsecret"
    },
    "confidential-port": 0
  };
  
  // Initialize Keycloak with the config
  const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

// Initialize Keycloak
app.use(keycloak.middleware());

// Protected route - requires authentication
app.get('/protected', keycloak.protect(), (req, res) => {
  res.send('This is a protected route!');
});

app.get('/logout', (req, res) => {
    // Logout locally (from the app)
    req.logout();
  
    // Redirect to Keycloak's logout endpoint
    const keycloakLogoutUrl = `${keycloakConfig['auth-server-url']}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent('http://localhost:3000')}`;
    res.redirect(keycloakLogoutUrl);
  });

// Public route - no authentication required
app.get('/', (req, res) => {
  res.send('Welcome to the public route!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
