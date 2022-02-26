import {
	useFamiliar,
} from "kolmafia"
import {
    $effect,
    $effects,
    $familiar,
    $items,
    $location,
    $skill,
    AsdonMartin,
    have,
} from "libram"
import {
    adventureMacro,
    getBuffs,
    saberCheese,
} from "./lib"
import {
    outfit,
    outfitItem,
} from "./outfit"
import Macro from "./combat"
import { performSynth } from "./synth"

// Fuel up asdon for buffing purposes
if (!have($effect`driving observantly`)) {
	if (!AsdonMartin.fillWithInventoryTo(37)) throw "Breadcar refuses to charge to 37!"
}
// Item buff time
getBuffs($effects`fat leon's phat loot lyric, singer's faithful ocelot, feeling lost`);
getBuffs($effects`driving observantly, pork barrel`);
if (!have($effect`synthesis: collection`)) performSynth("item");
// Get bowlo buff and batform in a single runaway
outfit($items`vampyric cloake, Lil' Doctor™ bag`);
if (!have($effect`cosmic ball in the air`)) {
	useFamiliar($familiar`none`);
	adventureMacro(
		$location`The Dire Warren`,
		Macro.trySkill($skill`bowl straight up`).trySkill($skill`become a bat`).freeRun()
	);
}
// Put on clothes and that's all the setup done. Squint time!
outfitItem();
getBuffs($effects`steely-eyed squint`);