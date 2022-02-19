import {
	canEquip,
	equip,
	equippedItem,
	Item,
	print,
	Slot,
	toSlot,
	useFamiliar,
} from "kolmafia";
import {
	$familiar,
	$item,
	$items,
	$slot,
	get,
	have,
} from "libram";
import {
	setRetroCape
} from "./lib";

// Outfits are defined as maps (dictionaries)
// Where the keys are slots and the values are an array of items
// The items are sorted in descending order of desirability
// And once one is found that goes on, the slot is deemed sorted

// Put the specified outfit on
function dressUp(outfit: Map<Slot, Item[]>) : void {
	for (const [outfitSlot, outfitItems] of outfit) {
		// Check the potential items to equip - do we have them and can we put them on?
		for (const option of outfitItems) {
			if (have(option) && canEquip(option)) {
				// If so, put them on and the slot is done, so break out
				equip(outfitSlot, option);
				break;
			}
		}
	}
}

// Apply changes to the outfit
// No need to return it as the modified values are seen upstream
function applyChanges(outfit: Map<Slot, Item[]>, changes: (Item | [Slot, Item])[]) : void{
	if (changes.length !== 0) {
		for (const override of changes) {
			// Each override will go to the front of the array of items
			// We're doing a definite assignment assertion in the unshift
			// As otherwise this whines that what if this is undefined
			if (Array.isArray(override)) {
				// We've got both the slot and the item given
				const overrideSlot = override[0];
				const overrideItem = override[1];
				outfit.get(overrideSlot)!.unshift(overrideItem);
			} else {
				// Auto-detect slot from item
				const overrideSlot = toSlot(override);
				const overrideItem = override;
				outfit.get(overrideSlot)!.unshift(overrideItem);
			}
		}
	}
}

// The pre-coil outfit where stats are tiny, so go for flat boosts
// Also used later for non-scaling, low-yield fights like the snojo
export function outfitEarly(changes: (Item | [Slot, Item])[] = []): void {
	setRetroCape("heck", "thrill");
	let outfit = new Map<Slot, Item[]>([
		[$slot`hat`, $items`daylight shavings helmet`],
		[$slot`back`, $items`lov epaulettes, unwrapped knock-off retro superhero cape`],
		[$slot`shirt`, $items`fresh coat of paint`],
		[$slot`weapon`, $items`fourth of may cosplay saber`],
		[$slot`offhand`, $items`weeping willow wand`],
		[$slot`pants`, $items`tinsel tights, pantogram pants, cargo cultist shorts`],
		[$slot`acc1`, $items`retrospecs`],
		[$slot`acc2`, $items`eight days a week pill keeper`],
		[$slot`acc3`, $items`kremlin's greatest briefcase`]
	]);
	applyChanges(outfit, changes);
	dressUp(outfit);
}

// The coil outfit aims to maximise MP for subsequent buffing kickstarting
export function outfitCoilWire(): void {
	setRetroCape("heck", "thrill");
	let outfit = new Map<Slot, Item[]>([
		[$slot`hat`, $items`iunion crown`],
		[$slot`back`, $items`unwrapped knock-off retro superhero cape`],
		[$slot`shirt`, $items`fresh coat of paint`],
		[$slot`weapon`, $items`weeping willow wand`],
		[$slot`offhand`, $items`abracandalabra`],
		[$slot`pants`, $items`cargo cultist shorts`],
		[$slot`acc1`, $items`retrospecs`],
		[$slot`acc2`, $items`eight days a week pill keeper`],
		[$slot`acc3`, $items`kremlin's greatest briefcase`]
	]);
	// TODO: this feels like it wants to use the familiar?
	dressUp(outfit);
}

// The default levelling outfit
export function outfit(changes: (Item | [Slot, Item])[] = []): void {
	setRetroCape("heck", "thrill");
	let outfit = new Map<Slot, Item[]>([
		[$slot`hat`, $items`astral chapeau, daylight shavings helmet`],
		[$slot`back`, $items`lov epaulettes, unwrapped knock-off retro superhero cape`],
		[$slot`shirt`, $items`makeshift garbage shirt, fresh coat of paint`],
		[$slot`weapon`, $items`fourth of may cosplay saber`],
		[$slot`offhand`, $items`familiar scrapbook`],
		[$slot`pants`, $items`tinsel tights, pantogram pants, cargo cultist shorts`],
		[$slot`acc1`, $items`retrospecs`],
		[$slot`acc2`, $items`battle broom, eight days a week pill keeper`],
		[$slot`acc3`, $items`your cowboy boots`]
	]);
	applyChanges(outfit, changes);
	dressUp(outfit);
}