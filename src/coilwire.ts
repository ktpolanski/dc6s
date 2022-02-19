import {
	autosell,
	buy,
	cliExecute,
	create,
	equip,
	myLevel,
	mySpleenUse,
	runChoice,
	toInt,
	use,
	useFamiliar,
	visitUrl
} from "kolmafia";
import {
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
	Pantogram,
	set,
	SongBoom
} from "libram";
import {
	adventureMacro,
	bu,
	bustGhost,
	castLibrams,
	foldIfNotHave,
	getBuffs,
	mapMacro,
	saberCheese,
	useDefaultFamiliar,
	useIfHave
} from "./lib";
import Macro from "./combat";
import SynthesisPlanner from "./synth";
import {
	outfit,
	outfitEarly,
	outfitCoilWire
} from "./outfit";

// Visit Toot Oriole and sell any non-porquoises that get pulled
visitUrl("tutorial.php?action=toot");
useIfHave($item`letter from King Ralph XI`);
useIfHave($item`pork elf goodies sack`);
autosell(5, $item`baconstone`);
autosell(5, $item`hamethyst`);

// Loot the piggy bank
if (!get("_chateauDeskHarvested")) {
	visitUrl("place.php?whichplace=chateau&action=chateau_desk1");
}

// Configure a pantogram
if (!have($item`pantogram pants`)) {
	Pantogram.makePants(
		"Mysticality",
		"Hot Resistance: 2",
		"Maximum MP: 20",
		"Combat Rate: -5",
		"Spell Damage Percent: 20"
	);
}

// Set up boombox and saber
SongBoom.setSong("Total Eclipse of Your Meat");
if (!get("_saberMod")) {
	visitUrl("main.php?action=may4");
	runChoice(4);
}

// Buy a willow wand from the lathe
if (!have($item`weeping willow wand`)) {
	visitUrl("shop.php?whichshop=lathe");
	if (have($item`flimsy hardwood scraps`)) {
		create(1, $item`weeping willow wand`);
	}
}

// Pick up cowboy boots and a detective badge
if (!have($item`your cowboy boots`)) {
	visitUrl("place.php?whichplace=town_right&action=townright_ltt");
	runChoice(5);
}
if (!have($item`gold detective badge`)) {
	visitUrl("place.php?whichplace=town_wrong&action=townwrong_precinct");
}

// Get access to the bird, set up the horse
use(1, $item`Bird-a-Day calendar`);
if (get("_horsery") !== "dark horse") {
	cliExecute("horsery dark horse");
}

// Vote - weapon damage and familiar experience
if (!get("_voteToday")) {
	visitUrl("place.php?whichplace=town_right&action=townright_vote");
	visitUrl("choice.php?option=1&whichchoice=1331&g=2&local%5B%5D=2&local%5B%5D=3");
}

// Get an accordion and sewer items
if (!have($item`toy accordion`)) {
	buy(1, $item`toy accordion`);
}
while (!have($item`turtle totem`) || !have($item`mariachi hat`)) {
	bu($item`chewing gum on a string`);
}

// Early turn generation - numberology and borrowed time
if (myLevel() === 1 && !mySpleenUse()) {
	while (get("_universeCalculated") < get("skillLevel144")) {
		cliExecute("numberology 69");
	}
}
if (!get("_borrowedTimeUsed")) {
	if (!have($item`borrowed time`)) {
		create(1, $item`borrowed time`);
	}
	use(1, $item`borrowed time`);
}

// Unlock the early quest zones, for protopack and sabering purposes
if (get("questM23Meatsmith") === "unstarted") {
	visitUrl(`shop.php?whichshop=$meatsmith&action=talk`);
	runChoice(1);
}
if (get("questM24Doc") === "unstarted") {
	visitUrl(`shop.php?whichshop=$doc&action=talk`);
	runChoice(1);
}
if (get("questM25Armorer") === "unstarted") {
	visitUrl(`shop.php?whichshop=$armory&action=talk`);
	runChoice(1);
}

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
	outfitEarly();
	mapMacro($location`the skeleton store`, $monster`novelty tropical skeleton`, Macro.trySkill($skill`open a big red present`).trySkill($skill`Use the Force`));
	// This leaves behind the mapping preference set. unset it if it all worked out
	if (get("mappingMonsters") && have($item`orange`)) set("mappingMonsters", false);
}

// Catch a kramco with the mimic out, and a paranormal prediction to boot
if (!have($item`bag of many confections`)) {
	useFamiliar($familiar`stocking mimic`);
	foldIfNotHave($item`tinsel tights`);
	outfitEarly($items`protonic accelerator pack, Kramco Sausage-o-Matic™`);
	adventureMacro($location`noob cave`, Macro.kill());
	// Take the bag off
	equip($slot`familiar`, $item`none`);
}

// We got a ghost to bust
bustGhost();

// Okay, that's it for the early stuff! Put on the outfit and go coil some wire!
// The outfit maximises MP so as much of it is available after the test as possible
outfitCoilWire();
castLibrams();