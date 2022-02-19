import {
  adv1,
  buy,
  cliExecute,
  Effect,
  equip,
  equippedItem,
  handlingChoice,
  haveEffect,
  Item,
  itemAmount,
  Location,
  Monster,
  myMp,
  runChoice,
  runCombat,
  toUrl,
  use,
  useFamiliar,
  useSkill,
  visitUrl,
  wait
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $items,
  $location,
  $skill,
  $slot,
  Clan,
  get,
  have,
  PropertiesManager
} from "libram";
import {
  outfitEarly
} from "./outfit"
import Macro from "./combat";

// This thing allows controlling choice options. Neat!
export const PropertyManager = new PropertiesManager();
export function setChoice(adv: number, choice: number | string): void {
  PropertyManager.setChoices({ [adv]: choice });
}

// Pick what familiar to use
export function useDefaultFamiliar(): void {
	// Need to prioritise garbage fire and shorty to get famweight drops
	// So that sprinkle dog can be 140lb in time for his moment
	if (!have($item`burning newspaper`) && !have($item`burning paper crane`)) {
		useFamiliar($familiar`garbage fire`);
		equip($item`miniature crystal ball`);
	} else if (!have($item`short stack of pancakes`) && (haveEffect($effect`shortly stacked`) === 0)) {
		useFamiliar($familiar`shorter-order cook`);
		equip($item`miniature crystal ball`);
	} else if (get("camelSpit") < 100) {
		// The camel takes up most of the turns in the middle of the run
		useFamiliar($familiar`melodramedary`);
		equip($item`dromedary drinking helmet`);
	} else if (equippedItem($slot`offhand`) !== $item`familiar scrapbook`) {
		// We're in the NEP and fishing for kramcos
		// Time to bust out lefty with the scrapbook
		useFamiliar($familiar`left-hand man`);
		equip($slot`familiar`, $item`familiar scrapbook`);
	} else {
		// We shouldn't end up here. Default to Melf just in case?
		useFamiliar($familiar`machine elf`);
		equip($item`miniature crystal ball`);
	}
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
  // Sometimes there might be an introductory NC
  // In that case, hit the place again and it should be fine
  const mapPage = visitUrl(toUrl(location));
  if (!mapPage.includes("Leading Yourself Right to Them")) {
  	// Just in case
  	wait(1);
  	visitUrl(toUrl(location));
  }
  runChoice(1, `heyscriptswhatsupwinkwink=${monster.id}`);
  runCombat(macro.toString());
  // Once again, in case of saber
  if (handlingChoice()) runChoice(3);
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

// Hit up the protopack ghost
export function bustGhost(): void {
  const ghostLocation = get("ghostLocation");
  if (ghostLocation) {
    useDefaultFamiliar();
    foldIfNotHave($item`tinsel tights`);
    outfitEarly($items`protonic accelerator pack`);
    // No need to worry about entry noncombats
    // As protopack ghosts override them in priority
    adventureMacro(ghostLocation, Macro.ghost());
  }
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

// Helper function to check if we've made enough bricko bricks yet
function brickoBrickCheck(): boolean {
  // We only fight oysters, so each fight that happened is eight bricks less we need
  const brickTarget = 24 - 8*get("_brickoFights");
  return (itemAmount($item`bricko brick`) < brickTarget);
}

// Burn mana working toward libram goals
export function castLibrams(): void {
  // Keep casting while possible
  while (canCastLibrams()) {
    if (!have($item`green candy heart`) && (haveEffect($effect`heart of green`) === 0)) {
      // Fish for a green candy heart
      useSkill(1, $skill`summon candy hearts`);
    } else if ((get("_brickoEyeSummons") < 3) || brickoBrickCheck()) {
      // Get building pieces for three oysters
      useSkill(1, $skill`summon brickos`)
    } else {
      // If we're here, we've ran out of goals
      // Add more? Resolutions?
      break;
    }
  }
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

// Use an item if you have it
export function useIfHave(item:Item): void {
  if (have(item)) use(1, item);
}

// Buy and use item; named bu after common chat macro
export function bu(item:Item): void {
  if (!have(item)) buy(1, item);
  use(1, item);
}

// Get a provided list of buffs
export function getBuffs(buffs:Effect[]): void {
	for (const buff of buffs) {
		// If the buff is not there, get it
		// the .default thing is a CLI-compatible way to do so
		if (haveEffect(buff) === 0) {
			cliExecute(buff.default);
		}
	}
}