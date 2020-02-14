/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Commitment = require('./commitment.js');

class CommitmentList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.gamenet.commitmentlist');
        this.use(Commitment);
    }

    async addCommitment(commitment) {
        return this.addState(commitment);
    }

    async getCommitment(commitmentKey) {
        return this.getState(commitmentKey);
    }
}


module.exports = CommitmentList;