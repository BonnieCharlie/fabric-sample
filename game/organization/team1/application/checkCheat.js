/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access GameNet network
 * 4. Construct request to check a player update
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const PlayerUpdate = require('../contract/lib/playerupdate.js');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('../identity/user/alice/wallet');

// Main program function
async function main() {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'User1@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access GameNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to game contract
        console.log('Use org.gamenet.game smart contract.');

        const contract = await network.getContract('gamecontract', 'org.gamenet.game');

        // check player update
        console.log('Submit player update check transaction.');

        const checkResponse = await contract.submitTransaction('check', 'Bob', '00002', 'gh4dws87f', '2020-01-28');

        // process response
        console.log('Process check transaction response:' + checkResponse);

        let playerUpdate = PlayerUpdate.fromBuffer(checkResponse);

        console.log(`Check of ${playerUpdate.issuer} player update with number ${playerUpdate.updateNumber}: this is a cheat!`);
        console.log('')
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`This is a cheat!`);
        // console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Check cheat program complete.');

}).catch((e) => {

    console.log('Check cheat program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});