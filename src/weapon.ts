import {
    handlingChoice,
    runChoice,
    runCombat,
    useFamiliar,
} from "kolmafia"
import {
    $effect,
    $effects,
    $familiar,
    $items,
    $monster,
    $location,
    $skill,
    CombatLoversLocket,
    get,
    have,
    set,
} from "libram"
import {
    adventureMacro,
    getBuffs,
    getInnerElf,
    saberCheese,
    setChoice,
} from "./lib"
import {
    outfit,
    outfitWeapon,
} from "./outfit"
import Macro from "./combat"

// Buff up
getBuffs($effects`song of the north, carol of the bulls, blessing of the bird`);
getBuffs($effects`lack of body-building, billiards belligerence, the power of lov`);
// Buffs with commas in the names don't work well with $effects
getBuffs([$effect`frenzied, bloody`]);
// Acquire Inner Elf for test purposes
getInnerElf();
// Get carol ghost buff
if (!have($effect`Do You Crush What I Crush?`)) {
    useFamiliar($familiar`ghost of crimbo carols`);
    // Use a reflex hammer to get out
    outfit($items`Lil' Doctor™ bag`);
    // The Dire Warren has a beast, and just a beast - how fortunate for us!
    adventureMacro($location`the dire warren`, Macro.freeRun());
}
// Alright, camel, time for your great moment! The combat that does all the things!
// Spit on me, and a meteor shower, and sabering out!
if (!have($effect`meteor showered`)) {
    useFamiliar($familiar`melodramedary`);
    outfit();
    // Saber items
    setChoice(1387, 3);
    Macro.trySkill($skill`%fn, spit on me!`)
        .trySkill($skill`meteor shower`)
        .skill($skill`Use the Force`)
        .setAutoAttack();
    CombatLoversLocket.reminisce($monster`ungulith`);
    // Backup macro submission just in case - autoattack works though
    runCombat(Macro.trySkill($skill`%fn, spit on me!`)
        .trySkill($skill`meteor shower`)
        .skill($skill`Use the Force`)
        .toString()
    );
    // Saber stuff
    if (handlingChoice()) runChoice(-1);
    // Auto-attack saber means mafia doesn't get to see the things being used, let it know
    set("camelSpit", 0);
    set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
}
// Suit up, add the last few buffs...
outfitWeapon();
getBuffs($effects`cowrruption, bow-legged swagger`);