import {
	canEquip,
	equip,
	Item,
	Slot,
} from "kolmafia";
import {
	$item,
	$items,
	$slot,
	have,
} from "libram";

function dressUp(outfit: Map<Slot, Item[]>) : void {
	for (const [outfitSlot, outfitItems] of outfit) {
		for (const option of outfitItems) {
			if (have(option) && canEquip(option)) {
				equip(outfitSlot, option);
				break;
			}
		}
	}
}

export function uniform(changes: [Slot, Item][] = []): void {
	let outfit = new Map<Slot, Item[]>([
		[$slot`hat`, $items`crown of thrones`],
		[$slot`pants`, $items`pantsgiving, stinky cheese diaper`]
	]);
	if (changes.length !== 0) {
		for (const [overrideSlot, overrideItem] of changes) {
			// We're doing a definite assignment assertion
			// As otherwise this whines that what if this is undefined
			outfit.get(overrideSlot)!.unshift(overrideItem);
		}
	}
	dressUp(outfit);
}