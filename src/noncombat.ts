import {
	$effect,
    $effects,
    $items,
    $skill,
    AsdonMartin,
    have,
} from "libram"
import {
    getBuffs,
} from "./lib"
import {
    outfitNoncombat,
} from "./outfit"

// Fuel up asdon for buffing purposes
if (!have($effect`driving stealthily`)) {
	if (!AsdonMartin.fillWithInventoryTo(37)) throw "Breadcar refuses to charge to 37!"
}
// Get buffs
getBuffs($effects`sonata of sneakiness, smooth movement, gummed shoes, empathy`);
getBuffs($effects`throwing some shade, feeling lonely, silent running, driving stealthily`);
// Apply outfit...
outfitNoncombat();
// ...and get one more buff
getBuffs($effects`invisible avatar`);