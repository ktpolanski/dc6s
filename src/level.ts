import {
    adv1,
    autosell,
    cliExecute,
    create,
    drink,
    familiarWeight,
    inHardcore,
    itemAmount,
    myMeat,
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
    $slot,
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
    holidayCheck,
    mapMacro,
    scavenge,
    setChoice,
    useDefaultFamiliar,
    useIfHave,
} from "./lib";
import { outfit, outfitFamWeight, outfitML } from "./outfit";
import Macro from "./combat";
import { performSynth, retrieveSynth, SynthesisPlanner } from "./synth";

// Myst buffing and free fighting
export default function level(): void {
    // We're about to start casting stuff. Let's reduce cost via magick candle
    useIfHave($item`natural magick candle`);
    // Get the exp synth buff online
    if (!have($effect`Synthesis: Learning`)) {
        // Park synth predictions into preferences
        new SynthesisPlanner().plan();
        // If we need to use a tome summon on synth, it's sugar shield for exp
        // (this indexOf thing returns -1 if the item is not in the list)
        if (retrieveSynth("exp").indexOf($item`sugar shield`) > -1) {
            if (!have($item`sugar sheet`) && !have($item`sugar shield`))
                useSkill(1, $skill`Summon Sugar Sheets`);
        }
        // Well, at least at this point we can synthesise for sure
        performSynth("exp");
    }
    // Get myst synth going
    if (!have($effect`Synthesis: Smart`)) performSynth("myst");
    // Cloud-talk is annoying, get it like so
    if (!have($effect`That's Just Cloud-Talk, Man`)) {
        visitUrl("place.php?whichplace=campaway&action=campaway_sky");
    }
    // The default usage for glittery mascara is 5, we just need one
    if (!have($effect`Glittering Eyelashes`)) bu($item`glittery mascara`);
    // Cook the myst potion! Get some ingredients for said potions first!
    if (!get("hasRange")) {
        // Sell off a pork gem if there's not enough meat to pull this off
        if (myMeat() < 950) {
            if (have($item`baconstone`)) autosell(1, $item`baconstone`);
            else if (have($item`hamethyst`)) autosell(1, $item`hamethyst`);
            else autosell(1, $item`porquoise`);
        }
        bu($item`Dramatic??? range`);
    }
    if (get("reagentSummons") === 0) useSkill(1, $skill`Advanced Saucecrafting`);
    if (!get("_preventScurvy")) useSkill(1, $skill`Prevent Scurvy and Sobriety`);
    if (!have($effect`Mystically Oiled`) && !have($item`ointment of the occult`)) {
        create(1, $item`ointment of the occult`);
    }
    // Join AfHk for VIP power
    Clan.join("Alliance from Heck");
    // Alright, let 'er rip!
    // +exp% stuff!
    getBuffs($effects`Inscrutable Gaze, Thaumodynamic`);
    // Blood Bubble is quite useful, frees up the pill keeper slot
    getBuffs($effects`Blood Bubble`);
    // +myst stuff! Quite a lot of it!
    getBuffs([
        $effect`Uncucumbered`,
        $effect`Favored by Lyle`,
        $effect`Starry-Eyed`,
        $effect`Feeling Excited`,
        $effect`Song of Bravado`,
        $effect`Big`,
        $effect`Confidence of the Votive`,
        $effect`Broad-Spectrum Vaccine`,
        $effect`Total Protonic Reversal`,
        $effect`Mystically Oiled`,
        $effect`Stevedave's Shanty of Superiority`,
    ]);
    // The glove needs to be on to do its stat buff
    if (!have($effect`Triple-Sized`)) {
        outfit($items`Powerful Glove`);
        getBuffs($effects`Triple-Sized`);
    }
    // The three Carols to hit harder (and get a smidge more stats)
    getBuffs($effects`Carol of the Bulls, Carol of the Hells, Carol of the Thrills`);
    // Stuff from the beach heads
    getBuffs([
        $effect`We're All Made of Starfish`,
        $effect`Do I Know You From Somewhere?`,
        $effect`You Learned Something Maybe!`,
    ]);
    // Flip the umbrella to ML mode, just in case
    // This doesn't live inside the outfit function as the umbrella is not the default
    if (get("umbrellaState") !== "broken") cliExecute("umbrella ml");
    // Buffs done, time to start doing stuff with combats!
    // Bail from a holiday wanderer if needed, banderway #2 if so
    if (get("_banderRunaways") < 2) holidayCheck();
    // Collect familiar runaway buffs
    if (!have($effect`Nanobrainy`)) {
        useFamiliar($familiar`Nanorhino`);
        foldIfNotHave($item`tinsel tights`);
        outfit();
        if (!get("_gingerbreadClockAdvanced")) {
            // Advance the clock to make gingercity go quicker
            setChoice(1215, 1);
            // If this fails horrifically, something went wrong
            setAutoAttack(0);
            adv1($location`Gingerbread Civic Center`);
        }
        // Get the buff (by casting noodles) and get bowlo counting down for its 9+11 NEP appearance later
        adventureMacro(
            $location`Gingerbread Civic Center`,
            Macro.trySkill($skill`Entangling Noodles`).trySkill($skill`Bowl a Curveball`)
        );
        heal();
    }
    // Can't use the carol ghost for stats in softcore
    // However, Baconstoned can be popped early as spell damage comes quickly
    if (inHardcore() && !have($effect`Holiday Yoked`)) {
        useFamiliar($familiar`Ghost of Crimbo Carols`);
        foldIfNotHave($item`tinsel tights`);
        // Use a reflex hammer to get out
        outfit($items`Lil' Doctor??? bag`);
        // Noob Cave has a construct, and just a construct - how fortunate for us!
        adventureMacro($location`Noob Cave`, Macro.freeRun());
        heal();
    } else getBuffs($effects`Baconstoned`);
    // Pump up familiar weight now that there's no accidental KO danger
    getBuffs([
        $effect`Fidoxene`,
        $effect`Puzzle Champ`,
        $effect`Blood Bond`,
        $effect`Leash of Linguini`,
        $effect`Empathy`,
    ]);
    // This won't last long enough in softcore
    if (inHardcore()) getBuffs($effects`Billiards Belligerence`);
    // Add a bit of ML
    getBuffs([
        $effect`Drescher's Annoying Noise`,
        $effect`Ur-Kel's Aria of Annoyance`,
        $effect`Pride of the Puffin`,
        $effect`Lapdog`,
    ]);
    // Alright, we're out of prep to do. Rip the early stat items and go hit things!
    outfit();
    useIfHave($item`a ten-percent bonus`);
    cliExecute("bastille myst brogues");
    // Heal up as HP is now way higher
    heal();
    // Pick up Greek fire for a nice stat buff in all the upcoming fights
    if (!have($effect`Sweetbreads Flamb??`) && !have($item`Greek fire`)) {
        // This will put on the shorty for the first time in run
        // As a lot of the early stuff is no-attack or one-shots
        useDefaultFamiliar();
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit($items`protonic accelerator pack`);
        // The autoattack macro will work fine
        Macro.kill().setAutoAttack();
        Witchess.fightPiece($monster`Witchess Rook`);
        heal();
        useIfHave($item`Greek fire`);
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
        outfit($items`unbreakable umbrella`);
        // Set up one massive macro to sort out all of the monsters
        Macro.if_($monster`LOV Enforcer`, Macro.attack().repeat())
            .if_($monster`LOV Engineer`, Macro.skill($skill`Weapon of the Pastalord`).repeat())
            .if_($monster`LOV Equivocator`, Macro.kill())
            .setAutoAttack();
        // Hit up the tunnel
        TunnelOfLove.fightAll(
            "LOV Epaulettes",
            "Open Heart Surgery",
            "LOV Extraterrestrial Chocolate"
        );
        heal();
        // At this point we should have a burning newspaper in HC
    }
    // While the tentacle is technically a scaler, it caps at 400
    // So do it early
    if (!get("_eldritchHorrorEvoked")) {
        useDefaultFamiliar();
        foldIfNotHave($item`tinsel tights`);
        outfitML();
        // No saber in outfit, and this thing hurts. Spam Saucestorm
        Macro.skill($skill`Saucestorm`)
            .repeat()
            .setAutoAttack();
        useSkill(1, $skill`Evoke Eldritch Horror`);
        runCombat(
            Macro.skill($skill`Saucestorm`)
                .repeat()
                .toString()
        );
        // This should take care of possible tentacle boss combat
        // As it just sets your HP to 0
        heal();
    }
    // At this point we hit up the residual non-scaling fights
    // They're not gonna get any better, and it improves chateau yields
    if (get("_snojoFreeFights") < 10) {
        // Set the snojo if unset
        if (get("snojoSetting") === null) {
            visitUrl("place.php?whichplace=snojo&action=snojo_controller");
            runChoice(2);
        }
        // Buff up elemental resistance a bit to help with his various damage auras
        getBuffs($effects`Astral Shell, Elemental Saucesphere, Feeling Peaceful`);
        // This stupid while inside an if is needed for the VIP soak later
        while (get("_snojoFreeFights") < 10) {
            useDefaultFamiliar();
            foldIfNotHave($item`tinsel tights`);
            outfitML();
            // Don't forget to saucestorm - the ML outfit lacks the saber
            adventureMacro($location`The X-32-F Combat Training Snowman`, Macro.saucestorm());
            // This bugger can hurt! Heal with a way lower tolerance threshold
            heal(0.9);
        }
        // The snowman can apply various weird debuffs
        // The easiest way out is to just do a quick soak afterward
        cliExecute("hottub");
        // At this point the shorty should have yielded his drop in HC
    }
    // Go hit the ninja on the head
    if (!have($item`li'l ninja costume`)) {
        // Can't have the ninja falling over before the free kill happens
        useDefaultFamiliar(false);
        foldIfNotHave($item`tinsel tights`);
        // Doc bag for x-ray
        outfitML($items`Lil' Doctor??? bag`);
        mapMacro($location`The Haiku Dungeon`, $monster`amateur ninja`, Macro.setup().freeKill());
        heal();
    }
    // Do a scavenge for some stat pocket change
    scavenge();
    // Rest in the chateau, making and fighting oysters as quickly as we have them
    while (totalFreeRests() > get("timesRested")) {
        // Fish for a green candy heart, then for brickos
        castLibrams();
        // Build and fight all the oysters you can, up to three total
        if (get("_brickoFights") < 3) {
            // Do we have oyster ingredients?
            while (have($item`BRICKO eye brick`) && itemAmount($item`BRICKO brick`) > 7) {
                //Create the oyster
                use(8, $item`BRICKO brick`);
                useDefaultFamiliar();
                foldIfNotHave($item`tinsel tights`);
                // Garbo doesn't currently use otoscope, and this caps the pearls
                outfitML($items`Lil' Doctor??? bag`);
                // Don't forget the saucestorm because of no saber in the ML outfit
                Macro.saucestorm($skill`Otoscope`).setAutoAttack();
                use(1, $item`BRICKO oyster`);
                runCombat(Macro.saucestorm($skill`Otoscope`).toString());
                heal();
                // Flip the pearls
                autosell(1, $item`BRICKO pearl`);
            }
        }
        // Finally, a chateau rest!
        outfit();
        visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
    }
    // Hit up gingerbread city for the latte
    if (!have($item`gingerbread spice latte`) && !have($effect`Whole Latte Love`)) {
        // Pop a bunch of acquired familiar weight support
        // In softcore, the repaid diaper will take care of it
        if (inHardcore()) getBuffs($effects`Shortly Stacked, Heart of Green`);
        // Get some sprinkles with sprinkle dog
        if (!have($item`sprinkles`)) {
            familiarWithOrb($familiar`Chocolate Lab`);
            foldIfNotHave($item`makeshift garbage shirt`);
            outfitFamWeight();
            // Sprinkle dog needs to be 140lb fat to guarantee enough sprinkles for stuff
            // But 20lb of that can come from a meteor shower, so aim for 120lb in gear
            // Mafia currently does not seem to track Fidoxene correctly
            // Correct for it via a ternary (one-line if/else sorta thing)
            const dogWeight = have($effect`Fidoxene`)
                ? 20 + weightAdjustment()
                : familiarWeight($familiar`Chocolate Lab`) + weightAdjustment();
            if (dogWeight < 120) {
                throw "Didn't get Sprinkle Dog to 120 pounds!";
            }
            // Ok, if we're here, we're good
            // Any non-gentrifier will get us our desired 55 sprinkles
            adventureMacro(
                $location`Gingerbread Upscale Retail District`,
                Macro.if_($monster`gingerbread gentrifier`, Macro.trySkill($skill`Macrometeorite`))
                    .setup()
                    .externalIf(dogWeight < 140, Macro.trySkill($skill`Meteor Shower`))
                    .freeKill()
            );
            heal();
        }
        // Rip banderways in search of the NC, where we'll buy latte
        setChoice(1208, 3);
        while (get("_gingerbreadCityTurns") < 5) {
            gingerbreadBanderway($location`Gingerbread Upscale Retail District`);
        }
        // Now that we have the latte, may as well use it in HC
        // Hold it for later in softcore as spell damage will happen before famweight
        if (inHardcore()) useIfHave($item`gingerbread spice latte`);
    }
    // More banderways, this time in search of the cigarettes
    setChoice(1203, 4);
    while (get("_gingerbreadCityTurns") < 15) {
        gingerbreadBanderway($location`Gingerbread Civic Center`);
    }
    // Turn cigarettes into familiar charge
    while (have($item`gingerbread cigarette`)) {
        useDefaultFamiliar();
        foldIfNotHave($item`tinsel tights`);
        outfit();
        // WARNING! This yields nothing! No stats, no meat, nothing!
        // But it charges the familiar so that's good
        adventureMacro(
            $location`Gingerbread Upscale Retail District`,
            Macro.camel().tryItem($item`gingerbread cigarette`)
        );
        heal();
    }
    // Beat up the witch as brooms are good for me
    if (!have($item`battle broom`)) fightWitchessRoyalty($monster`Witchess Witch`);
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
        familiarWithOrb($familiar`Machine Elf`);
        foldIfNotHave($item`makeshift garbage shirt`);
        outfit($items`unbreakable umbrella`);
        // Chuck our second bowlo here for 7
        adventureMacro(
            $location`The Deep Machine Tunnels`,
            Macro.trySkill($skill`Bowl Sideways`).kill()
        );
        heal();
    }
    // Sort out the rest of the witchess royalty while we wait for bowlo to return
    // The queen is the best stats of them all, so kill her twice
    if (!have($item`dented scepter`)) fightWitchessRoyalty($monster`Witchess King`);
    while (get("_witchessFights") < 5) fightWitchessRoyalty($monster`Witchess Queen`);
    // At this point it's time to venture into the NEP
    // This has a bit of faff to it:
    //  1. run kramco to catch a gobbo, once done switch to umbrella
    //  2. once the familiars are all charged up, switch to goth kid for hipster fights
    //  3. do a 9+11 bowlo for as many turns of bowlo stats as possible
    //  4. get inner elf as soon as level 13 (technically likely already have it)
    //  5. rip Feel Prides late
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
            // Catch a kramco if one's up
            if (get("_sausageFights") < 2) outfit($items`Kramco Sausage-o-Matic???`);
            else outfit($items`unbreakable umbrella`);
            // The .bowloPride() handles bowling sideways
            // And tries to rip Feel Pride when the stars align... or if it's late
            adventureMacro($location`The Neverending Party`, Macro.bowloPride().kill());
            heal();
        }
        // On to the X-rays
        while (get("_chestXRayUsed") < 3) {
            // Doctor bag may try to give a quest if there's hipster fight overload, skip it
            setChoice(1340, 3);
            getInnerElf();
            useDefaultFamiliar();
            foldIfNotHave($item`makeshift garbage shirt`);
            // In hardcore, the disposable accessory is the default acc1
            // In softcore, acc3 is comparably the weakest at this point
            if (inHardcore()) outfit($items`unbreakable umbrella, Lil' Doctor??? bag`);
            else outfit([$item`unbreakable umbrella`, [$slot`acc3`, $item`Lil' Doctor??? bag`]]);
            adventureMacro($location`The Neverending Party`, Macro.bowloPride().setup().freeKill());
            heal();
        }
        // Prepare the missile launcher
        // Just pre-fuel the thing all the way to avoid moon tuning surprises
        if (!AsdonMartin.fillWithInventoryTo(174)) throw "Breadcar refuses to charge to 174!";
        // Do non-X-ray free kills
        while (freeKillsLeft() > 0) {
            getInnerElf();
            useDefaultFamiliar();
            // There is a possibility that the garbage shirt may run out of charge
            if (get("garbageShirtCharge") > 0) {
                foldIfNotHave($item`makeshift garbage shirt`);
            } else foldIfNotHave($item`tinsel tights`);
            outfit($items`unbreakable umbrella`);
            adventureMacro($location`The Neverending Party`, Macro.bowloPride().setup().freeKill());
            heal();
        }
    }
    // And so ends levelling. Celebrate with a drink, and onward to tests!
    useIfHave($item`astral six-pack`);
    if (itemAmount($item`astral pilsner`) === 6) {
        getBuffs($effects`Ode to Booze`);
        drink(3, $item`astral pilsner`);
    }
}
