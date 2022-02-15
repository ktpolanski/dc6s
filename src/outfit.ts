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
	for (const [outfit_slot, outfit_items] of outfit) {
		for (const option of outfit_items) {
			if (have(option) && canEquip(option)) {
				equip(outfit_slot, option);
				break;
			}
		}
	}
}

export function uniform(): void {
	let outfit = new Map<Slot, Item[]>([
		[$slot`hat`, $items`crown of thrones`],
		[$slot`pants`, $items`pantsgiving, stinky cheese diaper`]
	]);
	// TODO: catch overrides somehow
	dressUp(outfit);
}