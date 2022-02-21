import { adv1, setAutoAttack, useFamiliar } from "kolmafia";
import { $effect, $familiar, $location, $skill, get, have, set } from "libram";
import { adventureMacro, saberCheese, setChoice } from "./lib";
import Macro from "./combat";

// if (get("_bittycar")) print("hi");
// const newmacro = Macro.freeRun().toString(); print(`${newmacro}`);

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
    // The NEP mobs should hopefully tank a single smack of the mini-sauce guy
    saberCheese(Macro.trySkill($skill`Meteor Shower`), $location`the neverending party`);
    // Auto-attack saber means mafia doesn't get to see the meteor shower, let it know
    set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
}
