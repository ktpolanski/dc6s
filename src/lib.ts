import {
  adv1,
  cliExecute,
  equip,
  handlingChoice,
  Item,
  Location,
  Monster,
  myMp,
  runChoice,
  runCombat,
  toUrl,
  useFamiliar,
  useSkill,
  visitUrl,
} from "kolmafia";
import { $familiar, $item, $location, $skill, $slot, Clan, get, have, PropertiesManager } from "libram";
import Macro from "./combat";

// This thing allows controlling choice options. Neat!
export const PropertyManager = new PropertiesManager();
export function setChoice(adv: number, choice: number | string): void {
  PropertyManager.setChoices({ [adv]: choice });
}

// Add auto-attack to the passed macro and hit up the specified location once
export function adventureMacro(location: Location, macro: Macro): void {
  macro.setAutoAttack();
  // In the event the autoattack doesn't go off, adv1 will just use the macro again
  adv1(location, -1, macro.toString());
}

// Saber is a very straightforward and logical item
export function saberCheese(macro: Macro, location: Location = $location`The Dire Warren`): void {
  // Saber for items
  setChoice(1387, 3);
  adventureMacro(location, macro.skill($skill`Use the Force`));
  if (handlingChoice()) runChoice(-1);
}

// Maps are weird and require their own macro
export function mapMacro(location: Location, monster: Monster, macro: Macro): void {
  macro.setAutoAttack();
  // TODO: make this better
  if (!get("mappingMonsters")) useSkill($skill`Map the Monsters`);
  // Just in case there's a sabering in the macro
  setChoice(1387, 3);
  visitUrl(toUrl(location));
  runChoice(1, `heyscriptswhatsupwinkwink=${monster.id}`);
  runCombat(macro.toString());
  // Once again, in case of saber
  if (handlingChoice()) runChoice(-1);
}

// As does god lobster
export function globMacro(macro: Macro, choice = 1): void {
  macro.setAutoAttack();
  useFamiliar($familiar`God Lobster`);
  // Set up the choice adventure as specified on input
  setChoice(1310, choice);
  visitUrl("main.php?fightgodlobster=1");
  runCombat(macro.toString());
  // Need to do this to sort out the choice adventure afterward
  visitUrl("choice.php");
  runChoice(-1);
}

// Get the Inner Elf buff by going into combat with momma slime
export function ensureInnerElf(): void {
  useFamiliar($familiar`Machine Elf`);
  Clan.join("Beldungeon");
  // TODO: make this less shit
  equip($slot`acc2`, $item`Kremlin's Greatest Briefcase`);
  equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
  setChoice(326, 1);
  // Only some free banishers work here because of reasons
  adventureMacro(
    $location`The Slime Tube`,
    Macro.trySkill($skill`KGB tranquilizer dart`).trySkill($skill`Snokebomb`)
  );
}

// Check if you have enough mana to cast a libram summon
export function canCastLibrams(): boolean {
  const summonNumber = 1 + get("libramSummons");
  const cost = 1 + (summonNumber * (summonNumber - 1)) / 2;
  return myMp() >= cost;
}

// fold() won't work if you have the exact item equipped
// So let's check if we have the item prior to folding
export function foldIfNotHave(item: Item): void {
  if (!have(item)) {
    cliExecute(`fold ${item}`);
  }
}

// Reconfigure the retrocape if not already set up this way
export function setRetroCape(hero:string, mode:string): void {
  if ((get("retroCapeSuperhero") !== hero) || (get("retroCapeWashingInstructions") !== mode)) {
    cliExecute(`retrocape ${hero} ${mode}`);
  }
}