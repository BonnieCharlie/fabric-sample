/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commitment state values
const cpState = {
    COMMITTED: 1,
    OPENED: 2
};

/**
 * Commitment class extends State class
 * Class will be used by application and smart contract to define a commitment
 */
class Commitment extends State {

    constructor(obj) {
        super(Commitment.getClass(), [obj.committer]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getCommitter() {
        return this.committer;
    }

    setCommitter(committer) {
        this.committer = committer
    }

    getRandomString() {
        return this.randomString;
    }

    setRandomString(randomString) {
        this.randomString = randomString;
    }

    /**
     * Useful methods to encapsulate commitment states
     */
    setCommitted() {
        this.currentState = cpState.COMMITTED;
    }

    setOpened() {
        this.currentState = cpState.OPENED;
    }

    isCommitted() {
        return this.currentState === cpState.COMMITTED;
    }

    isOpened() {
        return this.currentState === cpState.OPENED;
    }

    static fromBuffer(buffer) {
        return Commitment.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commitment
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Commitment);
    }

    /**
     * Factory method to create a commitment object
     */
    static createInstance(committer, randomString, commitDateTime) {
        return new Commitment({ committer, randomString, commitDateTime});
    }

    static getClass() {
        return 'org.gamenet.commitment';
    }
}

module.exports = Commitment;
