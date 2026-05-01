// encode.js
const fs = require("fs");
const path = require("path");

const keyPath = path.join(
  __dirname,
  "travel-guru-auth-projec-f8d6b-firebase-adminsdk-fb.json",
);
const key = fs.readFileSync(keyPath, "utf8");
const base64 = Buffer.from(key).toString("base64");

console.log(base64);
