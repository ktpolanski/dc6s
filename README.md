# DC6S

The repository houses an operational CS script that does 1/74 SC runs for me, DC6. It's unlikely to do so for others out of the box, but that's the case with most CS scripts. Hopefully the simple syntax and heavy commenting make it easier to extract any desired information from the code.

## Setup

If you don't have `yarn`, install [node.js](https://nodejs.org/en/), open a terminal and write `npm install -g yarn`. Once done, perform the following:

```
git clone https://github.com/ktpolanski/dc6s
cd dc6s && yarn install && yarn run build
ln -s $PWD/KoLmafia/scripts/dc6s/ ~/Library/Application\ Support/KoLmafia/scripts/
ln -s $PWD/KoLmafia/ccs/dc6s.ccs ~/Library/Application\ Support/KoLmafia/ccs/
```

This offers a few commands accessible from Mafia's CLI:

-   `dc6s` performs the CS run. Accepts the following optional argument:
    -   `70` adds a bit of financially inefficient buffing to hit a 1/70
-   `dc6s_halfloop` adds some basic breakfast tasks, garbo legs and automatic ascension. Accepts the following optional arguments, in addition to forwarding `70` to `dc6s` if passed:
    -   `hardcore` will ascend HCCS rather than the default SCCS, but this hasn't been used in ages and is likely to misbehave in some way
    -   `noascend` will deposit the user in front of the gash in an ascension-ready state; useful for perming skills
    -   `nopvp` skips PvP, if not provided uses [`PVP_MAB.ash`](https://kolmafia.us/threads/a-multi-armed-bandit-pvp-script.27391/)

## Run Setup

The script is written to operate as a Pastamancer, with the following pre-run setup:

-   Wallaby moon sign, astral chapeau, astral six-pack
-   peppermint garden, Our Daily Candles eudora
-   Chateau: foreign language tapes, ceiling fan, continental juice bar
-   Cowboy boots: nicksilver spurs, frontwinder skin

## Run Plan

A pair of spreadsheets showing the run plan and buff setup for non-stat tests can be accessed [here](https://docs.google.com/spreadsheets/d/1uJ1DOd12r0VuOmfv0_FZXPMmtZ0Ln2FJUenFkhsFRHk/edit#gid=1823036652). Some notes:

-   This is a standard coil wire into level into do tests sort of thing. Do stat tests early as you're buffed from levelling. Do hot resistance to make use of a Daylight Shavings Helmet buff that showed up during levelling. Do weapon/spell damage due to shared buffs. Do the familiar weight block (noncombat also benefits from it) afterward, allowing for some limited buffs to overrun into farming. Finish with item so that Feel Lost can be used.
-   The run makes use of a few outfits: the expected mysticality% to maximise scaler returns, a flat mysticality+ for some early fights, a ML option for maximising gains from non-scaling fights, and familiar weight for Sprinkle Dog and bander runaways.
-   When not using bespoke familiars, the camelcalf is charged first to be able to get the spit buff for an extra bit of edge in levelling. Then the shorter-order cook is ran for the weight potion, and then the garbage fire is queued up if not enough burning newspapers dropped from the bjorn during incidental runaways. Once these familiars are exhausted, the script defaults to the goth kid for extra free fights on a non-attacking familiar. Some adjustments to this order are made against low-HP monsters that would be susceptible to attack damage, and the Witchess Queen blocking skill use.
-   Getting the Sprinkle Dog to 120 pounds (when combined with a Meteor Shower) before going into the Retail District guarantees that any non-gentrifier will drop 55 sprinkles, which is sufficient for a latte and cigarettes. Softcore largely trivialises this, but the old hardcore routing had the familiar order reversed to get the familiar weight drops early to push Sprinkle Dog over the edge, avoided getting the spit buff during levelling, and reversed the familiar weight and damage test blocks to account for buff presence.
-   Due to the large number of various combats in the NEP, the cosmic bowling ball is consciously used earlier in a fashion that allows for 9+11 turn bowling sideways.

## Credits

DC6S was not created in a vacuum, and drew inspiration from a number of established runners and their scripts:

-   Manendra was very patient and helpful as I slowly learned the ropes, answering more idiotic questions than anybody should, and introduced me to the bean-derived test ordering via [manny-hccs](https://github.com/lewismd13/manny-hccs).
-   phreddrickkv2's organisation of [phccs](https://github.com/horrible-little-slime/phccs) was very inspirational, a lot of the DC6S functionality is me trying to write takes on phred's ideas in syntax I can easily understand/debug as a newbie. Plus I'm pretty sure a lot of the libram functionality I used passed through his hands too.
-   Katarn's fight routing was a major influence on what I ended up doing, and I picked up various relevant tidbits from conversations and looking at [seventy-hccs](https://github.com/s-k-z/seventy-hccs).
-   Captain Scotch's [TS starter repository](https://github.com/docrostov/kol-ts-starter) and CS planning spreadsheet made the process a lot easier.
