import {
    autosell,
    buy,
    changeMcd,
    cliExecute,
    create,
    equip,
    myHp,
    myLevel,
    myMaxhp,
    mySpleenUse,
    runChoice,
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
    set,
    SongBoom
} from "libram";
import {
    adventureMacro,
    bu,
    bustGhost,
    castLibrams,
    foldIfNotHave,
    heal,
    getBuffs,
    mapMacro,
    saberCheese,
    useIfHave
} from "./lib";
import Macro from "./combat";
import {
    outfit,
    outfitEarly,
    outfitCoilWire
} from "./outfit";

// Visit Toot Oriole and sell any non-porquoises that get pulled
visitUrl("tutorial.php?action=toot");
useIfHave($item`letter from King Ralph XI`);
useIfHave($item`pork elf goodies sack`);
autosell(5, $item`baconstone`);
autosell(5, $item`hamethyst`);
// Loot the chateau desk
if (!get("_chateauDeskHarvested")) {
    visitUrl("place.php?whichplace=chateau&action=chateau_desk2");
}
// Set up boombox and saber
SongBoom.setSong("Total Eclipse of Your Meat");
if (!get("_saberMod")) {
    visitUrl("main.php?action=may4");
    runChoice(4);
}
// Buy a willow wand from the lathe
if (!have($item`weeping willow wand`)) {
    visitUrl("shop.php?whichshop=lathe");
    if (have($item`flimsy hardwood scraps`)) {
        create(1, $item`weeping willow wand`);
    }
}
// Pick up cowboy boots and a detective badge, solve some cases
if (!have($item`your cowboy boots`)) {
    visitUrl("place.php?whichplace=town_right&action=townright_ltt");
    runChoice(5);
}
if (!have($item`gold detective badge`)) {
    cliExecute("detective solver");
}
// Get access to the bird, set up the horse
use(1, $item`Bird-a-Day calendar`);
if (get("_horsery") !== "dark horse") {
    cliExecute("horsery dark horse");
}
// Vote - weapon damage and familiar experience
if (!get("_voteToday")) {
    visitUrl("place.php?whichplace=town_right&action=townright_vote");
    visitUrl("choice.php?option=1&whichchoice=1331&g=2&local%5B%5D=2&local%5B%5D=3");
    // Hit up the booth again so mafia correctly tracks the bonuses
    visitUrl('place.php?whichplace=town_right&action=townright_vote');
}
// Flip the reverser as this thing is funny exactly once
if (!get("backupCameraReverserEnabled")) cliExecute("backupcamera reverser on");
// Get an accordion and sewer items
if (!have($item`toy accordion`)) {
    buy(1, $item`toy accordion`);
}
while (!have($item`turtle totem`)) {
    bu($item`chewing gum on a string`);
}
// Early turn generation - numberology and borrowed time
if (myLevel() === 1 && !mySpleenUse()) {
    while (get("_universeCalculated") < get("skillLevel144")) {
        cliExecute("numberology 69");
    }
}
if (!get("_borrowedTimeUsed")) {
    if (!have($item`borrowed time`)) {
        create(1, $item`borrowed time`);
    }
    use(1, $item`borrowed time`);
}
// Unlock the early quest zones, for protopack and sabering purposes
if (get("questM23Meatsmith") === "unstarted") {
    visitUrl("shop.php?whichshop=meatsmith&action=talk");
    runChoice(1);
}
if (get("questM24Doc") === "unstarted") {
    visitUrl("shop.php?whichshop=doc&action=talk");
    runChoice(1);
}
if (get("questM25Armorer") === "unstarted") {
    visitUrl("shop.php?whichshop=armory&action=talk");
    runChoice(1);
}
// Pre-coil fights are quite minimal on buffs, not enough mana to go ham
getBuffs($effects`inscrutable gaze, feeling excited`);
// Go saber a skeleton real quick
if (!have($item`orange`)) {
    useFamiliar($familiar`crimbo shrub`);
    // Decorate Crimbo Shrub with LED Mandala, Jack-O-Lantern Lights, Popcorn Strands, and Big Red-Wrapped Presents
    if (!get("_shrubDecorated")) {
        const decorations = toInt($item`box of old Crimbo decorations`);
        visitUrl(`inv_use.php?pwd=&which=99&whichitem=${decorations}`);
        visitUrl(`choice.php?whichchoice=999&pwd=&option=1&topper=2&lights=5&garland=3&gift=2`);
    }
    foldIfNotHave($item`tinsel tights`);
    // Put on the scrapbook to get a scrap off the shrub doing stuff
    outfitEarly($items`familiar scrapbook`);
    mapMacro($location`the skeleton store`, $monster`novelty tropical skeleton`, Macro.trySkill($skill`open a big red present`).trySkill($skill`Use the Force`));
    // Do a quick soak to heal up as early mana is scarce
    if (myHp() < 0.5*myMaxhp()) cliExecute("hottub");
    // This leaves behind the mapping preference set. Unset it if it all worked out
    if (get("mappingMonsters") && have($item`orange`)) set("mappingMonsters", false);
}
// Set up MCD on 10
if (!have($item`detuned radio`)) buy(1, $item`detuned radio`);
changeMcd(10);
// Catch a kramco with the mimic out, and a paranormal prediction to boot
if (!have($item`bag of many confections`)) {
    useFamiliar($familiar`stocking mimic`);
    foldIfNotHave($item`tinsel tights`);
    outfitEarly($items`protonic accelerator pack, Kramco Sausage-o-Matic™`);
    adventureMacro($location`noob cave`, Macro.kill());
    heal();
    // Take the bag of many confections off
    equip($slot`familiar`, $item`none`);
}
// We got a ghost to bust
bustGhost();
// Okay, that's it for the early stuff! Put on the outfit and go coil some wire!
// The outfit maximises MP so as much of it is available after the test as possible
outfitCoilWire();
castLibrams();