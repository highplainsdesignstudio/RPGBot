const Dice = {
    roll: function(sides) {
        const attack = Math.floor(Math.random() * sides) + 1;
        return attack;
    },

    modifiedAttackValue: function(original, attack, defense) {
        let modified = original + attack - defense;
        if(modified <= 0) modified = 1;
        return modified;
    },

    modifiedHealValue: function(original, heal) {
        let modified = original + heal;
        return modified;
    }
}

module.exports = Dice;