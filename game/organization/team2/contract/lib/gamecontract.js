/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// Game specifc classes
const Commitment = require('./commitment.js');
const CommitmentList = require('./commitmentlist.js');
const PlayerUpdate = require('./playerupdate.js');
const UpdateList = require('./updatelist.js');

/**
 * A custom context provides easy access to list of all players updates
 */
class GameContext extends Context {

    constructor() {
        super();
        // All updates are held in a list of updates
        this.updateList = new UpdateList(this);
        this.commitmentList = new CommitmentList(this);
    }

}

/**
 * Define game smart contract by extending Fabric Contract class
 *
 */
class GameContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.gamenet.game');
    }

    /**
     * Define a custom context for game
    */
    createContext() {
        return new GameContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Create commitment
     *
     * @param {Context} ctx the transaction context
     * @param {String} committer commitment creator
     * @param {String} randomString commitment string
     * @param {String} commitDateTime commitment date
    */
   async commit(ctx, committer, randomString, commitDateTime) {

        // create an instance of the commitment
        let commitment = Commitment.createInstance(committer, randomString, commitDateTime);

        // Smart contract, rather than commitment, moves commitment into COMMITTED state
        commitment.setOpened();

        // Newly commitment is owned by the committer
        commitment.setCommitter(committer);

        // Add the commitment to the list of all similar commitment in the ledger world state
        await ctx.commitmentList.addCommitment(commitment);

        // Must return a serialized commitment to caller of smart contract
        return commitment;
    }

    /**
     * Check player update
     *
     * @param {Context} ctx the transaction context
     * @param {String} player1 username player1
     * @param {String} player2 username player2
    */
    async queryAlpha(ctx, player1, player2) {

        // Retrieve the current commitment using key fields provided
        let commitmentKey1 = Commitment.makeKey([player1]);
        let commitmentKey2 = Commitment.makeKey([player2]);
        let commitment1 = await ctx.commitmentList.getCommitment(commitmentKey1);
        let commitment2 = await ctx.commitmentList.getCommitment(commitmentKey2);

        if (commitment1.isOpened() && commitment2.isOpened()){
            // let comm1_byte = Encoding.Unicode.GetBytes(commitment1);
            // let comm2_byte = Encoding.Unicode.GetBytes(commitment2);
            // var alpha = []
            // if (comm1_byte.length > comm2_byte.length) {
            //     for (var i = 0; i < comm2_byte.length; i++) {
            //         alpha.push(comm1_byte[i] ^ comm2_byte[i])
            //     }
            // } else {
            //     for (var i = 0; i < comm1_byte.length; i++) {
            //     alpha.push(comm1_byte[i] ^ comm2_byte[i])
            //     }
            // }
            // return String.fromCharCode.apply(null, alpha)
            return (commitment1.getRandomString()).concat(commitment2.getRandomString())
        } else {
            throw new Error('One player ' + player1 + ' or ' + player2 + ' has not opened the commitment. ');
        }
   }

    /**
     * Issue player update
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer update issuer
     * @param {String} update update hash
     * @param {String} updateNumber number of update for this issuer
     * @param {String} issueDateTime player update issue date
    */
    async issue(ctx, issuer, update, updateNumber, issueDateTime) {

        // create an instance of the player update
        let playerUpdate = PlayerUpdate.createInstance(issuer, update, updateNumber, issueDateTime);

        // Smart contract, rather than player update, moves player update into ISSUED state
        playerUpdate.setIssued();

        // Newly issued player update is owned by the issuer
        playerUpdate.setIssuer(issuer);

        // Add the update to the list of all similar player updates in the ledger world state
        await ctx.updateList.addUpdate(playerUpdate);

        // Must return a serialized player update to caller of smart contract
        return playerUpdate;
    }

    /**
     * Check player update
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer update issuer
     * @param {String} updateNumber number of update for this issuer
     * @param {String} proofUpdate verification of player update
    */
    async check(ctx, issuer, updateNumber, proofUpdate) {

        // Retrieve the current update using key fields provided
        let playerUpdateKey = PlayerUpdate.makeKey([issuer, updateNumber]);
        let playerUpdate = await ctx.updateList.getUpdate(playerUpdateKey);

        // Check if the update was invalid, it moves state from ISSUED to CHEAT
        if (playerUpdate.getUpdate() !== proofUpdate) {
            console.log('Update ' + issuer + updateNumber + ' was a cheat.');
            playerUpdate.setCheat();
        }

        // If the update was valid, it moves state from ISSUED to CHECKED
        if (playerUpdate.isIssued()) {
            playerUpdate.setChecked();
        } else {
            throw new Error('PlayerUpdate ' + issuer + updateNumber + ' already checked. Current state = ' + playerUpdate.getCurrentState());
        }

        // Update the player update
        await ctx.updateList.updateUpdate(playerUpdate);
        return playerUpdate;
    }

}

module.exports = GameContract;
