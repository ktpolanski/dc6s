import {
    adv1,
    changeMcd,
    cliExecute,
    create,
    elementalResistance,
    equip,
    handlingChoice,
    inHardcore,
    myHp,
    myMaxhp,
    myThrall,
    retrieveItem,
    runChoice,
    runCombat,
    setAutoAttack,
    toInt,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $effect,
    $effects,
    $element,
    $familiar,
    $item,
    $items,
    $location,
    $monster,
    $skill,
    $slot,
    $thrall,
    AsdonMartin,
    CombatLoversLocket,
    get,
    have,
    set,
} from "libram";
import {
    adventureMacro,
    bjornify,
    bu,
    bustGhost,
    castLibrams,
    familiarJacks,
    familiarWithGear,
    foldIfNotHave,
    getBuffs,
    getInnerElf,
    heal,
    holidayCheck,
    saberCheese,
    setChoice,
    setParka,
    useIfHave,
} from "./lib";
import Macro from "./combat";
import {
    outfitCoilWire,
    outfitEarly,
    outfitFamWeight,
    outfitHotRes,
    outfitItem,
    outfitMoxie,
    outfitMuscle,
    outfitMysticality,
    outfitNoncombat,
    outfitSpell,
    outfitWeapon,
} from "./outfit";

// Prepare for coil wire, i.e. do early run stuff
export function coilWirePrep(): void {
    // Bail from a holiday wanderer if needed, banderway #1 if so
    if (get("_banderRunaways") < 1) holidayCheck();
    // Pre-coil fights are quite minimal on buffs, not enough mana to go ham
    getBuffs($effects`Inscrutable Gaze, Feeling Excited`);
    // Go rip a shrub red ray real quick
    if (!have($effect`Everything Looks Red`)) {
        familiarWithGear($familiar`Crimbo Shrub`);
        // Decorate Crimbo Shrub with LED Mandala, Jack-O-Lantern Lights, Popcorn Strands, and Big Red-Wrapped Presents
        if (!get("_shrubDecorated")) {
            const decorations = toInt($item`box of old Crimbo decorations`);
            visitUrl(`inv_use.php?pwd=&which=99&whichitem=${decorations}`);
            visitUrl(`choice.php?whichchoice=999&pwd=&option=1&topper=2&lights=5&garland=3&gift=2`);
        }
        foldIfNotHave($item`tinsel tights`);
        // Put on the scrapbook to get a scrap off the shrub doing stuff
        // The bjorn to try to chance a garbage fire drop
        // And the doc bag to run away with a reflex hammer
        outfitEarly($items`familiar scrapbook, Buddy Bjorn, Lil' Doctor™ bag`);
        bjornify($familiar`Garbage Fire`);
        // 100% spooky zone, shrub tuned to spooky, monsters won't die
        adventureMacro(
            $location`The Skeleton Store`,
            Macro.trySkill($skill`Open a Big Red Present`).freeRun()
        );
        // The above will catch the opening NC, go again
        if (!have($effect`Everything Looks Red`)) {
            adventureMacro(
                $location`The Skeleton Store`,
                Macro.trySkill($skill`Open a Big Red Present`).freeRun()
            );
        }
        // Do a quick soak to heal up as early mana is scarce
        if (myHp() < 0.5 * myMaxhp()) cliExecute("hottub");
    }
    // Set up MCD on 10 now that shrub has provided us with some funds
    retrieveItem(1, $item`detuned radio`);
    changeMcd(10);
    // Get an accordion and sewer items
    retrieveItem(1, $item`toy accordion`);
    while (!have($item`turtle totem`)) {
        bu($item`chewing gum on a string`);
    }
    while (!have($item`saucepan`)) {
        bu($item`chewing gum on a string`);
    }
    // Catch a kramco with the mimic out, and a paranormal prediction to boot
    if (!have($item`bag of many confections`)) {
        useFamiliar($familiar`Stocking Mimic`);
        foldIfNotHave($item`tinsel tights`);
        outfitEarly($items`protonic accelerator pack, Kramco Sausage-o-Matic™`);
        adventureMacro($location`Noob Cave`, Macro.kill());
        heal();
        // Take the bag of many confections off
        equip($slot`familiar`, $item`none`);
    }
    // We got a ghost to bust
    bustGhost();
    // Okay, that's it for the early stuff! Put on the outfit and go coil some wire!
    // The outfit maximises MP so as much of it is available after the test as possible
    outfitCoilWire();
    castLibrams();
}

// Prepare for the moxie test
export function moxiePrep(): void {
    // Ensure equaliser and gaze
    if (myThrall() !== $thrall`penne dreadful`) useSkill(1, $skill`Bind Penne Dreadful`);
    getBuffs($effects`Blessing of the Bird, Quiet Desperation`);
    // Stick on outfit
    outfitMoxie();
}

// Prepare for the HP test
export function hpPrep(): void {
    // Ensure equalizer and gaze
    if (myThrall() !== $thrall`elbow macaroni`) useSkill(1, $skill`Bind Undead Elbow Macaroni`);
    getBuffs($effects`Quiet Determination`);
    // Stick on outfit... just go with muscle
    outfitMuscle();
}

// Prepare for the muscle test
export function musclePrep(): void {
    // Ensure equalizer and gaze
    if (myThrall() !== $thrall`elbow macaroni`) useSkill(1, $skill`Bind Undead Elbow Macaroni`);
    getBuffs($effects`Quiet Determination`);
    // Stick on outfit
    outfitMuscle();
}

// Prepare for the mysticality test
export function mysticalityPrep(): void {
    // Get rid of equalizer thralls, they've done their job
    if (myThrall() !== $thrall`none`) useSkill(1, $skill`Dismiss Pasta Thrall`);
    // Stick on outfit
    outfitMysticality();
}

// Prepare for the hot resistance test
export function hotResPrep(): void {
    // Ensure buffs
    getBuffs($effects`Feeling Peaceful, Empathy, Elemental Saucesphere, Astral Shell`);
    // Collect extinguisher foam and a cloake buff via saber cheese
    if (!have($effect`Fireproof Foam Suit`)) {
        // The outfit has the saber and the extinguisher in it already
        outfitHotRes($items`vampyric cloake`);
        saberCheese(
            Macro.trySkill($skill`Become a Cloud of Mist`).trySkill(
                $skill`Fire Extinguisher: Foam Yourself`
            )
        );
        // Need to fix preferences as saber autoattack means mafia doesn't see these being used
        set("_vampyreCloakeFormUses", get("_vampyreCloakeFormUses") + 1);
        set("_fireExtinguisherCharge", get("_fireExtinguisherCharge") - 10);
    }
    // Stick on outfit proper
    outfitHotRes();
}

// Prepare for the noncombat test
export function noncombatPrep(): void {
    // Fuel up asdon for buffing purposes
    if (!have($effect`Driving Stealthily`)) {
        if (!AsdonMartin.fillWithInventoryTo(37)) throw "Breadcar refuses to charge to 37!";
    }
    // Get buffs
    getBuffs([
        $effect`The Sonata of Sneakiness`,
        $effect`Smooth Movements`,
        $effect`Gummed Shoes`,
        $effect`Empathy`,
        $effect`Throwing Some Shade`,
        $effect`Feeling Lonely`,
        $effect`Driving Stealthily`,
        $effect`Blessing of the Bird`,
    ]);
    // Apply outfit...
    outfitNoncombat();
    // ...and get one more buff, as the outfit features the powerful glove
    getBuffs($effects`Invisible Avatar`);
}

// Prepare for the familiar weight test
export function famWeightPrep(): void {
    // Acquire saber cheesed meteor shower
    if (!have($effect`Meteor Showered`)) {
        useFamiliar($familiar`none`);
        equip($item`Fourth of May Cosplay Saber`);
        saberCheese(Macro.trySkill($skill`Meteor Shower`));
        // Auto-attack saber means mafia doesn't get to see the meteor shower, let it know
        set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
    }
    // We want to be platypus for aftercore anyway, so let's save a turn here while we're at it
    if (!get("moonTuned")) cliExecute("spoon platypus");
    // Prepare for the hatter buff
    if (!have($effect`You Can Really Taste the Dormouse`)) {
        // Get the drink me potion, and the magical hat
        visitUrl("clan_viplounge.php?action=lookingglass&whichfloor=2");
        retrieveItem(1, $item`sombrero-mounted sparkler`);
    }
    // Most buffs should be on from levelling, as they get used early to make familiar go brrr
    getBuffs([
        $effect`Leash of Linguini`,
        $effect`Empathy`,
        $effect`Blood Bond`,
        $effect`Robot Friends`,
        $effect`Billiards Belligerence`,
        $effect`Shortly Stacked`,
        $effect`Whole Latte Love`,
        $effect`You Can Really Taste the Dormouse`,
    ]);
    outfitFamWeight();
    // Time for comma cheese
    if (get("commaFamiliar") !== $familiar`Homemade Robot`) {
        // Get the homemade robot's equip for transformation purposes
        familiarJacks($familiar`Homemade Robot`);
        useFamiliar($familiar`Comma Chameleon`);
        // Need to put the gear into the comma, unfortunately via URL
        visitUrl("inv_equip.php?which=2&action=equip&whichitem=6102&pwd");
        // And then revisit the character pane as that's important for this to register
        visitUrl("charpane.php");
    }
}

// Prepare for the weapon damage test
export function weaponPrep(): void {
    // Buff up
    getBuffs([
        $effect`Song of the North`,
        $effect`Carol of the Bulls`,
        $effect`Blessing of the Bird`,
        $effect`The Power of LOV`,
        $effect`Frenzied, Bloody`,
        $effect`Imported Strength`,
    ]);
    // These two can be skipped due to Stick-Knife in softcore
    if (inHardcore()) getBuffs($effects`Lack of Body-Building, Billiards Belligerence`);
    // Acquire Inner Elf for test purposes
    getInnerElf();
    // Get carol ghost buff
    if (!have($effect`Do You Crush What I Crush?`)) {
        useFamiliar($familiar`Ghost of Crimbo Carols`);
        // Use a latte throw to get out
        equip($item`latte lovers member's mug`);
        // May as well hope for a garbage fire bjorn drop
        if (have($item`Buddy Bjorn`)) equip($item`Buddy Bjorn`);
        bjornify($familiar`Garbage Fire`);
        // The Dire Warren has a beast, and just a beast - how fortunate for us!
        adventureMacro($location`The Dire Warren`, Macro.freeRun());
    }
    // Since these are the last moments before Cowrruption, which is going to demolish HP
    // Acquire Deep Dark Visions now
    if (!have($effect`Visions of the Deep Dark Deeps`)) {
        useFamiliar($familiar`Exotic Parrot`);
        outfitFamWeight();
        getBuffs($effects`Elemental Saucesphere, Astral Shell`);
        // Just in case, to avoid disappointment
        if (elementalResistance($element`spooky`) < 10)
            throw "Can't get enough spooky resistance for DDV!";
        // DDV needs 500 HP minimum
        if (myMaxhp() < 500 && !have($effect`Song of Starch`)) useSkill(1, $skill`Song of Starch`);
        // This thing slaps the HP hard
        heal();
        useSkill(1, $skill`Deep Dark Visions`);
        heal();
    }
    // Alright, camel, time for your great moment! The combat that does all the things!
    // Spit on me, and a meteor shower, and sabering out!
    if (!have($effect`Meteor Showered`)) {
        // ...actually, camel, maybe you did your thing already
        // If in softcore, then the buff was gotten during levelling
        if (inHardcore()) useFamiliar($familiar`Melodramedary`);
        equip($item`Fourth of May Cosplay Saber`);
        // Saber items
        setChoice(1387, 3);
        Macro.trySkill($skill`%fn, spit on me!`)
            .trySkill($skill`Meteor Shower`)
            .skill($skill`Use the Force`)
            .setAutoAttack();
        CombatLoversLocket.reminisce($monster`ungulith`);
        // Backup macro submission just in case - autoattack works though
        runCombat(
            Macro.trySkill($skill`%fn, spit on me!`)
                .trySkill($skill`Meteor Shower`)
                .skill($skill`Use the Force`)
                .toString()
        );
        // Saber stuff
        if (handlingChoice()) runChoice(-1);
        // Auto-attack saber means mafia doesn't get to see the things being used, let it know
        // 1932 is the ungulith ID, make locket uses know
        if (get("_locketMonstersFought") === "") set("_locketMonstersFought", "1932");
        else set("_locketMonstersFought", `${get("_locketMonstersFought")},1932`);
        set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
        // The spit happened earlier in a less screwy manner in softcore
        if (inHardcore()) set("camelSpit", 0);
    }
    // Suit up, add the last few buffs...
    outfitWeapon();
    getBuffs($effects`Cowrruption, Bow-Legged Swagger`);
}

// Prepare for spell damage test
export function spellPrep(): number {
    // Start off with Simmer so it doesn't muck anything up later
    getBuffs($effects`Simmering`);
    // Acquire some constituent pieces
    if (!have($effect`Sigils of Yeg`) && !have($item`Yeg's Motel hand soap`)) {
        cliExecute("cargo 177");
    }
    if (!have($effect`Pisces in the Skyces`) && !have($item`Ye Wizard's Shack snack voucher`)) {
        useSkill(1, $skill`Summon Alice's Army Cards`);
    }
    // Cook the spell damage potion
    if (!have($effect`Concentration`) && !have($item`cordial of concentration`)) {
        create(1, $item`cordial of concentration`);
    }
    // There may be a resolution. But there also may not
    useIfHave($item`resolution: be feistier`);
    // Now that that's done, other stuff! A LOT of it!
    getBuffs([
        $effect`Spirit of Garlic`,
        $effect`Jackasses' Symphony of Destruction`,
        $effect`Arched Eyebrow of the Archmage`,
        $effect`Carol of the Hells`,
        $effect`Mental A-cue-ity`,
        $effect`Song of Sauce`,
        $effect`The Magic of LOV`,
        $effect`Sigils of Yeg`,
        $effect`Concentration`,
        $effect`Baconstoned`,
        $effect`Pisces in the Skyces`,
        $effect`Grumpy and Ornery`,
        $effect`Imported Strength`,
    ]);
    // Traditionally Inner Elf
    getInnerElf();
    // Two birds with one stone - meteor shower and mini-adventurer buff
    if (!have($effect`Meteor Showered`) && get("_meteorShowerUses") < 5) {
        if (!have($effect`Saucefingers`)) {
            familiarWithGear($familiar`Mini-Adventurer`);
            if (get("miniAdvClass") === 0) {
                // Get the mini-adventurer to become a sauceror for subsequent buffing
                setChoice(768, 4);
                // This should fail horribly if something goes wrong
                setAutoAttack(0);
                adv1($location`The Dire Warren`);
                // The noncombat just zooms by too fast and the class change doesn't get picked up
                set("miniAdvClass", 4);
            }
        }
        equip($item`Fourth of May Cosplay Saber`);
        // There's gonna be a round before we get out and these are scalers... let's be safe
        getBuffs($effects`Blood Bubble`);
        // In the event of NEP noncombat, pick a fight
        setChoice(1324, 5);
        // The NEP mobs should hopefully tank a single smack of the mini-sauce guy
        saberCheese(Macro.trySkill($skill`Meteor Shower`), $location`The Neverending Party`);
        // Auto-attack saber means mafia doesn't get to see the meteor shower, let it know
        set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
    }
    // Alright, gear and do the thing!
    outfitSpell();
    // The spell damage prep thing is a little different, as Simmer takes a turn to do
    // Let the libram CS wrapper know if we have Simmering so it corrects for it
    return have($effect`Simmering`) ? 1 : 0;
}

// Prepare for item/booze drop test
export function itemPrep(): void {
    // Fuel up asdon for buffing purposes
    if (!have($effect`Driving Observantly`)) {
        if (!AsdonMartin.fillWithInventoryTo(37)) throw "Breadcar refuses to charge to 37!";
    }
    // Pop a free kill in the toxic teacups for a tiny bit of toxic vengeance
    // Which should be enough to push out a turn save from the spare change
    if (!have($effect`Toxic Vengeance`)) {
        useFamiliar($familiar`none`);
        // Parka free kill specifically
        equip($item`Jurassic Parka`);
        setParka("dilophosaur");
        adventureMacro($location`The Toxic Teacups`, Macro.trySkill($skill`Spit jurassic acid`));
        // The above will catch the opening NC, go again
        if (!have($effect`Toxic Vengeance`)) {
            adventureMacro(
                $location`The Toxic Teacups`,
                Macro.trySkill($skill`Spit jurassic acid`)
            );
        }
    }
    // Get the sparkler for the outfit
    retrieveItem(1, $item`oversized sparkler`);
    // Item buff time
    getBuffs([
        $effect`Fat Leon's Phat Loot Lyric`,
        $effect`Singer's Faithful Ocelot`,
        $effect`Driving Observantly`,
        $effect`Pork Barrel`,
        $effect`The Spirit of Taking`,
        $effect`Glowing Hands`,
        $effect`Crunching Leaves`,
        $effect`I See Everything Thrice!`,
    ]);
    // Get bowlo buff and batform in a single runaway
    if (!have($effect`Cosmic Ball in the Air`)) {
        useFamiliar($familiar`none`);
        equip($item`vampyric cloake`);
        equip($item`Lil' Doctor™ bag`);
        adventureMacro(
            $location`The Dire Warren`,
            Macro.trySkill($skill`Bowl Straight Up`)
                .trySkill($skill`Become a Bat`)
                .freeRun()
        );
    }
    // Cast feel lost, put on clothes and that's all the setup done. Squint time!
    getBuffs($effects`Feeling Lost, Steely-Eyed Squint`);
    outfitItem();
}
