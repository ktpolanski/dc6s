import {
    adv1,
    autosell,
    cliExecute,
    create,
    itemAmount,
    runCombat,
    setAutoAttack,
    totalFreeRests,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $effect,
    $effects,
    $familiar,
    $item,
    $items,
    $location,
    $skill,
    Clan,
    get,
    have,
} from "libram";
import {
    adventureMacro,
    bu,
    castLibrams,
    familiarJacks,
    foldIfNotHave,
    getBuffs,
    setChoice,
    useDefaultFamiliar,
    useIfHave,
} from "./lib"
import {
    outfit,
    outfitML,
} from "./outfit"
import Macro from "./combat";
import {
    performSynth,
    retrieveSynth,
    SynthesisPlanner,
} from "./synth";

// Make and fight as many bricko oysters as possible
function fightOysters(): void {
    if (get("_brickoFights") < 3) {
        // Do we have oyster ingredients?
        while ((itemAmount($item`bricko eye brick`)>0) && (itemAmount($item`bricko brick`)>7)) {
            //Create the oyster
            use(8, $item`bricko brick`);
            useDefaultFamiliar();
            foldIfNotHave($item`tinsel tights`);
            // Garbo doesn't currently use otoscope, and it caps the pearls
            outfitML($items`lil' doctor bag'`);
            // The autoattack should go off here
            Macro.kill($skill`otoscope`).setAutoAttack();
            use(1, $item`bricko oyster`); runCombat(Macro.kill($skill`otoscope`).toString());
            // Flip the pearl, if possible
            autosell(1, $item`bricko pearl`);
        }
    }
}

// Set up a bunch of buffs to pump mysticality prior to levelling
function buffUp(): void {
    // Park synth predictions into preferences
    new SynthesisPlanner().plan();
    // This may require a tome summon to complete
    // But we're definitely getting the camel equip
    familiarJacks($familiar`melodramedary`);
    // Get the exp synth buff online
    if (!have($effect`synthesis: learning`)) {
        // If we need to use a tome summon on synth, it's sugar shield for exp
        // (this indexOf thing returns -1 if the item is not in the list)
        if (retrieveSynth("exp").indexOf($item`sugar shield`) > -1) {
            // Curse you pecan yahtzee!
            if (!have($item`sugar sheet`) && !have($item`sugar shield`)) useSkill(1, $skill`summon sugar sheets`);
        }
        // Well, at least at this point we can synthesise for sure
        performSynth("exp");
    }
    // Hopefully get the myst synth buff online
    if (!have($effect`synthesis: smart`)) {
        // If this needs the LOV chocolate then we have to hold for a bit
        if (retrieveSynth("myst").indexOf($item`lov extraterrestrial chocolate`) == -1) performSynth("myst");
    }
    // While we're on the topic of tome summons, hopefully get a cracker
    if (get("tomeSummons") < 3) {
        familiarJacks($familiar`exotic parrot`);
    } else {
        // Curse you pecan yahtzee! Settle for +10lb equipment
        useFamiliar($familiar`baby bugged bugbear`);
        visitUrl("arena.php");
    }
    // Cloud-talk is annoying, get it like so
    if (!have($effect`That's Just Cloud-Talk, Man`)) {
        visitUrl("place.php?whichplace=campaway&action=campaway_sky");
    }
    // Cook some potions!
    // Muscle tends to cap itself without the lemon one
    if (!get("hasRange")) bu($item`Dramatic™ range`);
    useSkill($skill`Advanced Saucecrafting`);
    if (!have($effect`Mystically Oiled`) && !have($item`ointment of the occult`)) {
        create(1, $item`ointment of the occult`);
    }
    if (!have($effect`expert oiliness`) && !have($item`oil of expertise`)) {
        create(1, $item`oil of expertise`);
    }
    if (!have($effect`concentration`) && !have($item`cordial of concentration`)) {
        create(1, $item`cordial of concentration`);
    }
    // We're about to start buffing. Let's reduce cost via magick candle
    useIfHave($item`natural magick candle`);
    // Join AfHk for VIP power
    Clan.join("Alliance from Heck");
    // Alright, let 'er rip!
    // +exp% stuff!
    getBuffs($effects`inscrutable gaze, thaumodynamic`);
    // +myst stuff! Quite a lot of it!
    getBuffs($effects`uncucumbered, get big, favored by lyle, starry-eyed, feeling excited`);
    getBuffs($effects`glittering eyelashes, votive of confidence, broad-spectrum vaccine`);
    getBuffs($effects`song of bravado, total protonic reversal, mystically oiled`);
    // The glove needs to be on to do its stat buff
    if (!have($effect`cheat code: triple size`)) {
        outfit($items`powerful glove`);
        getBuffs($effects`cheat code: triple size`);
    }
    // The three Carols to hit harder (and get a smidge more stats)
    getBuffs($effects`carol of the bulls, carol of the hells, carol of the thrills`);
    // Stuff from the beach heads
    getBuffs($effects`we're all made of starfish, do I know you from somewhere?, you learned something maybe!`);
    // Blood Bubble is quite useful too, frees up the pill keeper slot
    getBuffs($effects`blood bubble`);
    // Collect familiar runaway buffs
    if (!have($effect`nanobrainy`)) {
        useFamiliar($familiar`nanorhino`);
        if (!get("_gingerbreadClockAdvanced")) {
            // Advance the clock to make gingercity go quicker
            setChoice(1215, 1);
            // If this fails horrifically, something went wrong
            setAutoAttack(0);
            adv1($location`gingerbread civic center`);
        }
        // Get the buff (by casting noodles) and get bowlo counting down for its 9+11 NEP appearance later
        adventureMacro($location`gingerbread civic center`, Macro.trySkill($skill`entangling noodles`).trySkill($skill`bowl a curveball`));
    }
    if (!have($effect`holiday yoked`)) {
        // Use a reflex hammer to get out
        outfit($items`lil' doctor bag`);
        useFamiliar($familiar`ghost of crimbo carols`);
        // Noob Cave has a construct, and just a construct - how fortunate for us!
        adventureMacro($location`noob cave`, Macro.freeRun());
    }
    // Pump up familiar weight now that there's no accidental KO danger
    getBuffs($effects`fidoxene, billiards belligerence, puzzle champ`);
    getBuffs($effects`leash of linguini, empathy, blood bond`);
    // Alright, we're out of prep to do. Rip the early stat items and go hit things!
    outfit();
    use(1, $item`a ten-percent bonus`);
    cliExecute("bastille myst brogues");
}

// Rest in the chateau, making and fighting oysters as quickly as we have them
while (totalFreeRests() > get("timesRested")) {
    // Fish for a green candy heart, then for brickos
    castLibrams();
    // Build and fight all the oysters you can
    fightOysters();
    // Finally, a chateau rest!
    visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
}