import {
    $effects,
    $items,
    $skill,
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
outfitHotRes($items`vampyric cloake`);
saberCheese(
    Macro.trySkill($skill`Become a Cloud of Mist`).trySkill($skill`Fire Extinguisher: Foam Yourself`)
);
// Stick on outfit
outfitHotRes();