import {
	autosell,
	itemAmount,
	runCombat,
	totalFreeRests,
	use,
	visitUrl
} from "kolmafia";
import {
	$item,
	get
} from "libram";
import {
	castLibrams,
	foldIfNotHave,
	useDefaultFamiliar
} from "./lib"
import {
	outfit,
	outfitOyster
} from "./outfit"
import Macro from "./combat";
import SynthesisPlanner from "./synth";

// Make and fight as many bricko oysters as possible
function fightOysters(): void {
	if (get("_brickoFights") < 3) {
		// Do we have oyster ingredients?
		while ((itemAmount($item`bricko eye brick`)>0) && (itemAmount($item`bricko brick`)>7)) {
			//Create the oyster
			use(8, $item`bricko brick`);
			useDefaultFamiliar();
			foldIfNotHave($item`wad of used tape`);
			outfitOyster();
			// The autoattack should go off here
			Macro.kill().setAutoAttack();
			use(1, $item`bricko oyster`); runCombat(Macro.kill().toString());
			// Flip the pearl, if possible
			autosell(1, $item`bricko pearl`);
		}
	}
}

// Rest in the chateau, making and fighting oysters as quickly as we have them
while (totalFreeRests() > get("timesRested")) {
	// Fish for a green candy heart, then for brickos
	castLibrams();
	// Build and fight all the oysters you can
	fightOysters();
	// Finally, a chateau rest!
	visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
}