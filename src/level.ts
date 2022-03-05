import {
    adv1,
    autosell,
    buy,
    cliExecute,
    create,
    drink,
    equip,
    itemAmount,
    familiarWeight,
    runChoice,
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
    AsdonMartin,
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
    familiarWithOrb,
    fightWitchessRoyalty,
    foldIfNotHave,
    freeKillsLeft,
    getBuffs,
    getInnerElf,
    gingerbreadBanderway,
    globMacro,
    heal,
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

// Myst buffing and free fighting
export default function level(): void {
    // We're about to start casting stuff. Let's reduce cost via magick candle
    useIfHave($item`natural magick candle`);
    // Get the exp synth buff online
    if (!have($effect`synthesis: learning`)) {
        // Park synth predictions into preferences
        new SynthesisPlanner().plan();
        // If we need to use a tome summon on synth, it's sugar shield for exp
        // (this indexOf thing returns -1 if the item is not in the list)
        if (retrieveSynth("exp").indexOf($item`sugar shield`) > -1) {
            if (!have($item`sugar sheet`) && !have($item`sugar shield`)) useSkill(1, $skill`summon sugar sheets`);
        }
        // Well, at least at this point we can synthesise for sure
        performSynth("exp");
    }
    // Get myst synth going
    if (!have($effect`synthesis: smart`)) performSynth("myst");
    // Cloud-talk is annoying, get it like so
    if (!have($effect`That's Just Cloud-Talk, Man`)) {
        visitUrl("place.php?whichplace=campaway&action=campaway_sky");
    }
    // Cook some potions!
    // Muscle tends to cap itself without the lemon one
    if (!get("hasRange")) bu($item`Dramatic™ range`);
    if (get("reagentSummons") == 0) useSkill($skill`Advanced Saucecrafting`);
    if (!have($effect`Mystically Oiled`) && !have($item`ointment of the occult`)) {
        create(1, $item`ointment of the occult`);
    }
    if (!have($effect`expert oiliness`) && !have($item`oil of expertise`)) {
        create(1, $item`oil of expertise`);
    }
    if (!have($effect`concentration`) && !have($item`cordial of concentration`)) {
        create(1, $item`cordial of concentration`);
    }
    // Join AfHk for VIP power
    Clan.join("Alliance from Heck");
    // Alright, let 'er rip!
    // +exp% stuff!
    getBuffs($effects`inscrutable gaze, thaumodynamic`);
    // Blood Bubble is quite useful, frees up the pill keeper slot
    getBuffs($effects`blood bubble`);
    // +myst stuff! Quite a lot of it!
    getBuffs($effects`uncucumbered, favored by lyle, starry-eyed, feeling excited, song of bravado`);
    getBuffs($effects`glittering eyelashes, big, Confidence of the Votive, broad-spectrum vaccine`);
    getBuffs($effects`total protonic reversal, mystically oiled,  Stevedave's Shanty of Superiority`);
    // The glove needs to be on to do its stat buff
    if (!have($effect`triple-sized`)) {
        outfit($items`powerful glove`);
        getBuffs($effects`triple-sized`);
    }
    // The three Carols to hit harder (and get a smidge more stats)
    getBuffs($effects`carol of the bulls, carol of the hells, carol of the thrills`);
    // Stuff from the beach heads
    getBuffs($effects`we're all made of starfish, do I know you from somewhere?, you learned something maybe!`);
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
        heal();
    }
    if (!have($effect`holiday yoked`)) {
        useFamiliar($familiar`ghost of crimbo carols`);
        foldIfNotHave($item`tinsel tights`);
        // Use a reflex hammer to get out
        outfit($items`Lil' Doctor™ bag`);
        // Noob Cave has a construct, and just a construct - how fortunate for us!
        adventureMacro($location`noob cave`, Macro.freeRun());
        heal();
    }
    // Set up the hatter buff
    if (!have($effect`you can really taste the dormouse`)) {
        // Get the drink me potion, and the magical hat
        visitUrl("clan_viplounge.php?action=lookingglass&whichfloor=2");
        if (!have($item`sombrero-mounted sparkler`)) buy(1, $item`sombrero-mounted sparkler`);
    }
    // Pump up familiar weight now that there's no accidental KO danger
    getBuffs($effects`fidoxene, billiards belligerence, puzzle champ, blood bond`);
    getBuffs($effects`leash of linguini, empathy, you can really taste the dormouse`);
    // Add a bit of ML
    getBuffs($effects`drescher's annoying noise`);
    // Alright, we're out of prep to do. Rip the early stat items and go hit things!
    outfit();
    use(1, $item`a ten-percent bonus`);
    cliExecute("bastille myst brogues");
    // Heal up as HP is now way higher
    heal();
    // Pick up Greek fire for a nice stat buff in all the upcoming fights
    if (!have($effect`Sweetbreads Flambé`) && !have($item`greek fire`)) {
        // This will put on the shorty for the first time in run
        // As a lot of the early stuff is no-attack or one-shots
        useDefaultFamiliar();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit($items`protonic accelerator pack`);
        // The autoattack macro will work fine
        Macro.kill().setAutoAttack();
        Witchess.fightPiece($monster`witchess rook`);
        heal();
        useIfHave($item`greek fire`);
    }
    // Bust a ghost
    bustGhost();
    // Do LOV
    if (!get("_loveTunnelUsed")) {
        // There's a full MP restore in there, use what we have now
        castLibrams();
        // Attack familiars screw up elixir drops
        useDefaultFamiliar(false);
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
        heal();
        // At this point we should have a burning newspaper
    }
    // At this point we hit up the residual non-scaling fights
    // They're not gonna get any better, and it improves chateau yields
    if (get("_snojoFreeFights") < 10) {
        // Set the snojo if unset
        if (get("snojoSetting") === null) {
            visitUrl("place.php?whichplace=snojo&action=snojo_controller");
            runChoice(2);
        }
        // This stupid while inside an if is needed for the VIP soak later
        while (get("_snojoFreeFights") < 10) {
            useDefaultFamiliar();
            foldIfNotHave($item`tinsel tights`);
            outfitML();
            // Don't forget to geyser - the ML outfit lacks the saber
            adventureMacro($location`The X-32-F Combat Training Snowman`, Macro.geyser());
            heal();
        }
        // The snowman can apply various weird debuffs
        // The easiest way out is to just do a quick soak afterward
        cliExecute("hottub");
        // At this point the shorty should have yielded his drop
    }
    // Go hit the ninja on the head
    if (!have($item`li'l ninja costume`)) {
        // Can't have the ninja falling over before the free kill happens
        useDefaultFamiliar(false);
        foldIfNotHave($item`tinsel tights`);
        // Doc bag for x-ray
        outfitML($items`Lil' Doctor™ bag`);
        mapMacro($location`The Haiku Dungeon`, $monster`amateur ninja`, Macro.setup().freeKill());
        heal();
    }
    // Do a scavenge for some stat pocket change
    if (get("_daycareGymScavenges") == 0) {
        outfit();
        visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
        // Go into the daycare, and do a scavenge
        runChoice(3); runChoice(2);
        // Still in the noncombats - these two choices leave them
        runChoice(5); runChoice(4);
    }
    // Rest in the chateau, making and fighting oysters as quickly as we have them
    while (totalFreeRests() > get("timesRested")) {
        // Fish for a green candy heart, then for brickos
        castLibrams();
        // Build and fight all the oysters you can, up to three total
        if (get("_brickoFights") < 3) {
            // Do we have oyster ingredients?
            while (have($item`bricko eye brick`) && (itemAmount($item`bricko brick`)>7)) {
                //Create the oyster
                use(8, $item`bricko brick`);
                useDefaultFamiliar();
                foldIfNotHave($item`tinsel tights`);
                // Garbo doesn't currently use otoscope, and this caps the pearls
                outfitML($items`Lil' Doctor™ bag`);
                // Don't forget the geyser because of no saber in the ML outfit
                Macro.geyser($skill`otoscope`).setAutoAttack();
                use(1, $item`bricko oyster`); runCombat(Macro.geyser($skill`otoscope`).toString());
                heal();
                // Flip the pearls
                autosell(1, $item`bricko pearl`);
            }
        }
        // Finally, a chateau rest!
        visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
    }
    // Hit up gingerbread city for the latte
    if (!have($item`gingerbread spice latte`) && !have($effect`whole latte love`)) {
        // Pop a bunch of acquired familiar weight support
        getBuffs($effects`shortly stacked, heart of green`);
        // Get some sprinkles with sprinkle dog
        if (!have($item`sprinkles`)) {
            familiarWithOrb($familiar`chocolate lab`);
            foldIfNotHave($item`makeshift garbage shirt`);
            outfitFamWeight();
            // TODO: CANNOT GUARANTEE 55 SPRINKLES, DOG IS ONLY 136 LB!!!
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
            heal();
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
        heal();
    }
    // Beat up the witch as brooms are good for me
    if (!have($item`battle broom`)) fightWitchessRoyalty($monster`witchess witch`);
    // God Lobster time
    while (get("_godLobsterFights") < 3) {
        // Somewhere around here we might as well start checking Inner Elf eligibility
        getInnerElf();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        globMacro(Macro.kill());
        heal();
    }
    // DMT time
    while (get("_machineTunnelsAdv") < 5) {
        getInnerElf();
        familiarWithOrb($familiar`machine elf`);
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit();
        // Chuck our second bowlo here for 7
        adventureMacro($location`the deep machine tunnels`,
            Macro.trySkill($skill`bowl sideways`).kill()
        );
        heal();
    }
    // Sort out the rest of the witchess royalty while we wait for bowlo to return
    // The queen is the best stats of them all, so kill her twice
    if (!have($item`dented scepter`)) fightWitchessRoyalty($monster`witchess king`);
    while (get("_witchessFights") < 5) fightWitchessRoyalty($monster`witchess queen`);
    // At this point it's time to venture into the NEP
    // This has a bit of faff to it:
    //  1. run kramco to catch as many gobbos as possible
    //  2. once the camel is charged, switch to goth kid for hipster fights
    //  3. do a 9+11 bowlo for as many turns of bowlo stats as possible
    //  4. get inner elf as soon as level 13 (technically likely already have it)
    //  5. rip Feel Prides, putting the familiar scrapbook on for those turns for max gains
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
            // The .bowloPride() handles bowling sideways
            // And tries to rip Feel Pride when the stars align... or if it's late
            adventureMacro($location`the neverending party`, Macro.bowloPride().kill());
            heal();
        }
        // On to the X-rays
        while (get("_chestXRayUsed") < 3) {
            getInnerElf();
            useDefaultFamiliar();
            foldIfNotHave($item`makeshift garbage shirt`);
            outfit($items`Kramco Sausage-o-Matic™, Lil' Doctor™ bag`);
            adventureMacro($location`the neverending party`, Macro.bowloPride().setup().freeKill());
            heal();
        }
        // Prepare the missile launcher
        // Just pre-fuel the thing all the way to avoid moon tuning surprises
        if (!AsdonMartin.fillWithInventoryTo(174)) throw "Breadcar refuses to charge to 174!"
        // Do non-X-ray free kills
        while (freeKillsLeft() > 0) {
            getInnerElf();
            useDefaultFamiliar();
            foldIfNotHave($item`makeshift garbage shirt`);
            // Make good conditions for Feel Pride by putting on the scrapbook
            if ((get("_feelPrideUsed")<3) && (get("cosmicBowlingBallReturnCombats")>0)) {
                // If the bowlo countdown is 0, then it will return this combat
                outfit();
            } else {
                // Feel Pride won't happen this combat. Fish for kramcos
                outfit($items`Kramco Sausage-o-Matic™`);
            }
            adventureMacro($location`the neverending party`, Macro.bowloPride().setup().freeKill());
            heal();
        }
    }
    // And so ends levelling. Celebrate with a drink, and onward to tests!
    useIfHave($item`astral six-pack`);
    if (itemAmount($item`astral pilsner`) == 6) {
        getBuffs($effects`ode to booze`);
        drink(3, $item`astral pilsner`);
    }
}