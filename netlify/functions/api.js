 const serverless = require("serverless-http");
 const express = require("express");
 const { app: baseApp } = require("../../src/app");
 
 // Netlify functions mount on "/.netlify/functions/<name>".
 // We mount the existing Express app under "/" and rely on redirects.
 const app = express();
 app.use("/", baseApp);
 
 module.exports.handler = serverless(app);
