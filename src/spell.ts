import { useFamiliar } from "kolmafia";
import { $effect, $familiar, $location, $skill, get, have, set } from "libram";
import { adventureMacro, saberCheese, setChoice } from "./lib";
import Macro from "./combat";

// if (get("_bittycar")) print("hi");
// const newmacro = Macro.freeRun().toString(); print(`${newmacro}`);

if (!have($effect`Saucefingers`)) {
  useFamiliar($familiar`Mini-Adventurer`);
  if (get("miniAdvClass") === 0) {
    // Get the mini-adventurer to become a sauceror for subsequent buffing
    setChoice(768, 4);
    adventureMacro($location`The Dire Warren`, Macro.freeRun());
    // The noncombat just zooms by too fast and the class change doesn't get picked up
    set("miniAdvClass", 4);
  }
  // Actually get the buff
  adventureMacro($location`The Dire Warren`, Macro.freeRun());
}
if (!have($effect`Meteor Showered`) && get("_meteorShowerUses") < 5) {
  useFamiliar($familiar`none`);
  saberCheese(Macro.trySkill($skill`Meteor Shower`));
  // Auto-attack means mafia doesn't get to see the meteor shower, let it know
  set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
}
