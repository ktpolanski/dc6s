import {
    elementalResistance,
    equip,
    haveEffect,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia"
import {
    $effect,
    $effects,
    $element,
    $familiar,
    $item,
    $skill,
    have,
} from "libram"
import {
    getBuffs,
    saberCheese,
    heal,
} from "./lib"
import {
    outfitFamWeight,
} from "./outfit"
import Macro from "./combat"

// Acquire saber cheesed meteor shower
useFamiliar($familiar`none`);
outfitFamWeight();
saberCheese(Macro.trySkill($skill`meteor shower`));
// Most buffs should be on from levelling, as they get used early to make familiar go brrr
getBuffs($effects`robot friends, empathy`);
// Quick cheeser thing while we have full weight - set up DDV for spell test later
// This is good to do now as there's floating feel peaceful from hotres
// And the parrot is as fat as it's going to get
useFamiliar($familiar`exotic parrot`);
// Go for 30 turns so it's still around post fam weight test
while (haveEffect($effect`Visions of the Deep Dark Deeps`) < 30) {
    // Just in case, to avoid disappointment
    if (elementalResistance($element`spooky`) < 10) throw "Can't get enough spooky resistance for DDV!"
    // This thing slaps the HP hard
    heal();
    useSkill(1, $skill`deep dark visions`);
    heal();
}
// Use the BBB and its free +10lb equip
useFamiliar($familiar`baby bugged bugbear`);
if (!have($item`bugged beanie`)) {
    visitUrl("arena.php");
    equip($item`bugged beanie`);
}