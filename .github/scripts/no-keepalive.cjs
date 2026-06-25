// CI workaround for "Premature close" when firebase-tools mints the OAuth token.
//
// google-auth-library@9.x bundles gaxios@6, which uses `node-fetch`. With no
// custom agent, node-fetch falls back to http(s).globalAgent. On the runner's
// Node (>=19, keepAlive ON by default), node-fetch reuses a pooled socket that
// the server has already closed, throwing "Premature close" on the token request.
//
// Disabling HTTP keep-alive forces a fresh connection per request, which avoids
// the stale-socket reuse. Preloaded via NODE_OPTIONS=--require for the deploy.
require('http').globalAgent.keepAlive = false;
require('https').globalAgent.keepAlive = false;
