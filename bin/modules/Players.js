const Players = {
    find: function(username) {
        const players = JSON.parse(process.env.PLAYERS); // Will return an array of {username:DiscordName, life:100, attack: 1, heal: 1}
        // Loop through the array to find if the user is included.
        let found = false;
        let _player = {};
        players.every((player, index) => {
            if(player.username === username){
                _player = player;
                found = true;
                return false;
            } else return true;
        });
        if(found) return _player;
        else {
            // Add a new player to the process.env.PLAYERS array.
            _player = {
                username: username,
                attack: 1,
                heal: 1,
                life: 100
            }
            players.push(_player);
            process.env.PLAYERS = JSON.stringify(players);
            return _player;
        }
    },

    updateTarget: function(target) {
        const players = JSON.parse(process.env.PLAYERS); // Will return an array of {username:DiscordName, life:100, attack: 1, heal: 1}
         // Loop through the array to find the users index.
         let _index = 0;
         players.every((player, index) => {
            if(player.username === target.username){
                _index = index;
                return false;
            } else return true;
         });
        players[_index] = target;
        process.env.PLAYERS = JSON.stringify(players);
    },

    targetTimeoutExempt: function(interaction) {
        const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
        const isExempt = !exemptRoles.every(role => {
            if(interaction.targetMember._roles.includes(role)) {
                return false;
            } else return true;
        });
        return isExempt;
    },
    foundTargetTimeoutExempt: function(foundTarget) {
        const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
        const isExempt = !exemptRoles.every(role => {
            if(foundTarget._roles.includes(role)) {
                return false;
            } else return true;
        });
        return isExempt;
    },

    userTimeoutExempt: function(interaction) {
        const exemptRoles = JSON.parse(process.env.TIMEOUT_EXEMPT);
        const isExempt = !exemptRoles.every(role => {
            if(interaction.member._roles.includes(role)) {
                return false;
            } else return true;
        });
        return isExempt;
    }
}

module.exports = Players;