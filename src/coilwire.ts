import { useFamiliar } from "kolmafia";
import { $familiar, $item, $items, $location, $monster, $skill, $slot } from "libram";
import { foldIfNotHave, mapMacro, saberCheese } from "./lib";
import Macro from "./combat";
import SynthesisPlanner from "./synth";
import { outfit, outfitEarly, outfitCoilWire } from "./outfit";

useFamiliar($familiar`crimbo shrub`);
// TODO: configure it
mapMacro($location`the skeleton store`, $monster`novelty tropical skeleton`, Macro.trySkill($skill`open a big red present`).trySkill($skill`Use the Force`));