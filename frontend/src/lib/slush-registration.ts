// Register Slush wallet with dapp-kit
import { registerSlushWallet } from '@mysten/slush-wallet';

// Configure Slush wallet with app details
const slushConfig = {
  appName: 'FraudGuard',
  appUrl: 'http://localhost:8080',
  networks: {
    testnet: {
      url: 'https://fullnode.testnet.sui.io:443'
    }
  }
};

// Register the Slush wallet with configuration
registerSlushWallet(slushConfig); 