/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate player update state values
const cpState = {
    ISSUED: 1,
    CHECKED: 2,
    CHEAT: 3
};

/**
 * PlayerUpdate class extends State class
 * Class will be used by application and smart contract to define a player update
 */
class PlayerUpdate extends State {

    constructor(obj) {
        super(PlayerUpdate.getClass(), [obj.issuer, obj.updateNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(issuer) {
        this.issuer = issuer
    }

    getUpdate() {
        return this.update;
    }

    setUpdate(update) {
        this.update = update;
    }

    getUpdateNumber() {
        return this.updateNumber;
    }

    setUpdateNumber(updateNumber) {
        this.updateNumber = updateNumber;
    }

    /**
     * Useful methods to encapsulate player update states
     */
    setIssued() {
        this.currentState = cpState.ISSUED;
    }

    setChecked() {
        this.currentState = cpState.CHECKED;
    }

    setCheat() {
        this.currentState = cpState.CHEAT;
    }

    isIssued() {
        return this.currentState === cpState.ISSUED;
    }

    isChecked() {
        return this.currentState === cpState.CHECKED;
    }

    isCheat() {
        return this.currentState === cpState.CHEAT;
    }

    static fromBuffer(buffer) {
        return PlayerUpdate.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to player update
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, PlayerUpdate);
    }

    /**
     * Factory method to create a player update object
     */
    static createInstance(issuer, update, updateNumber, issueDateTime) {
        return new PlayerUpdate({ issuer, update, updateNumber, issueDateTime});
    }

    static getClass() {
        return 'org.gamenet.playerupdate';
    }
}

module.exports = PlayerUpdate;
