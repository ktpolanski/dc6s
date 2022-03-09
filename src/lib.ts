import {
    adv1,
    buy,
    cliExecute,
    create,
    drink,
    Effect,
    equip,
    Familiar,
    getWorkshed,
    handlingChoice,
    inebrietyLimit,
    Item,
    itemAmount,
    Location,
    mallPrice,
    Monster,
    myAdventures,
    myAscensions,
    myHp,
    myInebriety,
    myLevel,
    myMaxhp,
    myMp,
    retrieveItem,
    runChoice,
    runCombat,
    toUrl,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $class,
    $effect,
    $effects,
    $familiar,
    $item,
    $items,
    $location,
    $skill,
    ascend,
    AsdonMartin,
    ChateauMantegna,
    Clan,
    get,
    have,
    haveInCampground,
    Lifestyle,
    Paths,
    prepareAscension,
    PropertiesManager,
    set,
    SourceTerminal,
    Witchess,
} from "libram";
import { outfit, outfitFamWeight, outfitGhost } from "./outfit";
import Macro from "./combat";

// This thing allows controlling choice options. Neat!
export const PropertyManager = new PropertiesManager();
export function setChoice(adv: number, choice: number | string): void {
    PropertyManager.setChoices({ [adv]: choice });
}

// Get a provided list of buffs
export function getBuffs(buffs: Effect[]): void {
    for (const buff of buffs) {
        // If the buff is not there, get it
        // the .default thing is a CLI-compatible way to do so
        if (!have(buff)) {
            cliExecute(buff.default);
        }
    }
}

// Cast Cannelloni Cocoon if at below 50% health
export function heal(): void {
    if (myHp() < 0.5 * myMaxhp()) useSkill(1, $skill`Cannelloni Cocoon`);
}

// Use a familiar and put miniature crystal ball on it
export function familiarWithOrb(familiar: Familiar): void {
    useFamiliar(familiar);
    equip($item`miniature crystal ball`);
}

// Pick what familiar to use
export function useDefaultFamiliar(canAttack = true): void {
    // Need to prioritise garbage fire and shorty to get famweight drops
    // So that sprinkle dog can be 140lb in time for his moment
    if (!have($item`short stack of pancakes`) && !have($effect`Shortly Stacked`) && canAttack) {
        // Check the attack clause just in case, e.g. for ninja free kill
        familiarWithOrb($familiar`Shorter-Order Cook`);
    } else if (!have($item`burning newspaper`) && !have($item`burning paper crane`)) {
        familiarWithOrb($familiar`Garbage Fire`);
    } else if (get("camelSpit") < 100) {
        // The camel takes up most of the turns in the middle of the run
        useFamiliar($familiar`Melodramedary`);
        // Pick up the gear and stick it on
        if (!have($item`box of Familiar Jacks`) && !have($item`dromedary drinking helmet`)) {
            create(1, $item`box of Familiar Jacks`);
            use(1, $item`box of Familiar Jacks`);
        }
        equip($item`dromedary drinking helmet`);
        // Seeing how this buddy is around the longest, add mumming trunk myst gains
        if (!get("_mummeryMods").includes("Melodramedary")) cliExecute("mummery myst");
    } else {
        // We're in the NEP and fishing for kramcos
        // Fish for hipster fights too while we're at it
        familiarWithOrb($familiar`Artistic Goth Kid`);
    }
}

// Add auto-attack to the passed macro and hit up the specified location once
export function adventureMacro(location: Location, macro: Macro): void {
    macro.setAutoAttack();
    // In the event the autoattack doesn't go off, adv1 will just use the macro again
    adv1(location, -1, macro.toString());
}

// Saber is a very straightforward and logical item
export function saberCheese(macro: Macro, location = $location`The Dire Warren`): void {
    // Saber for items
    setChoice(1387, 3);
    adventureMacro(location, macro.skill($skill`Use the Force`));
    if (handlingChoice()) runChoice(-1);
}

// Maps are weird and require their own macro
export function mapMacro(location: Location, monster: Monster, macro: Macro): void {
    macro.setAutoAttack();
    // TODO: make this better
    if (!get("mappingMonsters")) useSkill(1, $skill`Map the Monsters`);
    // Just in case there's a sabering in the macro
    setChoice(1387, 3);
    // Sometimes there might be an introductory NC
    // In that case, hit the place again and it should be fine
    const mapPage = visitUrl(toUrl(location));
    if (!mapPage.includes("Leading Yourself Right to Them")) {
        visitUrl(toUrl(location));
    }
    runChoice(1, `heyscriptswhatsupwinkwink=${monster.id}`);
    runCombat(macro.toString());
    // Once again, in case of saber
    if (handlingChoice()) runChoice(-1);
}

// As does god lobster
export function globMacro(macro: Macro, choice = 3): void {
    macro.setAutoAttack();
    useFamiliar($familiar`God Lobster`);
    // Set up the choice adventure as specified on input
    // Default to 3, which is stats
    setChoice(1310, choice);
    visitUrl("main.php?fightgodlobster=1");
    runCombat(macro.toString());
    // Need to do this to sort out the choice adventure afterward
    visitUrl("choice.php");
    runChoice(-1);
}

// Hit up the protopack ghost
export function bustGhost(): void {
    const ghostLocation = get("ghostLocation");
    if (ghostLocation) {
        // Busting involves the ghost not getting munched by the familiar
        useDefaultFamiliar(false);
        // A bit concerned about ML, as the ghosts hit hard if you let them
        // So just keep it low ML to avoid stun resistance
        foldIfNotHave($item`tinsel tights`);
        outfitGhost();
        // No need to worry about entry noncombats
        // As protopack ghosts override them in priority
        adventureMacro(ghostLocation, Macro.ghost());
        heal();
    }
}

// Do a daycare scavenge
export function scavenge(): void {
    if (get("_daycareGymScavenges") === 0) {
        // Only bother putting on the stat gain stuff if in run
        if (!get("kingLiberated")) outfit();
        visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
        // Go into the daycare, and do a scavenge
        runChoice(3);
        runChoice(2);
        // Still in the noncombats - these two choices leave them
        runChoice(5);
        runChoice(4);
    }
}

// Do banderways in Gingerbread City
export function gingerbreadBanderway(location: Location): void {
    // We need Ode to banderway
    getBuffs($effects`Ode to Booze`);
    familiarWithOrb($familiar`Frumious Bandersnatch`);
    foldIfNotHave($item`tinsel tights`);
    // This is an easy opportunity to get some scraps
    // As bander provides one start of combat and one on skill use
    outfitFamWeight($items`familiar scrapbook`);
    adventureMacro(location, Macro.trySkill($skill`Micrometeorite`).freeRun());
    heal();
}

// Get the Inner Elf buff by going into combat with momma slime
export function getInnerElf(): void {
    // This only works once level 13
    if (myLevel() >= 13 && !have($effect`Inner Elf`)) {
        useFamiliar($familiar`Machine Elf`);
        Clan.join("Beldungeon");
        // Put on the KGB and make sure Blood Bubble is live to not get melted
        equip($item`Kremlin's Greatest Briefcase`);
        getBuffs($effects`Blood Bubble`);
        setChoice(326, 1);
        // Only some free banishers work here because of reasons
        adventureMacro(
            $location`The Slime Tube`,
            Macro.trySkill($skill`KGB tranquilizer dart`).trySkill($skill`Snokebomb`)
        );
        heal();
        Clan.join("Alliance from Heck");
    }
}

// Fight a piece of Witchess royalty
export function fightWitchessRoyalty(royalty: Monster): void {
    // On the off-chance we're level 13 already
    getInnerElf();
    useDefaultFamiliar();
    foldIfNotHave($item`makeshift garbage shirt`);
    outfit();
    // Witchess royalty allows for no combat finesse
    Macro.attack().repeat().setAutoAttack();
    Witchess.fightPiece(royalty);
    heal();
}

// Check if you have enough mana to cast a libram summon
export function canCastLibrams(): boolean {
    const summonNumber = 1 + get("libramSummons");
    const cost = 1 + (summonNumber * (summonNumber - 1)) / 2;
    return myMp() >= cost;
}

// Helper function to check if we've made enough bricko bricks yet
function brickoBrickCheck(): boolean {
    // We only fight oysters, so each fight that happened is eight bricks less we need
    const brickTarget = 24 - 8 * get("_brickoFights");
    return itemAmount($item`BRICKO brick`) < brickTarget;
}

// Burn mana working toward libram goals
export function castLibrams(): void {
    // Keep casting while possible
    while (canCastLibrams()) {
        if (!have($item`green candy heart`) && !have($effect`Heart of Green`)) {
            // Fish for a green candy heart
            useSkill(1, $skill`Summon Candy Heart`);
        } else if (get("_brickoEyeSummons") < 3 || brickoBrickCheck()) {
            // Get building pieces for three oysters
            useSkill(1, $skill`Summon BRICKOs`);
        } else {
            // If we're here, we've ran out of goals
            // Add more? Resolutions?
            break;
        }
    }
}

// fold() won't work if you have the exact item equipped
// So let's check if we have the item prior to folding
export function foldIfNotHave(item: Item): void {
    if (!have(item)) {
        cliExecute(`fold ${item}`);
    }
}

// Reconfigure the retrocape if not already set up this way
export function setRetroCape(hero: string, mode: string): void {
    if (get("retroCapeSuperhero") !== hero || get("retroCapeWashingInstructions") !== mode) {
        cliExecute(`retrocape ${hero} ${mode}`);
    }
}

// Use an item if you have it
export function useIfHave(item: Item): void {
    if (have(item)) use(1, item);
}

// Buy and use item; named bu after common chat macro
export function bu(item: Item): void {
    if (!have(item)) buy(1, item);
    use(1, item);
}

// How many free kills do we have left?
export function freeKillsLeft(): number {
    // X-rays and shattering punches just count up to 3 in preferences
    const xrays = 3 - get("_chestXRayUsed");
    const punches = 3 - get("_shatteringPunchUsed");
    // These are essentially one-line if/else things
    // Storing 0 if the preference is true and 1 if false
    const mobhit = get("_gingerbreadMobHitUsed") ? 0 : 1;
    const missile = get("_missileLauncherUsed") ? 0 : 1;
    return xrays + punches + mobhit + missile;
}

// Does KGB have a given enchantment?
// Warning - case sensitive! Enchants need to be written as on the KGB itself!
export function checkKGB(enchant: string): boolean {
    // The current item description features the enchantments
    const briefcase = visitUrl("desc_item.php?whichitem=311743898");
    if (briefcase.includes(enchant)) return true;
    else return false;
}

// Check whether a test failed
export function assertTest(outcome: string, test: string): void {
    // If the test prep went wrong, given desired turncount
    // Then the libram wrapper will return "failed"
    if (outcome === "failed") throw `${test} test failed to complete.`;
}

// Half-loop script functions
// Simple breakfasty start of day stuff
export function breakfast(): void {
    // Pick up an Embezzler fax from a backup clan
    if (!get("_photocopyUsed") && !have($item`photocopied monster`)) {
        Clan.join("Fax-In-The-Box");
        cliExecute("fax get");
    }
    Clan.join("Alliance from Heck");
    cliExecute("breakfast");
    // These don't get used by garbo so we may as well go for it
    if (!get("_aprilShower")) cliExecute("shower cold");
    if (!get("_detectiveCasesCompleted")) cliExecute("detective solver");
    scavenge();
}

// Call garbo, either in ascend or not ascend mode based on the argument
export function garbo(ascend: boolean): void {
    if (myAdventures() > 0) {
        // Refresh horse paste price for optimal garbo dieting
        mallPrice($item`Extrovermectin™`);
        set("valueOfAdventure", 6000);
        const garboCall = ascend ? "garbo ascend" : "garbo";
        // In case of garbo abort, abort the whole thing
        if (!cliExecute(garboCall)) throw "Garbo errored out";
    }
}

// Overdrink, and possibly set up for rollover with pyjamas
export function nightcap(pyjamas: boolean): void {
    if (myAdventures() === 0 && myInebriety() <= inebrietyLimit()) {
        // A little extra liver is good, I hear
        useFamiliar($familiar`Stooper`);
        cliExecute("CONSUME NIGHTCAP VALUE 4000");
    }
    if (pyjamas) {
        // Has the adventure furniture
        Clan.join("Alliance from Hobopolis");
        // Catches the potted meat plant, maybe some others
        cliExecute("breakfast");
        useFamiliar($familiar`Trick-or-Treating Tot`);
        foldIfNotHave($item`stinky cheese diaper`);
        // There are a lot of 6-adventure accessories
        // Go for the ones with relevant rollover buffs
        cliExecute("maximize adventures +equip Spacegate scientist's insignia +equip Sasq™ watch");
    }
}

// Prepare for ascension, and ascend (if the argument says to)
export function gashHop(hop:boolean): void {
    // Only prep for ascension once out of adventures and overdrunk
    if (myAdventures() === 0 && myInebriety() > inebrietyLimit()) {
        // Set up the various options
        // (the {} stuff allows for named argument passing)
        prepareAscension({
            workshed: "Asdon Martin keyfob",
            garden: "Peppermint Pip Packet",
            eudora: "Our Daily Candles™ order form",
            chateau: {
                desk: "continental juice bar",
                nightstand: "foreign language tapes",
                ceiling: "ceiling fan",
            },
        });
        if (hop) {
            // Ascend with the expected configuration of stuff
            ascend(
                Paths.CommunityService,
                $class`Pastamancer`,
                Lifestyle.hardcore,
                "wallaby",
                $item`astral six-pack`,
                $item`astral chapeau`
            );
        }
    }
}

// Various "turn zero aftercore" things to do post-CS
export function postrun(): void {
    // Get stuff out of Hagnk's
    if (get("lastEmptiedStorage") < myAscensions()) {
        cliExecute("pull all");
        cliExecute("refresh all");
    }
    // Acquire one of Irrat's cheap clockwork maids
    if (!haveInCampground($item`clockwork maid`)) {
        if (buy(1, $item`clockwork maid`, 25000)) use(1, $item`clockwork maid`);
    }
    // Buff up with Asdon and swap to CMC for horse paste
    if (!get("_workshedItemUsed") && getWorkshed() === $item`Asdon Martin keyfob`) {
        AsdonMartin.drive($effect`Driving Observantly`, 1100);
        use($item`cold medicine cabinet`);
    }
    // Switch Chateau to skylight
    ChateauMantegna.changeCeiling("artificial skylight");
    // Get beach access - might have bus pass from a fumbled run
    if (!have($item`bitchin' meatcar`) && !have($item`Desert Bus pass`)) {
        retrieveItem(1, $item`bitchin' meatcar`);
    }
    // Lose undesirable effects
    for (const effect of $effects`Feeling Lost, Cowrruption`) {
        if (have(effect)) cliExecute(`uneffect ${effect}`);
    }
    // The Source Terminal enquiry buff needs to be set each run
    if (!get("sourceTerminalEnquiry")) SourceTerminal.enquiry($effect`familiar.enq`);
    // Open up the Rain-Doh
    useIfHave($item`can of Rain-Doh`);
    // That's it! Celebrate with a drink, as garbo won't down pilsners
    if (have($item`astral pilsner`)) {
        getBuffs($effects`Ode to Booze`);
        drink(itemAmount($item`astral pilsner`), $item`astral pilsner`);
    }
}
