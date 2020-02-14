/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const PlayerUpdate = require('./playerupdate.js');

class UpdateList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.gamenet.updatelist');
        this.use(PlayerUpdate);
    }

    async addUpdate(playerUpdate) {
        return this.addState(playerUpdate);
    }

    async getUpdate(playerUpdateKey) {
        return this.getState(playerUpdateKey);
    }

    async updateUpdate(playerUpdate) {
        return this.updateState(playerUpdate);
    }
}


module.exports = UpdateList;