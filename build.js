const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

// Tokens
const tokensMainnet = require('./tokens.mainnet.json');
const tokensTestnet = require('./tokens.testnet.json');
const tokensPrivatenet = require('./tokens.privatenet.json');
const tokensTsub360890 = require('./tokens.tsub360890.json');

// Apps
const appsMainnet = require('./apps.mainnet.json');
const appsTestnet = require('./apps.testnet.json');
const appsPrivatenet = require('./apps.privatenet.json');

// Blockchain
const blockchainMainnet = require('./blockchain.mainnet.json');
const blockchainTestnet = require('./blockchain.testnet.json');
const blockchainPrivatenet = require('./blockchain.privatenet.json');

let data = {
  version: packageJson.version,
  updatedAt: new Date().toISOString(),
  mainnet: {
    tokens: tokensMainnet,
    apps: appsMainnet,
    blockchain: blockchainMainnet
  },
  testnet: {
    tokens: tokensTestnet,
    apps: appsTestnet,
    blockchain: blockchainTestnet
  },
  privatenet: {
    tokens: tokensPrivatenet,
    apps: appsPrivatenet,
    blockchain: blockchainPrivatenet
  },
  tsub360890: {
    tokens: tokensTsub360890,
  }
};

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

let dataJSON = JSON.stringify(data);
ensureDirectoryExistence('./build/data.json');
fs.writeFileSync('./build/data.json', dataJSON);
