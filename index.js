// Tokens
const tokensMainnet = require('./tokens.mainnet.json');
const tokensTestnet = require('./tokens.testnet.json');
const tokensPrivatenet = require('./tokens.privatenet.json');
const tokenstsub360890 = require('./tokens.tsub360890.json');

// Apps
const appsMainnet = require('./apps.mainnet.json');
const appsTestnet = require('./apps.testnet.json');
const appsPrivatenet = require('./apps.privatenet.json');

// Blockchain
const blockchainMainnet = require('./blockchain.mainnet.json');
const blockchainTestnet = require('./blockchain.testnet.json');
const blockchainPrivatenet = require('./blockchain.privatenet.json');

function prepareData(data) {
  // loop over the data and add the logoUrl
  const chainIds = ['mainnet', 'testnet', 'privatenet', 'tsub360890'];
  for (const idx in chainIds) {
    const chainId = chainIds[idx];
    const tokens = data[chainId].tokens;
    for (const address in tokens) {
      const token = tokens[address];
      token.logoUrl = tokenLogoBaseUrl + token.logo;
    }
  }

  return data;
}

let tokenLogoBaseUrl = 'https://wallet-api.dnerochain.xyz/tokens/';
let defaultData = prepareData({
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
    tokens: tokenstsub360890
  },
});
let latestData = defaultData;
let isDataLoading = false;

async function sync(onLoad = undefined) {
  try {
    if (!isDataLoading) {
      isDataLoading = true;
      const req = await fetch('https://wallet-api.dnerochain.xyz/wallet-metadata/v1/data.json');
      const json = await req.json();
      if(json){
        latestData = prepareData(json);

        if (onLoad) {
          onLoad(latestData);
        }
      }

      return latestData;
    }
  }
  catch (error) {
    console.error('@dnerolabs/wallet-metadata: Error loading data: ', error);
    isDataLoading = false;
  }
}

function getKnownTokens(chainId) {
  return latestData[chainId]?.tokens || {};
}

function getKnownToken(chainId, address) {
  const chainData = getKnownTokens(chainId);
  return chainData[address];
}

function getKnownApps(chainId) {
  return latestData[chainId]?.apps || [];
}

function getBlockchain(mainchainId) {
  return latestData[mainchainId]?.blockchain;
}

module.exports = {
  sync,

  // Tokens
  getKnownTokens,
  getKnownToken,

  // Apps
  getKnownApps,

  // Blockchain
  getBlockchain
};
