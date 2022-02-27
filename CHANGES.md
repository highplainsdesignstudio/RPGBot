# Changes

## v0.0.5


## v0.0.4

- More stats added to player at creation.
  - kills: 0, deaths: 0, damageDone: 0, damageTaken: 0, healsDone: 0, healsTaken: 0.
- Inspect command shows these new stats.
- Attack command updates damageDone and damageTaken, kills, and deaths stats for user and target.
- A user can not attack or intimidate themselves
- Heal command updates healsDone and healsTaken.
- Blast command should now not target the user.
- Fixed bug #6: https://github.com/highplainsdesignstudio/RPGBot/issues/6

## v0.0.3

- Changes to stat mechanics.
  - Dice.modifiedAttackValue now adds 10% base damage for every point of attack power, and subtracts 1% of this modified value for every point of defense.
  - Dice.modifiedHealValue now adds 7% base healing for every point of heal power.
  - When you die from attack, blast, or swing commands, players attack, defense, and heal are updated to 1.
  - Bolster command now maxes stats out at 50.
  - Heal command maxes the life out to 200.

## v0.0.2

- Added inspect command.
- Added Defense attribute.
- Attributes are now affecting attack, swing, and heal command values.
- Commands to be added:
    1. Bolster: Increases stats of target.
    2. Intimidate: Reduces stats of target.
    3. /blast: Attacks the last three speakers in the channel.
    4. attack turned into a slash command.
    5. heal turned into a slash command.
    6. bolster turned into a slash command.
    7. intimidate turned into a slash command.
    8. inspect turned into a slash command.

## v0.0.1

- Added an attack command.
- Added an env.bak.js file to fil in process.env variables as needed.
- Added Dice and Players modules.
- Added a heal command.
- Changed attack command to utilize new modules.
- Added a check for death when a player is attacked.
- Added checks for bot targeting.
- All sorts of updates to the commands.
- Added a /swing command that randomly attacks a member of the channel.
- Cleaned up code.
