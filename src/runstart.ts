import {
    autosell,
    cliExecute,
    create,
    inHardcore,
    myLevel,
    mySpleenUse,
    runChoice,
    takeStorage,
    use,
    visitUrl,
} from "kolmafia";
import { $item, get, have, SongBoom } from "libram";
import { useIfHave } from "./lib";

// Turn zero stuff
export default function runstart(): void {
    // Hit up the council to get the intro text out of the way
    visitUrl("council.php");
    // Visit Toot Oriole
    visitUrl("tutorial.php?action=toot");
    useIfHave($item`letter from King Ralph XI`);
    useIfHave($item`pork elf goodies sack`);
    // One of the gems may get sold later to make ends meet
    autosell(1, $item`Newbiesport™ tent`);
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
    if (get("_birdOfTheDay") === "") use(1, $item`Bird-a-Day calendar`);
    if (get("_horsery") !== "dark horse") {
        cliExecute("horsery dark horse");
    }
    // Vote - weapon damage and familiar experience
    // Need to check this modifier thing as it tracks most reliably
    if (get("_voteModifier") === "") {
        visitUrl("place.php?whichplace=town_right&action=townright_vote");
        visitUrl("choice.php?option=1&whichchoice=1331&g=2&local%5B%5D=2&local%5B%5D=3");
        // Hit up the booth again so mafia correctly tracks the bonuses
        visitUrl("place.php?whichplace=town_right&action=townright_vote");
    }
    // Flip the reverser as this thing is funny exactly once
    if (!get("backupCameraReverserEnabled")) cliExecute("backupcamera reverser on");
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
    // Do pulls, if not in hardcore
    if (!inHardcore()) {
        for (const pull of [
            $item`Staff of the Roaring Hearth`,
            $item`repaid diaper`,
            $item`meteorite necklace`,
            $item`tiny costume wardrobe`,
            $item`Stick-Knife of Loathing`,
        ]) {
            if (!have(pull)) takeStorage(1, pull);
        }
    }
}
