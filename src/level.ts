import {
    adv1,
    autosell,
    cliExecute,
    create,
    drink,
    equip,
    itemAmount,
    familiarWeight,
    runCombat,
    setAutoAttack,
    totalFreeRests,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
    weightAdjustment,
} from "kolmafia";
import {
    $effect,
    $effects,
    $familiar,
    $item,
    $items,
    $location,
    $monster,
    $skill,
    Clan,
    get,
    have,
    TunnelOfLove,
    Witchess,
} from "libram";
import {
    adventureMacro,
    bu,
    bustGhost,
    castLibrams,
    familiarJacks,
    foldIfNotHave,
    freeKillsLeft,
    getBuffs,
    getInnerElf,
    mapMacro,
    setChoice,
    useDefaultFamiliar,
    useIfHave,
} from "./lib"
import {
    outfit,
    outfitFamWeight,
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
            // Garbo doesn't currently use otoscope, and this caps the pearls
            outfitML($items`lil' doctor bag'`);
            // Don't forget the geyser because of no saber in the ML outfit
            Macro.geyser($skill`otoscope`).setAutoAttack();
            use(1, $item`bricko oyster`); runCombat(Macro.geyser($skill`otoscope`).toString());
            // Flip the pearls
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
    getBuffs($effects`uncucumbered, big, favored by lyle, starry-eyed, feeling excited`);
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
        foldIfNotHave($item`tinsel tights`);
        outfit();
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
        useFamiliar($familiar`ghost of crimbo carols`);
        foldIfNotHave($item`tinsel tights`);
        // Use a reflex hammer to get out
        outfit($items`lil' doctor bag`);
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

// Perform the levelling by hitting things with the May 2019 IotM, the saber
function beatStuffUp(): void {
    // Pick up Greek fire for a nice stat buff in all the upcoming fights
    if (!have($effect`Sweetbreads Flambé`) && !have($item`greek fire`)) {
        // Manually override the familiar to shorty to get the drop prior to sprinkle dog
        // And this fight is fine for an attacking familiar
        if (!have($item`short stack of pancakes`) && !have($effect`shortly stacked`)) {
            useFamiliar($familiar`shorter-order cook`);
            equip($item`miniature crystal ball`);
        } else useDefaultFamiliar();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit($items`protonic accelerator pack`);
        // The autoattack macro will work fine
        Macro.kill().setAutoAttack();
        Witchess.fightPiece($monster`witchess rook`);
        useIfHave($item`greek fire`);
    }
    // Bust a ghost
    bustGhost();
    // Do LOV
    if (!get("_loveTunnelUsed")) {
        useDefaultFamiliar();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        // Set up one massive macro to sort out all of the monsters
        Macro.if_($monster`lov enforcer`, Macro.attack().repeat())
            .if_($monster`lov engineer`, Macro.skill($skill`weapon of the pastalord`).repeat())
            .if_($monster`lov equivocator`, Macro.kill())
            .setAutoAttack();
        // Hit up the tunnel
        TunnelOfLove.fightAll(
            "LOV Epaulettes",
            "Open Heart Surgery",
            "LOV Extraterrestrial Chocolate"
        );
        // At this point we should have a burning newspaper
        // Sort out delayed myst synth if it needs the chocolate
        if (!have($effect`synthesis: smart`)) performSynth("myst");
    }
    // At this point we hit up the residual non-scaling fights
    // They're not gonna get any better, and it improves chateau yields
    if (get("_snojoFreeFights") < 10) {
        // This stupid while inside an if is needed for the VIP soak later
        while (get("_snojoFreeFights") < 10) {
            useDefaultFamiliar();
            foldIfNotHave($item`tinsel tights`);
            outfitML();
            // Don't forget to geyser - the ML outfit lacks the saber
            adventureMacro($location`The X-32-F Combat Training Snowman`, Macro.geyser());
        }
        // The snowman can apply various weird debuffs
        // The easiest way out is to just do a quick soak afterward
        cliExecute("hottub");
        // At this point the shorty should have yielded his drop
    }
    // Go hit the ninja on the head
    if (!have($item`li'l ninja costume`)) {
        useDefaultFamiliar();
        foldIfNotHave($item`tinsel tights`);
        // Doc bag for x-ray
        outfitML($items`lil' doctor bag`);
        mapMacro($location`The Haiku Dungeon`, $monster`amateur ninja`, Macro.setup().freeKill());
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
    // Hit up gingerbread city for the latte
    if (!have($item`gingerbread spice latte`) && !have($effect`whole latte love`)) {
        // Pop a bunch of acquired familiar weight support
        getBuffs($effects`shortly stacked, heart of green`);
        // Get some sprinkles with sprinkle dog
        if (!have($item`sprinkles`)) {
            useFamiliar($familiar`chocolate lab`);
            equip($item`miniature crystal ball`);
            foldIfNotHave($item`makeshift garbage shirt`);
            outfitFamWeight();
            // Sprinkle dog needs to be 140lb fat to guarantee enough sprinkles for stuff
            if ((familiarWeight($familiar`chocolate lab`) + weightAdjustment()) < 140) {
                throw "Didn't get Sprinkle Dog to 140 pounds!"
            }
            // Ok, if we're here, we're good
            // Any non-gentrifier will get us our desired 55 sprinkles
            adventureMacro($location`gingerbread upscale retail district`, 
                Macro.if_($monster`gingerbread gentrifier`, Macro.trySkill($skill`macrometeorite`))
                    .setup().freeKill()
            );
        }
        // Rip banderways in search of the NC, where we'll buy latte
        setChoice(1208, 3);
        while (get("_gingerbreadCityTurns") < 5) {
            gingerbreadBanderway($location`gingerbread upscale retail district`);
        }
        // Now that we have the latte, may as well use it
        useIfHave($item`gingerbread spice latte`);
    }
    // More banderways, this time in search of the cigarettes
    setChoice(1203, 4);
    while (get("_gingerbreadCityTurns") < 15) {
        gingerbreadBanderway($location`gingerbread civic center`);
    }
    // Turn cigarettes into familiar charge
    while (have($item`gingerbread cigarette`)) {
        useDefaultFamiliar();
        foldIfNotHave($item`tinsel tights`);
        outfit();
        // WARNING! This yields nothing! No stats, no meat, nothing!
        // But it charges the familiar so that's good
        adventureMacro($location`gingerbread upscale retail district`, Macro.tryItem($item`gingerbread cigarette`));
    }
    // Beat up the witch as brooms are good for me
    if (!have($item`battle broom`)) {
        useDefaultFamiliar();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        // The witchess royalty don't allow for combat finesse
        Macro.attack().repeat().setAutoAttack();
        Witchess.fightPiece($monster`witchess witch`);
    }
    // God Lobster time
    while (get("_godLobsterFights") < 3) {
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        globMacro(Macro.kill());
    }
    // DMT time
    while (get("_machineTunnelsAdv") < 5) {
        // Somewhere around here we might as well start checking Inner Elf eligibility
        getInnerElf();
        useFamiliar($familiar`machine elf`);
        equip($item`miniature crystal ball`);
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        // Chuck our second bowlo here for 7
        adventureMacro($location`the deep machine tunnels`,
            Macro.trySkill($skill`bowl sideways`).kill()
        );
    }
    // Sort out the rest of the witchess royalty while we wait for bowlo to return
    if (!have($item`dented scepter`)) {
        getInnerElf();
        useDefaultFamiliar();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        Macro.attack().repeat().setAutoAttack();
        Witchess.fightPiece($monster`witchess king`);
    }
    // The queen is the best stats of them all, so kill her twice
    while (get("_witchessFights") < 5) {
        getInnerElf();
        useDefaultFamiliar();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        Macro.attack().repeat().setAutoAttack();
        Witchess.fightPiece($monster`witchess queen`);
    }
    // At this point it's time to venture into the NEP
    // This has a bit of faff to it:
    //  1. run kramco to catch as many gobbos as possible
    //  2. once the camel is charged, switch to leftie with the scrapbook
    //  3. do a 9+11 bowlo for as many turns of bowlo stats as possible
    //  4. get inner elf as soon as level 13 (technically may already have it)
    //  5. once 2-4 align, rip Feel Prides
    // This is handled via the various called functions
    if (freeKillsLeft() > 0) {
        // Screw quests (skip), screw NCs (fight)
        setChoice(1322, 2);
        setChoice(1324, 5);
        // Start off with free fights
        while (get("_neverendingPartyFreeTurns") < 10) {
            getInnerElf();
            useDefaultFamiliar();
            foldIfNotHave($item`makeshift garbage shirt`);
            outfit($items`Kramco Sausage-o-Matic™`);
            // Special bit of logic to handle bowlo and Feel Pride in .NEP()
            adventureMacro($location`the neverending party`, Macro.NEP().kill());
        }
        // On to the X-rays
        while (get("_chestXRayUsed") < 3) {
            getInnerElf();
            useDefaultFamiliar();
            foldIfNotHave($item`makeshift garbage shirt`);
            outfit($items`Kramco Sausage-o-Matic™, lil' doctor bag`);
            // No time for value finesse, lefty might kill the mob
            adventureMacro($location`the neverending party`, Macro.NEP().freeKill());
        }
        // Prepare the missile launcher
        if (!AsdonMartin.fillWithInventoryTo(100)) throw "Breadcar refuses to charge to 100!"
        while (freeKillsLeft() > 0) {
            getInnerElf();
            useDefaultFamiliar();
            foldIfNotHave($item`makeshift garbage shirt`);
            outfit($items`Kramco Sausage-o-Matic™`);
            adventureMacro($location`the neverending party`, Macro.NEP().freeKill());
        }
    }
    // And so ends levelling. Celebrate with a drink, and onward to tests!
    useIfHave($item`astral six-pack`);
    if (itemAmount($item`astral pilsner`) == 6)
        getBuffs($effects`the ode to booze`);
        drink(3, $item`astral pilsner`);
    }
}