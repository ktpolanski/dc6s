import {
    canEquip,
    cliExecute,
    create,
    equip,
    Familiar,
    inHardcore,
    Item,
    Slot,
    toSlot,
    useFamiliar,
} from "kolmafia";
import { $effect, $familiar, $item, $items, $slot, get, have } from "libram";
import { bjornify, checkKGB, foldIfNotHave, setParka, setRetroCape } from "./lib";

// Outfits are defined as maps (dictionaries)
// Where the keys are slots and the values are an array of items
// The items are sorted in descending order of desirability
// And once one is found that goes on, the slot is deemed sorted

// Put the specified outfit on
function dressUp(outfit: Map<Slot, Item[]>): void {
    for (const [outfitSlot, outfitItems] of outfit) {
        // Check the potential items to equip - do we have them and can we put them on?
        for (const option of outfitItems) {
            if (have(option) && canEquip(option)) {
                // If so, put them on and the slot is done, so break out
                equip(outfitSlot, option);
                break;
            }
        }
    }
}

// Apply changes to the outfit
// No need to return it as the modified values are seen upstream
function applyChanges(outfit: Map<Slot, Item[]>, changes: (Item | [Slot, Item])[]): void {
    if (changes.length !== 0) {
        for (const override of changes) {
            // Each override will go to the front of the array of items
            // We're doing a definite assignment assertion in the unshift
            // As otherwise this whines that what if this is undefined
            if (Array.isArray(override)) {
                // We've got both the slot and the item given
                const overrideSlot = override[0];
                const overrideItem = override[1];
                outfit.get(overrideSlot)!.unshift(overrideItem);
            } else {
                // Auto-detect slot from item
                const overrideSlot = toSlot(override);
                const overrideItem = override;
                outfit.get(overrideSlot)!.unshift(overrideItem);
            }
        }
    }
}

// The pre-coil outfit where stats are tiny, so go for flat boosts
export function outfitEarly(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("heck", "thrill");
    setParka("spikolodon");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`Daylight Shavings Helmet`],
        [$slot`back`, $items`LOV Epaulettes, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`weeping willow wand, familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`Retrospecs`],
        [$slot`acc2`, $items`Eight Days a Week Pill Keeper`],
        [$slot`acc3`, $items`Kremlin's Greatest Briefcase`],
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
}

// Ghosts care not for your stats, but also don't want a lot of ML
// (so that they stay put during Shoot Ghost)
// So just add all the +stat gain stuff that's on offer... which is not a lot
// Fine to skip saber as the ghost will get busted
export function outfitGhost(): void {
    setRetroCape("heck", "thrill");
    setParka("spikolodon");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`Daylight Shavings Helmet`],
        [$slot`back`, $items`protonic accelerator pack`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`weeping willow wand`],
        [$slot`offhand`, $items`familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`hewn moon-rune spoon`],
        [$slot`acc2`, $items`Eight Days a Week Pill Keeper`],
        [$slot`acc3`, $items`Kremlin's Greatest Briefcase`],
    ]);
    dressUp(outfit);
}

// The coil outfit aims to maximise MP for subsequent buffing kickstarting
export function outfitCoilWire(): void {
    setRetroCape("heck", "thrill");
    setParka("ghostasaurus");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`Iunion Crown`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`weeping willow wand`],
        [$slot`offhand`, $items`Abracandalabra`],
        [$slot`pants`, $items`Cargo Cultist Shorts`],
        [$slot`acc1`, $items`Retrospecs`],
        [$slot`acc2`, $items`hewn moon-rune spoon`],
        [$slot`acc3`, $items`Kremlin's Greatest Briefcase`],
    ]);
    dressUp(outfit);
    useFamiliar($familiar`Left-Hand Man`);
    equip($slot`familiar`, $item`unbreakable umbrella`);
}

// The default levelling outfit
// The off-hand becomes an unbreakable umbrella for uncapped scalers
export function outfit(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("heck", "thrill");
    setParka("spikolodon");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`astral chapeau, Daylight Shavings Helmet`],
        [$slot`back`, $items`LOV Epaulettes, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`makeshift garbage shirt, Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, designer sweatpants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`meteorite necklace, Retrospecs`],
        [$slot`acc2`, $items`battle broom, Eight Days a Week Pill Keeper`],
        [$slot`acc3`, $items`your cowboy boots`],
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
}

// Putting on some ML to fight non-scaling stuff like snojo
// Use with the .saucestorm() macro!
export function outfitML(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("heck", "thrill");
    setParka("spikolodon");
    // The ML forms are only used here, so no helper functions
    if (get("backupCameraMode") !== "ml") cliExecute("backupcamera ml");
    if (!checkKGB("Monster Level")) cliExecute("briefcase enchantment ml");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`Daylight Shavings Helmet`],
        [$slot`back`, $items`LOV Epaulettes, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`weeping willow wand, Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`unbreakable umbrella`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`hewn moon-rune spoon`],
        [$slot`acc2`, $items`Kremlin's Greatest Briefcase`],
        [$slot`acc3`, $items`backup camera`],
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
}

// Familiar weight stuff, useful both in run and for the test
// Default to using the spooky pirate skeleton in the bjorn as a common +5lb one
// But allow for an override to do bjorn drop fishing during banderways
export function outfitFamWeight(
    changes: (Item | [Slot, Item])[] = [],
    familiar: Familiar = $familiar`Spooky Pirate Skeleton`
): void {
    setRetroCape("heck", "thrill");
    setParka("spikolodon");
    // Fold the burning newspaper into the crane if need be
    if (have($item`burning newspaper`) && !have($item`burning paper crane`)) {
        create(1, $item`burning paper crane`);
    }
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`Daylight Shavings Helmet`],
        [$slot`back`, $items`Buddy Bjorn, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`makeshift garbage shirt, Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`burning paper crane, familiar scrapbook`],
        [$slot`pants`, $items`repaid diaper, tinsel tights, pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`Brutal brogues`],
        [$slot`acc2`, $items`hewn moon-rune spoon`],
        [$slot`acc3`, $items`Beach Comb`],
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
    bjornify(familiar);
}

// Moxie test outfit
export function outfitMoxie(): void {
    setRetroCape("robot", "thrill");
    setParka("spikolodon");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`very pointy crown`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`unbreakable umbrella`],
        [$slot`pants`, $items`Cargo Cultist Shorts`],
        [$slot`acc1`, $items`meteorite necklace, Retrospecs`],
        [$slot`acc2`, $items`Beach Comb`],
        [$slot`acc3`, $items`"I Voted!" sticker`],
    ]);
    dressUp(outfit);
}

// Muscle (and HP) test outfit
// Cargo shorts trivialise the HP test
export function outfitMuscle(): void {
    foldIfNotHave($item`wad of used tape`);
    setRetroCape("vampire", "thrill");
    setParka("kachungasaur");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`wad of used tape`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`dented scepter`],
        [$slot`pants`, $items`Cargo Cultist Shorts`],
        [$slot`acc1`, $items`meteorite necklace, Retrospecs`],
        [$slot`acc2`, $items`Brutal brogues`],
        [$slot`acc3`, $items`"I Voted!" sticker`],
    ]);
    dressUp(outfit);
}

// Mysticality test outfit
// The levelling buffs would do this alone tbh
export function outfitMysticality(): void {
    foldIfNotHave($item`wad of used tape`);
    setRetroCape("heck", "thrill");
    setParka("spikolodon");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`astral chapeau, wad of used tape`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`unbreakable umbrella`],
        [$slot`pants`, $items`pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`meteorite necklace, dorky glasses, Retrospecs`],
        [$slot`acc2`, $items`battle broom`],
        [$slot`acc3`, $items`your cowboy boots`],
    ]);
    dressUp(outfit);
}

// Hot resistance test outfit
// Use familiar weight in spare slots for parrot
// This one gets to have an override for cloake saber cheese purposes
export function outfitHotRes(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("vampire", "hold");
    setParka("pterodactyl");
    // Make KGB give hot resistance in the event of no DSH buff
    if (!checkKGB("Hot Resistance") && !have($effect`Gull-Wing Moustache`)) {
        cliExecute("briefcase enchantment hot");
    }
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`Daylight Shavings Helmet`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`industrial fire extinguisher`],
        [$slot`pants`, $items`designer sweatpants`],
        [$slot`acc1`, $items`Kremlin's Greatest Briefcase`],
        [$slot`acc2`, $items`cursed monkey's paw`],
        [$slot`acc3`, $items`Brutal brogues`],
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
    useFamiliar($familiar`Exotic Parrot`);
}

// Noncombat test outfit
// Put on the powerful glove to cast a cheat code later
export function outfitNoncombat(): void {
    setParka("pterodactyl");
    if (get("umbrellaState") !== "cocoon") cliExecute("umbrella nc");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`very pointy crown`],
        [$slot`back`, $items`protonic accelerator pack`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`Fourth of May Cosplay Saber`],
        [$slot`offhand`, $items`unbreakable umbrella`],
        [$slot`pants`, $items`pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`Kremlin's Greatest Briefcase`],
        [$slot`acc2`, $items`Powerful Glove`],
        [$slot`acc3`, $items`"I Voted!" sticker`],
    ]);
    dressUp(outfit);
    useFamiliar($familiar`Disgeist`);
}

// Weapon damage test outfit
export function outfitWeapon(): void {
    foldIfNotHave($item`broken champagne bottle`);
    setParka("spikolodon");
    if (!checkKGB("Weapon Damage")) cliExecute("briefcase enchantment weapon");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`very pointy crown`],
        [$slot`back`, $items`protonic accelerator pack`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`dented scepter`],
        [$slot`offhand`, $items`broken champagne bottle`],
        [$slot`pants`, $items`pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`Brutal brogues`],
        [$slot`acc2`, $items`Kremlin's Greatest Briefcase`],
        [$slot`acc3`, $items`Powerful Glove`],
    ]);
    dressUp(outfit);
    if (have($item`Stick-Knife of Loathing`)) {
        useFamiliar($familiar`Disembodied Hand`);
        equip($slot`familiar`, $item`Stick-Knife of Loathing`);
    }
}

// Spell damage test outfit
export function outfitSpell(): void {
    foldIfNotHave($item`broken champagne bottle`);
    setParka("spikolodon");
    // Fold the burning newspaper into the jorts if need be
    if (have($item`burning newspaper`) && !have($item`burning paper jorts`)) {
        create(1, $item`burning paper jorts`);
    }
    // Only need to reconfigure the KGB if in hardcore
    // In softcore just wear the meteorite necklace and all is well
    if (!checkKGB("Spell Damage") && inHardcore()) cliExecute("briefcase enchantment spell");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`astral chapeau`],
        [$slot`back`, $items`Buddy Bjorn, protonic accelerator pack`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`Staff of the Roaring Hearth, weeping willow wand`],
        [$slot`offhand`, $items`Abracandalabra`],
        [$slot`pants`, $items`burning paper jorts, pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`battle broom`],
        [$slot`acc2`, $items`meteorite necklace, Kremlin's Greatest Briefcase`],
        [$slot`acc3`, $items`Powerful Glove`],
    ]);
    dressUp(outfit);
    if (have($item`Stick-Knife of Loathing`)) {
        useFamiliar($familiar`Disembodied Hand`);
        equip($slot`familiar`, $item`Stick-Knife of Loathing`);
    }
    bjornify($familiar`Mechanical Songbird`);
}

// Item test outfit
export function outfitItem(): void {
    foldIfNotHave($item`wad of used tape`);
    setParka("spikolodon");
    if (get("umbrellaState") !== "bucket style") cliExecute("umbrella item");
    const outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`wad of used tape`],
        [$slot`back`, $items`Buddy Bjorn, vampyric cloake`],
        [$slot`shirt`, $items`Jurassic Parka`],
        [$slot`weapon`, $items`oversized sparkler`],
        [$slot`offhand`, $items`unbreakable umbrella`],
        [$slot`pants`, $items`pantogram pants, Cargo Cultist Shorts`],
        [$slot`acc1`, $items`your cowboy boots`],
        [$slot`acc2`, $items`Guzzlr tablet`],
        [$slot`acc3`, $items`Cincho de Mayo`],
    ]);
    dressUp(outfit);
    bjornify($familiar`Party Mouse`);
    useFamiliar($familiar`Trick-or-Treating Tot`);
    equip($item`li'l ninja costume`);
}
