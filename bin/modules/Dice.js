const Dice = {
    roll: function(sides) {
        const attack = Math.floor(Math.random() * sides) + 1;
        return attack;
    },

    modifiedAttackValue: function(original, attack, defense) {
        let boostAttack = attack * 10;
        let modified = original + Math.round(boostAttack / 100 * original);
        modified = modified - Math.round(defense / 100 * modified);
        if(modified <= 0) modified = 1;
        return modified;
    },

    modifiedHealValue: function(original, heal) {
        let boostHeal = heal * 7;
        let modified = original + Math.round(boostHeal / 100 * original);
        return modified;
    }
}

module.exports = Dice;