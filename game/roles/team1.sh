#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/team1/configuration/cli"
docker-compose -f docker-compose.yml up -d cliTeam1

echo "
 Install and Instantiate a Smart Contract

 JavaScript Contract:

 docker exec cliTeam1 peer chaincode install -n gamecontract -v 0 -p /opt/gopath/src/github.com/contract -l node
 docker exec cliTeam1 peer chaincode instantiate -n gamecontract -v 0 -l node -c '{\"Args\":[\"org.gamenet.game:instantiate\"]}' -C mychannel -P \"AND ('Org1MSP.member')\"

 Run Applications

 JavaScript Client Aplications:

 To add identity to the wallet:   node addToWallet.js
 To commit a value            :   node commit.js
 To get alpha value           :   node queryAlpha.js
 To issue an update           :   node issue.js
 To check enemy update        :   node check.js
"

echo "Suggest that you change to this dir>  cd ${DIR}/organization/team1/"
