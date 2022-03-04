# DC6S

The repository houses a set of calls required to perform a 1/106 HCCS run if you're me, DC6. Pretty much all that there's left is wrapping these up into libram's CS test infrastructure and everything should be operational. Soon!

## Setup

If you don't have `yarn`, install [node.js](https://nodejs.org/en/), open a terminal and write `npm install -g yarn`. Once done, perform the following:

```
git clone https://github.com/ktpolanski/dc6s
cd dc6s && yarn install && yarn run build
ln -s $PWD/KoLmafia/scripts/dc6s/ ~/Library/Application\ Support/KoLmafia/scripts/
ln -s $PWD/KoLmafia/ccs/dc6s.ccs ~/Library/Application\ Support/KoLmafia/ccs/
```

## Run Plan

A pair of spreadsheets showing the run plan and buff setup for non-stat tests can be accessed [here](https://docs.google.com/spreadsheets/d/1uJ1DOd12r0VuOmfv0_FZXPMmtZ0Ln2FJUenFkhsFRHk/edit#gid=1299653939). Some notes:
 - This is a standard coil wire into level into do tests sort of thing, following the bean test model. Do stat tests early as you're buffed from levelling. Do the familiar weight block (hot resistance and noncombat both benefit from it) afterward to be able to use familiar weight buffs for levelling. Do weapon/spell damage due to shared buffs. Finish with item so that Feel Lost can be used.
 - The run makes use of a few outfits: the expected mysticality% to maximise scaler returns, a flat mysticality+ for some early fights, a ML option for maximising gains from non-scaling fights, and familiar weight for Sprinkle Dog and bander runaways.
 - The Chateau rests are delayed until all non-scaling fights are picked up, which should maximise their returns.
 - Getting the Sprinkle Dog to 140 pounds before going into the Retail District guarantees that any non-gentrifier will drop 55 sprinkles, which is sufficient for a latte and cigarettes. As such, the familiar weight drop familiars are routed early to assist with this.
 - Due to the large number of various combats in the NEP, the cosmic bowling ball is consciously used earlier in a fashion that allows for 9+11 turn bowling sideways. Once the camelcalf is charged, the left-hand man is pulled out and equipped with the familiar scrapbook. Once all that comes together, Feel Pride is used for maximum gains.
 - The NEP could be further optimised by working in hipster fights, but that increase in the number of combats would complicate various stat boost use logic. The existing setup gets enough stats, so this was wilfully ignored.

## Credits

DC6S was not created in a vacuum, and drew inspiration from a number of established runners and their scripts:
 - Manendra was very patient and helpful as I slowly learned the ropes, answering more idiotic questions than anybody should, and introduced me to the bean-derived test ordering via [manny-hccs](https://github.com/lewismd13/manny-hccs).
  - phreddrickkv2's organisation of [phccs](https://github.com/horrible-little-slime/phccs) was very inspirational, a lot of the DC6S functionality is me trying to write takes on phred's ideas in syntax I can easily understand/debug as a newbie. Plus I'm pretty sure a lot of the libram functionality I used passed through his hands too.
 - Katarn's fight routing was a major influence on what I ended up doing, and I picked up various relevant tidbits from conversations and looking at [seventy-hccs](https://github.com/s-k-z/seventy-hccs).
 - Captain Scotch's [TS starter repository](https://github.com/docrostov/kol-ts-starter) and CS planning spreadsheet made the process a lot easier.