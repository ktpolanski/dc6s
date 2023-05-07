import {
    adv1,
    autosell,
    bjornifyFamiliar,
    buy,
    cliExecute,
    create,
    drink,
    Effect,
    equip,
    equippedItem,
    eudora,
    Familiar,
    familiarEquipment,
    getWorkshed,
    handlingChoice,
    haveEquipped,
    hippyStoneBroken,
    inebrietyLimit,
    inHardcore,
    Item,
    itemAmount,
    Location,
    mallPrice,
    Monster,
    myAdventures,
    myAscensions,
    myFamiliar,
    myGardenType,
    myHp,
    myInebriety,
    myLevel,
    myMaxhp,
    myMp,
    print,
    putShop,
    receiveFax,
    retrieveItem,
    retrievePrice,
    runChoice,
    runCombat,
    setAutoAttack,
    toInt,
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
    $monster,
    $path,
    $skill,
    $slot,
    ascend,
    AsdonMartin,
    ChateauMantegna,
    Clan,
    CommunityService,
    CrownOfThrones,
    get,
    getSaleValue,
    getTodaysHolidayWanderers,
    have,
    haveInCampground,
    Lifestyle,
    prepareAscension,
    PropertiesManager,
    set,
    SourceTerminal,
    sum,
    sumNumbers,
    Witchess,
} from "libram";
import { famWeightPrep, noncombatPrep, spellPrep, weaponPrep } from "./tests";
import { outfit, outfitFamWeight, outfitGhost, outfitML } from "./outfit";
import Macro from "./combat";

// This thing allows controlling properties and choice options. Neat!
export const PropertyManager = new PropertiesManager();
export function setChoice(adv: number, choice: number | string): void {
    PropertyManager.setChoices({ [adv]: choice });
}

// This thing calibrates the bjorn libram code to get me familiars based on drops
// Thanks phred!
CrownOfThrones.createRiderMode("Free Runs", {
    dropsValueFunction: function (drops: Item[] | Map<Item, number>): number {
        return Array.isArray(drops)
            ? getSaleValue(...drops)
            : sum([...drops.entries()], ([item, quantity]) => quantity * getSaleValue(item)) /
                  sumNumbers([...drops.values()]);
    },
});

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

// Cast Cannelloni Cocoon if at below provided fraction health
export function heal(thresh = 0.6): void {
    // Are we beaten up? We shouldn't be!
    if (have($effect`Beaten Up`)) throw "We got beaten up somehow?!";
    if (myHp() < thresh * myMaxhp()) {
        // Occasionally the HP pool exceeds a single Cocoon's range
        while (myHp() < myMaxhp()) useSkill(1, $skill`Cannelloni Cocoon`);
    }
}

// Use a familiar and put the standard gear on it
export function familiarWithGear(familiar: Familiar): void {
    useFamiliar(familiar);
    // The current choice of gear is the tiny stillsuit
    // Orb's stat gain is extremely tiny, and this revs up the Stooper filler for later
    equip($item`tiny stillsuit`);
}

// Get a familiar's equipment via familiar jacks
export function familiarJacks(familiar: Familiar): void {
    if (!have(familiarEquipment(familiar))) {
        useFamiliar(familiar);
        if (!have($item`box of Familiar Jacks`)) create(1, $item`box of Familiar Jacks`);
        use(1, $item`box of Familiar Jacks`);
    }
}

// Pull the camel out and set it up for use
function camel(): void {
    useFamiliar($familiar`Melodramedary`);
    // Pick up the gear and stick it on
    familiarJacks($familiar`Melodramedary`);
    equip($item`dromedary drinking helmet`);
    // Seeing how this buddy is around the longest, add mumming trunk myst gains
    if (!get("_mummeryMods").includes("Melodramedary")) cliExecute("mummery myst");
}

// Pull the cook out, but pull out the bander before so cook's bonus xp trickles down
function cook(): void {
    if (myFamiliar() !== $familiar`Shorter-Order Cook`) {
        useFamiliar($familiar`Frumious Bandersnatch`);
    }
    familiarWithGear($familiar`Shorter-Order Cook`);
}

// Pick what familiar to use, hardcore edition
export function hardcoreFamiliar(canAttack = true, canCamel = true): void {
    // Need to prioritise garbage fire and shorty to get famweight drops
    // So that sprinkle dog can be 140lb in time for his moment
    if (!have($item`short stack of pancakes`) && !have($effect`Shortly Stacked`) && canAttack) {
        // Check the attack clause just in case, e.g. for ninja free kill
        cook();
    } else if (get("_garbageFireDrops") < 1 && get("_garbageFireDropsCrown") < 2) {
        familiarWithGear($familiar`Garbage Fire`);
    } else if (get("camelSpit") < 100 && canCamel) {
        // The camel takes up most of the turns in the middle of the run
        // The camel clause is exclusively against the witchess queen
        camel();
    } else {
        // We're in the NEP and fishing for kramcos
        // Fish for hipster fights too while we're at it
        familiarWithGear($familiar`Artistic Goth Kid`);
    }
}

// Pick what familiar to use, softcore edition
export function softcoreFamiliar(canAttack = true, canCamel = true): void {
    // Repaid diaper brings sprinkle dog up fat enough to not need to rush famweight drops
    // Do camel charging first and spit upon yourself to aid with levelling
    if (!have($effect`Spit Upon`) && canCamel) {
        // The camel clause is exclusively against the witchess queen
        camel();
    } else if (
        !have($item`short stack of pancakes`) &&
        !have($effect`Shortly Stacked`) &&
        canAttack
    ) {
        // Check the attack clause just in case, e.g. for ninja free kill
        cook();
    } else if (get("_garbageFireDrops") < 1 && get("_garbageFireDropsCrown") < 2) {
        familiarWithGear($familiar`Garbage Fire`);
    } else {
        // We're in the NEP and fishing for kramcos
        // Fish for hipster fights too while we're at it
        familiarWithGear($familiar`Artistic Goth Kid`);
    }
}

// Pick what familiar to use
// Allow control over whether the familiar can attack (low HP enemies)
// And whether the camel is allowed (the witchess queen blocks skills)
export function useDefaultFamiliar(canAttack = true, canCamel = true): void {
    // If in hardcore, prioritise the famweight drops
    // If in softcore, prioritise the camel and get spat on
    if (inHardcore()) hardcoreFamiliar(canAttack, canCamel);
    else softcoreFamiliar(canAttack, canCamel);
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

// If it's a holiday with wanderers, do a banderway in the Noob Cave
export function holidayCheck(): void {
    // This lists today's wanderers - if it's non-empty, there are wanderers
    if (getTodaysHolidayWanderers().length > 0) {
        // Use the boots as they don't require Ode, just go and run, nothing fancy
        familiarWithGear($familiar`Pair of Stomping Boots`);
        // Try to catch a bjorn drop, you never know
        outfitFamWeight([], bjornFamiliar());
        adventureMacro($location`Noob Cave`, Macro.freeRun());
    }
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

// Check if you have enough mana to cast a libram summon
// Leave buffer mana behind for combat and stuff
export function canCastLibrams(buffer = 0): boolean {
    const summonNumber = 1 + get("libramSummons");
    const cost = 1 + (summonNumber * (summonNumber - 1)) / 2;
    return myMp() >= cost + buffer;
}

// Helper function to check if we've made enough bricko bricks yet
function brickoBrickCheck(): boolean {
    // We only fight oysters, so each fight that happened is eight bricks less we need
    const brickTarget = 24 - 8 * get("_brickoFights");
    return itemAmount($item`BRICKO brick`) < brickTarget;
}

// Burn mana working toward libram goals
// Leave buffer mana behind for combat and stuff
export function castLibrams(buffer = 0): void {
    // Keep casting while possible
    while (canCastLibrams(buffer)) {
        if (!have($item`resolution: be feistier`) && !have($effect`Destructive Resolve`)) {
            // Fish for a spell damage resolution
            useSkill(1, $skill`Summon Resolutions`);
        } else if (get("_brickoEyeSummons") < 3 || brickoBrickCheck()) {
            // Get building pieces for three oysters
            useSkill(1, $skill`Summon BRICKOs`);
        } else {
            // If we're here, we've ran out of goals
            // Add more?
            break;
        }
    }
}

// Burn MP on librams and then try to fight all the brickos you can
// Leave buffer mana behind for combat and stuff
export function libramFishBrickoFights(buffer = 300): void {
    // Fish for a spell damage resolution, then for brickos
    castLibrams(buffer);
    // Build and fight all the oysters you can, up to three total
    if (get("_brickoFights") < 3) {
        // Do we have oyster ingredients?
        while (have($item`BRICKO eye brick`) && itemAmount($item`BRICKO brick`) > 7) {
            //Create the oyster
            use(8, $item`BRICKO brick`);
            useDefaultFamiliar();
            foldIfNotHave($item`tinsel tights`);
            // Garbo doesn't currently use otoscope, and this caps the pearls
            outfitML($items`Lil' Doctor™ bag`);
            // Don't forget the saucestorm because of no saber in the ML outfit
            Macro.saucestorm($skill`Otoscope`).setAutoAttack();
            use(1, $item`BRICKO oyster`);
            runCombat(Macro.saucestorm($skill`Otoscope`).toString());
            heal();
            // Flip the pearls
            autosell(1, $item`BRICKO pearl`);
        }
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
    familiarWithGear($familiar`Frumious Bandersnatch`);
    foldIfNotHave($item`tinsel tights`);
    // This is an easy opportunity to get some scraps
    // As bander provides one start of combat and one on skill use
    // Also fish for some sweat and some bjorn drops
    outfitFamWeight($items`designer sweatpants, familiar scrapbook`, bjornFamiliar());
    // Use the full delevel setup here to stall for time for the bjorn
    adventureMacro(location, Macro.delevel().freeRun());
    heal();
}

// Get the Inner Elf buff by going into combat with momma slime
export function getInnerElf(): void {
    // This only works once level 13
    if (myLevel() >= 13 && !have($effect`Inner Elf`)) {
        familiarWithGear($familiar`Machine Elf`);
        Clan.join("Beldungeon");
        // Put on the KGB and make sure Blood Bubble is live to not get melted
        equip($item`Kremlin's Greatest Briefcase`);
        getBuffs($effects`Blood Bubble`);
        // Free sweat
        equip($item`designer sweatpants`);
        // Free bjorn chance, I guess
        if (have($item`Buddy Bjorn`)) equip($item`Buddy Bjorn`);
        bjornify(bjornFamiliar());
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
    // If we're about to go up against a queen, and we have a spit-ready camel
    // The skill won't go off. Tell it to not use the camel
    if (royalty === $monster`Witchess Queen` && get("camelSpit") === 100) {
        useDefaultFamiliar(true, false);
    } else useDefaultFamiliar();
    foldIfNotHave($item`makeshift garbage shirt`);
    outfit($items`unbreakable umbrella`);
    // Witchess royalty allows for no combat finesse
    // Apart from an attempt at a camel spit if in softcore
    Macro.camel().attack().repeat().setAutoAttack();
    Witchess.fightPiece(royalty);
    heal();
    libramFishBrickoFights();
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

// Reconfigure the parka if not already set up this way
export function setParka(mode: string): void {
    if (get("parkaMode") !== mode) cliExecute(`parka ${mode}`);
}

// Use an item if you have it
export function useIfHave(item: Item): void {
    if (have(item)) use(1, item);
}

// Buy and use item; named bu after common chat macro
export function bu(item: Item): void {
    retrieveItem(1, item);
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

// Should we be putting the cincho on?
export function canCincho(): boolean {
    // How many shots of confetti have we done already?
    // Need the get([...], 0) so that it gets turned to a number
    const confettis = get("_cinchUsed", 0) / 5;
    // We can only do this nine times
    if (confettis > 8) return false;
    // Condition one, the dream - level 15 for necklace, bowling sideways active
    // Also formally inner elf but that should be in place at 15 already
    const cond1 =
        myLevel() >= 15 && get("cosmicBowlingBallReturnCombats") > 0 && have($effect`Inner Elf`);
    // Panic button conditions - about to run out of garbage shirt charges
    // Need to "waste" two on doc bag kills when the cincho won't be on
    const cond2 = get("garbageShirtCharge") < 13 - confettis;
    // About to run out of NEP turns/free kills
    // As previously, "waste" two on doc bag
    const cond3 = freeKillsLeft() + 10 - get("_neverendingPartyFreeTurns") < 13 - confettis;
    return cond1 || cond2 || cond3;
}

// Put the specified accessory in the weakest accessory slot of the base outfit
// Also include the unbreakable umbrella
export function umbrellaOutfitWithAcc(acc: Item): void {
    // In hardcore, the disposable accessory is the default acc1
    // In softcore, acc3 becomes the weakest once the necklace goes on
    if (inHardcore() || myLevel() < 15) {
        outfit([$item`unbreakable umbrella`, acc]);
    } else outfit([$item`unbreakable umbrella`, [$slot`acc3`, acc]]);
}

// Does KGB have a given enchantment?
// Warning - case sensitive! Enchants need to be written as on the KGB itself!
export function checkKGB(enchant: string): boolean {
    // The current item description features the enchantments
    const briefcase = visitUrl("desc_item.php?whichitem=311743898");
    if (briefcase.includes(enchant)) return true;
    else return false;
}

// Determine what familiar to park in the bjorn
export function bjornFamiliar(): Familiar {
    if (get("_garbageFireDropsCrown") < 2) {
        // Our main priority is the garbage fire
        return $familiar`Garbage Fire`;
    } else {
        // Phred helped me set up libram's bjorn support to spit out the best drop familiar!
        const rider = CrownOfThrones.pickRider("Free Runs");
        // This might technically be null, though it shouldn't
        if (rider !== null) {
            return rider.familiar;
        } else return $familiar`BRICKO chick`;
    }
}

// Put a specified familiar in the bjorn, if we're wearing the bjorn
export function bjornify(familiar: Familiar): void {
    // No point bjornifying if there's no bjorn in place
    if (haveEquipped($item`Buddy Bjorn`)) bjornifyFamiliar(familiar);
}

// Try to run a test and see what happens
// The "() => number | void" thing means "a function that outputs a number or void"
export function assertTest(test: CommunityService, prep: () => number | void, turns: number): void {
    // Try to .run() the test, passing the prep function to it
    // If the test prep went wrong, given desired turncount
    // Then the libram wrapper will return "failed"
    if (test.run(prep, turns) === "failed") {
        throw `${test.name} failed to complete.`;
    }
}

// Perform familiar weight block of tests
export function weightTests(): void {
    // Hot resistance is technically a famweight test
    // But doing it earlier saves some KGE clicks
    assertTest(CommunityService.Noncombat, noncombatPrep, 1);
    assertTest(CommunityService.FamiliarWeight, famWeightPrep, 25);
}

// Perform weapon/spell damage tests
export function damageTests(): void {
    assertTest(CommunityService.WeaponDamage, weaponPrep, 1);
    assertTest(CommunityService.SpellDamage, spellPrep, 25);
}

// Half-loop script functions

// Use or autosell the provided items, leaving behind the specified quantity
function useOrAutosell(items: Item[], quantity = 0): void {
    for (const item of items) {
        // Determine if the item is usable, if so use, if not autosell
        if (item.usable) use(itemAmount(item) - quantity, item);
        else autosell(itemAmount(item) - quantity, item);
    }
}

// Put the specified item in the shop at the specified price
function shopIt(item: Item, price: number): void {
    // The mafia function is a little lame so this is just a syntax wrapper
    putShop(price, 0, itemAmount(item), item);
}

// Simple breakfasty start of day stuff
export function breakfast(): void {
    // Pick up an Embezzler fax from a backup clan
    if (!get("_photocopyUsed") && !have($item`photocopied monster`)) {
        Clan.join("Fax-In-The-Box");
        receiveFax();
    }
    Clan.join("Alliance from Heck");
    cliExecute("breakfast");
    // These don't get used by garbo so we may as well go for it
    if (!get("_aprilShower")) cliExecute("shower cold");
    if (!get("_detectiveCasesCompleted")) cliExecute("detective solver");
    scavenge();
    // Do the volcano quest by hand to avoid any occasional garbo weirdness
    if (!get("_volcanoItemRedeemed")) {
        // Get the quest items for the day
        visitUrl("place.php?whichplace=airport_hot&action=airport4_questhub");
        // Store the values of the items on offer, assuming they're not worth by default
        const values = [Infinity, Infinity, Infinity];
        for (const i of Array(3).keys()) {
            // TS is zero-indexed, so offset this by one when getting the prefs out
            // Also the item is an integer, and needs to be converted via mafia's Item
            const item = Item.get(get(`_volcanoItem${i + 1}`));
            const quantity = parseInt(get(`_volcanoItemCount${i + 1}`));
            // The mallable stuff is in multiples
            // Or is a SMOOCH bottlecap/superduperheated metal
            if (quantity > 1 || $items`SMOOCH bottlecap, superduperheated metal`.includes(item)) {
                values[i] = retrievePrice(quantity, item);
            } else if (item === $item`fused fuse` && !get("_claraBellUsed")) {
                // We have the power to Clara's bell for the fuse
                // The main counter-candidate is a Yacht, which is like 40k gain
                values[i] = 40000;
            }
        }
        // So how much is a Volcoino worth? Are we cheaper?
        const bestValue = Math.min(...values);
        const volcoinoCost = mallPrice($item`one-day ticket to That 70s Volcano`) / 3;
        if (bestValue < volcoinoCost) {
            // Alright, cool, which was the best item?
            const i = values.indexOf(bestValue);
            // Get the item out of the prefs, like in the loop before
            const item = Item.get(get(`_volcanoItem${i + 1}`));
            const quantity = parseInt(get(`_volcanoItemCount${i + 1}`));
            // If we're to get the fuse, let's get the fuse
            // Otherwise just retrieve the item
            if (item === $item`fused fuse` && !have($item`fused fuse`)) {
                use(1, $item`Clara's bell`);
                setChoice(1091, 7);
                // Kill time pranks, run away from presumed holiday wanderers
                equip($item`Greatest American Pants`);
                Macro.if_($monster`time-spinner prank`, Macro.attack().repeat())
                    .runaway()
                    .setAutoAttack();
                while (!have($item`fused fuse`)) adv1($location`LavaCo™ Lamp Factory`);
            } else retrieveItem(quantity, item);
            // And now we can turn the quest in
            visitUrl("place.php?whichplace=airport_hot&action=airport4_questhub");
            runChoice(i + 1);
        }
    }
}

// Call garbo, either in ascend or not ascend mode based on the argument
export function garbo(ascend: boolean): void {
    if (myAdventures() > 0) {
        // Refresh horse paste price for optimal garbo dieting
        mallPrice($item`Extrovermectin™`);
        set("maximizerCombinationLimit", 100000);
        set("valueOfAdventure", 6000);
        const garboCall = ascend
            ? "garbo yachtzeechain ascend workshed=mts"
            : "garbo yachtzeechain";
        // In case of garbo abort, abort the whole thing
        if (!cliExecute(garboCall)) throw "Garbo errored out";
    }
}

// Overdrink, and possibly set up for rollover with pyjamas
export function nightcap(pyjamas: boolean): void {
    if (myAdventures() === 0 && myInebriety() <= inebrietyLimit()) {
        // Sometimes there are random songs that stop Ode from going on
        // Garbo really likes this one and it's disposable
        if (have($effect`Power Ballad of the Arrowsmith`)) {
            cliExecute("uneffect Power Ballad of the Arrowsmith");
        }
        // A little extra liver is good, I hear
        useFamiliar($familiar`Stooper`);
        // Chug the stillsuit distillate as a filler if it's charged up enough
        // The distillate gives 7 turns, equivalent to an Oded filler, at 108 charge
        // (the ~~ turns a string to int, with a default of 0)
        if (myInebriety() < inebrietyLimit() && ~~get("familiarSweat") >= 108) {
            // At the time of writing, this requires visitUrls to do
            visitUrl("inventory.php?action=distill&pwd", true);
            visitUrl("choice.php?pwd&whichchoice=1476&option=1", true);
        }
        cliExecute("CONSUME NIGHTCAP VALUE 4000");
    }
    if (pyjamas) {
        // Has the adventure furniture
        Clan.join("Alliance from Hobopolis");
        // Catches the potted meat plant, maybe some others
        cliExecute("breakfast");
        // Switch to Thanksgarden and prime for three cornucopias tomorrow
        if (myGardenType() !== "thanksgarden") {
            // The garden needs to be tall grass for the fertilizer to work
            if (myGardenType() !== "grass") use(1, $item`packet of tall grass seeds`);
            use(1, $item`Poké-Gro fertilizer`);
            use(1, $item`packet of thanksgarden seeds`);
        }
        // Just so it doesn't auto-pick if re-logging into mafia later in the day
        set("harvestGardenSoftcore", "cornucopia (3)");
        useFamiliar($familiar`Trick-or-Treating Tot`);
        foldIfNotHave($item`stinky cheese diaper`);
        // Do a refresh as otherwise sometimes the maximizer hangs on stuff like the cleaver
        cliExecute("refresh all");
        // There are a lot of 6-adventure accessories
        // Go for the ones with relevant rollover buffs
        cliExecute("maximize adventures +equip Spacegate scientist's insignia +equip Sasq™ watch");
    }
}

// Do PvP stuff, unless the arg states not to via including nopvp
export function pvp(arg = ""): void {
    if (!arg.includes("nopvp")) {
        // Just call Pantocyclus's smart PvP thing that learns what to do as it goes
        cliExecute("PVP_MAB.ash");
    }
}

// Prepare for ascension, and possibly ascend depending on the argument if specified:
// - noascend prepares for ascension but leaves the user in front of the gash
// - hardcore does HCCS (the default is SCCS)
export function gashHop(arg = ""): void {
    // Only prep for ascension once out of adventures and overdrunk
    if (myAdventures() === 0 && myInebriety() > inebrietyLimit()) {
        // Set up the various options
        // (the {} stuff allows for named argument passing)
        prepareAscension({
            garden: "Peppermint Pip Packet",
            eudora: "Our Daily Candles™ order form",
            chateau: {
                desk: "continental juice bar",
                nightstand: "foreign language tapes",
                ceiling: "ceiling fan",
            },
        });
        // Check cowboy boots, which store their stuff in $slots
        if (equippedItem($slot`bootskin`) !== $item`frontwinder skin`)
            throw "Cowboy boots - put on frontwinder skin!";
        if (equippedItem($slot`bootspur`) !== $item`nicksilver spurs`)
            throw "Cowboy boots - put on nicksilver spurs!";
        // The absence of noascend means we can ascend
        if (!arg.includes("noascend")) {
            // The absence of hardcore means we go softcore
            const lifestyle = arg.includes("hardcore") ? Lifestyle.hardcore : Lifestyle.softcore;
            // Ascend with the expected configuration of stuff
            ascend(
                $path`Community Service`,
                $class`Pastamancer`,
                lifestyle,
                "wallaby",
                $item`astral six-pack`,
                $item`astral chapeau`
            );
        } else print("All ready to ascend!", "blue");
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
    // Switch eudora to New-You Club for free money
    if (eudora() !== "New-You Club") eudora("New-You Club");
    // Lose undesirable effects
    for (const effect of $effects`Feeling Lost, Cowrruption`) {
        if (have(effect)) cliExecute(`uneffect ${effect}`);
    }
    // The Source Terminal enquiry buff needs to be set each run
    SourceTerminal.enquiry($effect`familiar.enq`);
    // Open up the Rain-Doh
    useIfHave($item`can of Rain-Doh`);
    // Do a DMT dupe
    const dupeTarget = $item`very fancy whiskey`;
    if (get("encountersUntilDMTChoice") === 0 && have(dupeTarget)) {
        useFamiliar($familiar`Machine Elf`);
        // Go for the dupe, and then pass the right item to it
        setChoice(1119, 4);
        setChoice(1125, `1&iid=${toInt(dupeTarget)}`);
        // Go catch the NC
        setAutoAttack(0);
        adv1($location`The Deep Machine Tunnels`);
    }
    // Break the hippy stone for PvP fight accumulation and use
    if (!hippyStoneBroken()) visitUrl("peevpee.php?action=smashstone&confirm=on");
    // That's it! Celebrate with a drink, as garbo won't down pilsners
    if (have($item`astral pilsner`)) {
        getBuffs($effects`Ode to Booze`);
        drink(itemAmount($item`astral pilsner`), $item`astral pilsner`);
    }
}

// Clean up various junk - barrels, autosell fodder, mall stuff
export function cleanup(): void {
    // Rip barrels! Manny code
    const barrels = [
        $item`little firkin`,
        $item`normal barrel`,
        $item`big tun`,
        $item`weathered barrel`,
        $item`dusty barrel`,
        $item`disintegrating barrel`,
        $item`moist barrel`,
        $item`rotting barrel`,
        $item`mouldering barrel`,
        $item`barnacled barrel`,
    ];
    barrels.forEach((barrel) => {
        if (have(barrel)) {
            let page = visitUrl(`inv_use.php?pwd&whichitem=${toInt(barrel).toString()}&choice=1`);
            while (page.includes("Click a barrel to smash it!")) {
                page = visitUrl("choice.php?pwd&whichchoice=1101&option=2");
            }
        }
    });
    // This junk gets cleaned out completely
    useOrAutosell([
        $item`1952 Mickey Mantle card`,
        $item`decomposed boot`,
        $item`dollar-sign bag`,
        $item`half of a gold tooth`,
        $item`huge gold coin`,
        $item`leather bookmark`,
        $item`massive gemstone`,
        $item`pile of gold coins`,
        $item`bag of gross foreign snacks`,
        $item`expensive camera`,
        $item`filthy child leash`,
        $item`meat stack`,
        $item`ancient vinyl coin purse`,
        $item`duct tape wallet`,
        $item`fat wallet`,
        $item`old coin purse`,
        $item`old leather wallet`,
        $item`pixel coin`,
        $item`pixellated moneybag`,
        $item`shiny stones`,
        $item`stolen meatpouch`,
        $item`Gathered Meat-Clip`,
    ]);
    // This junk we want to keep one of
    useOrAutosell($items`cheap sunglasses, bag of park garbage`, 1);
    // Mall some stuff that flips easy
    // Potentially control prices via prefs
    shopIt($item`battery (AAA)`, get("dc6s_battery_price", 10500));
    shopIt($item`11-leaf clover`, get("dc6s_clover_price", 22900));
    shopIt($item`frost-rimed desk bell`, get("dc6s_bell_price", 43000));
    shopIt($item`greasy desk bell`, get("dc6s_bell_price", 43000));
    shopIt($item`nasty desk bell`, get("dc6s_bell_price", 43000));
    shopIt($item`sizzling desk bell`, get("dc6s_bell_price", 43000));
    shopIt($item`uncanny desk bell`, get("dc6s_bell_price", 43000));
    shopIt($item`cornucopia`, get("dc6s_cornucopia_price", 28900));
}
