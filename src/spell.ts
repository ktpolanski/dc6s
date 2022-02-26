import {
    adv1,
    cliExecute,
    setAutoAttack,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $effect,
    $effects,
    $familiar,
    $location,
    $skill,
    get,
    have,
    set
} from "libram";
import {
    adventureMacro,
    getBuffs,
    getInnerElf,
    saberCheese,
    setChoice
} from "./lib";
import {
    outfit,
    outfitSpell,
} from "./outfit";
import Macro from "./combat";

// Start off with Simmer so it doesn't muck anything up later
getBuffs($effects`simmering`);
// Acquire some constituent pieces
if (!have($effect`sigils of yeg`)) cliExecute("cargo 177");
if (!have($effect`pisces in the skyces`)) useSkill(1, $skill`summon alice's army cards`);
// Now that that's done, other stuff! A LOT of it!
getBuffs($effects`spirit of garlic, Jackasses' Symphony of Destruction, Arched Eyebrow of the Archmage`);
getBuffs($effects`carol of the hells, mental a-cue-ity, song of sauce, the magic of lov`);
getBuffs($effects`sigils of yeg, concentration, baconstoned, pisces in the skyces, grumpy and ornery`);
// Traditionally Inner Elf
getInnerElf();
// Two birds with one stone - meteor shower and mini-adventurer buff
if (!have($effect`Meteor Showered`) && get("_meteorShowerUses") < 5) {
    if (!have($effect`Saucefingers`)) {
        useFamiliar($familiar`Mini-Adventurer`);
        if (get("miniAdvClass") === 0) {
            // Get the mini-adventurer to become a sauceror for subsequent buffing
            setChoice(768, 4);
            // This should fail horribly if something goes wrong
            setAutoAttack(0);
            adv1($location`the dire warren`);
            // The noncombat just zooms by too fast and the class change doesn't get picked up
            set("miniAdvClass", 4);
        }
    }
    outfit();
    // The NEP mobs should hopefully tank a single smack of the mini-sauce guy
    saberCheese(Macro.trySkill($skill`Meteor Shower`), $location`the neverending party`);
    // Auto-attack saber means mafia doesn't get to see the meteor shower, let it know
    set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
}
// Alright, gear and do the thing!
outfitSpell();