const Dice = {
    roll: function(sides) {
        const attack = Math.floor(Math.random() * sides) + 1;
        return attack;
    }
}

module.exports = Dice;