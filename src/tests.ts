import {
    buy,
    changeMcd,
    cliExecute,
    equip,
    myHp,
    myMaxhp,
    runChoice,
    toInt,
    useFamiliar,
    visitUrl,
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
    get,
    have,
    set,
} from "libram";
import {
    adventureMacro,
    bustGhost,
    castLibrams,
    foldIfNotHave,
    heal,
    getBuffs,
    mapMacro,
    saberCheese,
    useIfHave,
} from "./lib";
import Macro from "./combat";
import {
    outfit,
    outfitEarly,
    outfitCoilWire,
} from "./outfit";

// Prepare for coil wire, i.e. do early run stuff
export function coilPrep(): void {
	// Pre-coil fights are quite minimal on buffs, not enough mana to go ham
	getBuffs($effects`inscrutable gaze, feeling excited`);
	// Go saber a skeleton real quick
	if (!have($item`orange`)) {
		useFamiliar($familiar`crimbo shrub`);
		// Decorate Crimbo Shrub with LED Mandala, Jack-O-Lantern Lights, Popcorn Strands, and Big Red-Wrapped Presents
		if (!get("_shrubDecorated")) {
			const decorations = toInt($item`box of old Crimbo decorations`);
			visitUrl(`inv_use.php?pwd=&which=99&whichitem=${decorations}`);
			visitUrl(`choice.php?whichchoice=999&pwd=&option=1&topper=2&lights=5&garland=3&gift=2`);
		}
		foldIfNotHave($item`tinsel tights`);
		// Put on the scrapbook to get a scrap off the shrub doing stuff
		outfitEarly($items`familiar scrapbook`);
		mapMacro($location`the skeleton store`, $monster`novelty tropical skeleton`, Macro.trySkill($skill`open a big red present`).trySkill($skill`Use the Force`));
		// Do a quick soak to heal up as early mana is scarce
		if (myHp() < 0.5*myMaxhp()) cliExecute("hottub");
		// This leaves behind the mapping preference set because lol saber
		if (get("mappingMonsters")) set("mappingMonsters", false);
	}
	// Set up MCD on 10 now that shrub has provided us with some funds
	if (!have($item`detuned radio`)) buy(1, $item`detuned radio`);
	changeMcd(10);
	// Catch a kramco with the mimic out, and a paranormal prediction to boot
	if (!have($item`bag of many confections`)) {
		useFamiliar($familiar`stocking mimic`);
		foldIfNotHave($item`tinsel tights`);
		outfitEarly($items`protonic accelerator pack, Kramco Sausage-o-Matic™`);
		adventureMacro($location`noob cave`, Macro.kill());
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