/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access Game network
 * 4. Construct request to issue player update
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
const wallet = new FileSystemWallet('../identity/user/bob/wallet');

// Main program function
async function main() {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'Admin@org1.example.com';

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

        const contract = await network.getContract('gamecontract');

        // issue player update
        console.log('Submit player update issue transaction: this is a cheat!');

        const issueResponse = await contract.submitTransaction('issue', 'Bob', 'ghfgfg8f', '00002', '2020-01-28');

        // process response
        console.log('Process issue transaction response.'+issueResponse);

        let playerUpdate = PlayerUpdate.fromBuffer(issueResponse);

        console.log(`${playerUpdate.issuer} player update : ${playerUpdate.updateNumber} successfully issued for value ${playerUpdate.update}.`);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Cheat program complete.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});