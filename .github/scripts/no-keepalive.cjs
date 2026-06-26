// CI workaround for "Premature close" when firebase-tools mints the OAuth token.
//
// google-auth-library@9.x bundles gaxios@6, which uses `node-fetch`. With no
// custom agent, node-fetch falls back to http(s).globalAgent. On the runner's
// Node (>=19, keepAlive ON by default), the keep-alive/node-fetch interaction
// throws "Premature close" while minting the token. Proven in CI: the mint fails
// with keep-alive on and succeeds with it off.
//
// Disabling HTTP keep-alive forces a fresh connection per request.
// Preloaded via NODE_OPTIONS=--require for the deploy step.
require('http').globalAgent.keepAlive = false;
require('https').globalAgent.keepAlive = false;
