import {
    $effect,
    $effects,
    $items,
    $skill,
    have,
    set,
} from "libram"
import {
    getBuffs,
    saberCheese,
} from "./lib"
import {
    outfitHotRes,
} from "./outfit"
import Macro from "./combat"

// Ensure buff
getBuffs($effects`feel peaceful, empathy`);
// Collect extinguisher foam via saber cheese
if (!have($effect`fireproof foam suit`)) {
    outfitHotRes($items`vampyric cloake`);
    saberCheese(
        Macro.trySkill($skill`Become a Cloud of Mist`).trySkill($skill`Fire Extinguisher: Foam Yourself`)
    );
    // Need to fix preferences as saber autoattack means mafia doesn't see these being used
    set("_vampyreCloakeFormUses", get("_vampyreCloakeFormUses")-1);
    set("_fireExtinguisherCharge", get("_fireExtinguisherCharge")-10);
}
// Stick on outfit
outfitHotRes();