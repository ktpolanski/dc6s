import {
    adv1,
    buy,
    cliExecute,
    create,
    Effect,
    equip,
    equippedItem,
    Familiar,
    familiarEquipment,
    handlingChoice,
    Item,
    itemAmount,
    Location,
    Monster,
    myLevel,
    myHp,
    myMaxhp,
    myMp,
    runChoice,
    runCombat,
    setAutoAttack,
    toUrl,
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
    $slot,
    Clan,
    get,
    have,
    PropertiesManager,
    Witchess,
} from "libram";
import {
    outfit,
    outfitFamWeight,
    outfitGhost,
} from "./outfit"
import Macro from "./combat";

// This thing allows controlling choice options. Neat!
export const PropertyManager = new PropertiesManager();
export function setChoice(adv: number, choice: number | string): void {
    PropertyManager.setChoices({ [adv]: choice });
}

// Get a provided list of buffs
export function getBuffs(buffs:Effect[]): void {
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
    if (myHp() < 0.5*myMaxhp()) useSkill(1, $skill`cannelloni cocoon`);
}

// Pick what familiar to use
export function useDefaultFamiliar(canAttack=true): void {
	// Need to prioritise garbage fire and shorty to get famweight drops
	// So that sprinkle dog can be 140lb in time for his moment
	if (!have($item`short stack of pancakes`) && !have($effect`shortly stacked`) && canAttack) {
		// Check the attack clause just in case, e.g. for ninja free kill
		useFamiliar($familiar`shorter-order cook`);
		equip($item`miniature crystal ball`);
	} else if (!have($item`burning newspaper`) && !have($item`burning paper crane`)) {
		useFamiliar($familiar`garbage fire`);
		equip($item`miniature crystal ball`);
	} else if (get("camelSpit") < 100) {
		// The camel takes up most of the turns in the middle of the run
		useFamiliar($familiar`melodramedary`);
		// Pick up the gear and stick it on
		if (!have($item`box of familiar jacks`) && !have($item`dromedary drinking helmet`)) {
		    create(1, $item`box of familiar jacks`);
		    use(1, $item`box of familiar jacks`);
		}
		equip($item`dromedary drinking helmet`);
		// Seeing how this buddy is around the longest, add mumming trunk myst gains
		if (!get("_mummeryMods").includes("Melodramedary")) cliExecute("mummery myst");
	} else if (equippedItem($slot`offhand`) !== $item`familiar scrapbook`) {
		// We're in the NEP and fishing for kramcos
		// Time to bust out lefty with the scrapbook
		useFamiliar($familiar`left-hand man`);
		equip($slot`familiar`, $item`familiar scrapbook`);
	} else {
		// We shouldn't end up here. Default to Melf just in case?
		useFamiliar($familiar`machine elf`);
		equip($item`miniature crystal ball`);
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
    if (!get("mappingMonsters")) useSkill($skill`Map the Monsters`);
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

// Do banderways in Gingerbread City
export function gingerbreadBanderway(location:Location): void {
    // We need Ode to banderway
    getBuffs($effects`ode to booze`);
    useFamiliar($familiar`frumious bandersnatch`);
    equip($item`miniature crystal ball`);
    foldIfNotHave($item`tinsel tights`);
    // This is an easy opportunity to get some scraps
    // As bander provides one start of combat and one on skill use
    outfitFamWeight($items`familiar scrapbook`);
    adventureMacro(location, Macro.trySkill($skill`micrometeorite`).freeRun());
    heal();
}

// Get the Inner Elf buff by going into combat with momma slime
export function getInnerElf(): void {
    // This only works once level 13
    if ((myLevel() >= 13) && !have($effect`inner elf`)) {
        useFamiliar($familiar`Machine Elf`);
        Clan.join("Beldungeon");
        // Put on the KGB and make sure Blood Bubble is live to not get melted
        outfit($items`kremlin's greatest briefcase`);
        getBuffs($effects`blood bubble`);
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
export function fightWitchessRoyalty(royalty:Monster): void {
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
    const brickTarget = 24 - 8*get("_brickoFights");
    return (itemAmount($item`bricko brick`) < brickTarget);
}

// Burn mana working toward libram goals
export function castLibrams(): void {
    // Keep casting while possible
    while (canCastLibrams()) {
        if (!have($item`green candy heart`) && !have($effect`heart of green`)) {
            // Fish for a green candy heart
            useSkill(1, $skill`summon candy heart`);
        } else if ((get("_brickoEyeSummons") < 3) || brickoBrickCheck()) {
            // Get building pieces for three oysters
            useSkill(1, $skill`summon brickos`)
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
export function setRetroCape(hero:string, mode:string): void {
    if ((get("retroCapeSuperhero") !== hero) || (get("retroCapeWashingInstructions") !== mode)) {
        cliExecute(`retrocape ${hero} ${mode}`);
    }
}

// Use an item if you have it
export function useIfHave(item:Item): void {
    if (have(item)) use(1, item);
}

// Buy and use item; named bu after common chat macro
export function bu(item:Item): void {
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
    return (xrays + punches + mobhit + missile);
}

// Does KGB have a given enchantment?
// Warning - case sensitive! Enchants need to be written as on the KGB itself!
export function checkKGB(enchant:string): boolean {
    // The current item description features the enchantments
    const briefcase = visitUrl("desc_item.php?whichitem=311743898");
    if (briefcase.includes(enchant)) return true;
    else return false;
}