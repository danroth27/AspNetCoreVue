const fs = require("fs");
const path = require('path');

const baseFolder =
  process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateName = process.argv.map(arg => arg.match(/name=(?<value>.+)/i))
  .filter(Boolean)
  .reduce((previous, current) => previous || current.groups.value, undefined) ||
  process.env.npm_package_name;

if (!certificateName) {
  console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass name=<<app>> explicitly.')
  process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

module.exports = {
  devServer: {
    https: {
          key: fs.readFileSync(keyFilePath),
          cert: fs.readFileSync(certFilePath)
        },
        port: 5002,
      proxy: "https://localhost:5001"
  }
};