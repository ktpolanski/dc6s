import {
	canEquip,
	equip,
	Item,
	Slot,
	toSlot,
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

export function uniform(changes: (Item | [Slot, Item])[] = []): void {
	let outfit = new Map<Slot, Item[]>([
		[$slot`hat`, $items`crown of thrones`],
		[$slot`pants`, $items`pantsgiving, stinky cheese diaper`]
	]);
	if (changes.length !== 0) {
		for (const override of changes) {
			// We're doing a definite assignment assertion in the unshift
			// As otherwise this whines that what if this is undefined
			if (Array.isArray(override)) {
				const overrideSlot = override[0];
				const overrideItem = override[1];
				outfit.get(overrideSlot)!.unshift(overrideItem);
			} else {
				const overrideSlot = toSlot(override);
				const overrideItem = override;
				outfit.get(overrideSlot)!.unshift(overrideItem);
			}
		}
	}
	dressUp(outfit);
}