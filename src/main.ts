import { 
	runCombat,
	toInt,
	use,
	useFamiliar,
	visitUrl
} from "kolmafia";
import {
	$effects,
	$familiar,
	$item,
	$items,
	$location,
	$monster,
	$skill,
	$slot,
	get,
	have,
	set
} from "libram";
import {
	foldIfNotHave,
	getBuffs,
	mapMacro,
	saberCheese
} from "./lib";
import Macro from "./combat";
import SynthesisPlanner from "./synth";
import {
	outfit,
	outfitEarly,
	outfitCoilWire
} from "./outfit";

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

//new SynthesisPlanner().plan();

getBuffs($effects`inscrutable gaze, feeling excited`);
outfitEarly($items`protonic accelerator pack, Kramco Sausage-o-Matic™`);

//outfitEarly();
//outfitCoilWire();

//foldIfNotHave($item`stinky cheese eye`);
//outfit();
//foldIfNotHave($item`stinky cheese diaper`);
//outfit([[$slot`hat`, $item`crown of thrones`], [$slot`pants`, $item`stinky cheese diaper`]]);
//foldIfNotHave($item`stinky cheese diaper`);
//outfit();
//foldIfNotHave($item`stinky cheese diaper`);
//outfit($items`crown of thrones, pantsgiving`);

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
