import { $item, $skill, $slot } from "libram";
import { saberCheese } from "./lib";
import Macro from "./combat";
import SynthesisPlanner from "./synth";
import { uniform } from "./outfit";

// if (get("_bittycar")) print("hi");
// const newmacro = Macro.freeRun().toString(); print(`${newmacro}`);

// adventureMacro(
//	$location`The Dire Warren`,
//	Macro.freeRun()
// );
// mapMacro($location`The Haiku Dungeon`, $monster`amateur ninja`, Macro.freeRun());
// globMacro(Macro.kill());
// ensureInnerElf();
//saberCheese(
//  Macro.trySkill($skill`Become a Cloud of Mist`).trySkill($skill`Fire Extinguisher: Foam Yourself`)
//);

new SynthesisPlanner().plan();

uniform();
uniform([[$slot`hat`, $item`daylight shavings helmet`], [$slot`pants`, $item`stinky cheese diaper`]]);

// Reminiscing is not CCS hell, all is ok
// Macro.kill().setAutoAttack();
// CombatLoversLocket.reminisce($monster`witchess knight`); runCombat(Macro.kill().toString());

// Wishing syntax, just in case
// setAutoAttack(0);
// cliExecute("genie monster witchess knight"); visitUrl('main.php'); runCombat(Macro.kill().toString());

// Putty works if you AA it beforehand. Not that this is super relevant here.
// Macro.kill().setAutoAttack();
// use(1, $item`spooky putty monster`); runCombat(Macro.kill().toString());
// Another possible trick is to visitUrl() rather than use()
// visitUrl("inv_use.php?which=3&whichitem=4170"); runCombat(Macro.kill().toString());
