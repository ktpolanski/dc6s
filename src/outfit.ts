import {
    canEquip,
    cliExecute,
    create,
    equip,
    equippedItem,
    Item,
    print,
    Slot,
    toSlot,
    use,
    useFamiliar,
} from "kolmafia";
import {
    $familiar,
    $item,
    $items,
    $slot,
    get,
    have,
} from "libram";
import {
    foldIfNotHave,
    setRetroCape,
} from "./lib";

// Outfits are defined as maps (dictionaries)
// Where the keys are slots and the values are an array of items
// The items are sorted in descending order of desirability
// And once one is found that goes on, the slot is deemed sorted

// Put the specified outfit on
function dressUp(outfit: Map<Slot, Item[]>) : void {
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
function applyChanges(outfit: Map<Slot, Item[]>, changes: (Item | [Slot, Item])[]) : void{
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
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`daylight shavings helmet`],
        [$slot`back`, $items`lov epaulettes, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`weeping willow wand, familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`retrospecs`],
        [$slot`acc2`, $items`eight days a week pill keeper`],
        [$slot`acc3`, $items`kremlin's greatest briefcase`]
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
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`daylight shavings helmet`],
        [$slot`back`, $items`protonic accelerator pack`],
        [$slot`shirt`, $items`fresh coat of paint`],
        [$slot`weapon`, $items`weeping willow wand`],
        [$slot`offhand`, $items`familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`hewn moon-rune spoon`],
        [$slot`acc2`, $items`eight days a week pill keeper`],
        [$slot`acc3`, $items`kremlin's greatest briefcase`]
    ]);
    dressUp(outfit);
}

// The coil outfit aims to maximise MP for subsequent buffing kickstarting
export function outfitCoilWire(): void {
    setRetroCape("heck", "thrill");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`iunion crown`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`fresh coat of paint`],
        [$slot`weapon`, $items`weeping willow wand`],
        [$slot`offhand`, $items`abracandalabra`],
        [$slot`pants`, $items`cargo cultist shorts`],
        [$slot`acc1`, $items`retrospecs`],
        [$slot`acc2`, $items`hewn moon-rune spoon`],
        [$slot`acc3`, $items`kremlin's greatest briefcase`]
    ]);
    dressUp(outfit);
    useFamiliar($familiar`disembodied hand`);
    equip($slot`familiar`, $item`industrial fire extinguisher`);
}

// The default levelling outfit
export function outfit(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("heck", "thrill");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`astral chapeau, daylight shavings helmet`],
        [$slot`back`, $items`lov epaulettes, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`makeshift garbage shirt, fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`retrospecs`],
        [$slot`acc2`, $items`battle broom, eight days a week pill keeper`],
        [$slot`acc3`, $items`your cowboy boots`]
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
}

// Putting on some ML to fight non-scaling stuff like snojo
// Use with the .geyser() macro!
export function outfitML(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("heck", "thrill");
    // The ML forms are only used here, so no helper functions
    if (get("backupCameraMode") !== "ml") cliExecute("backupcamera ml");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`daylight shavings helmet`],
        [$slot`back`, $items`lov epaulettes, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`fresh coat of paint`],
        [$slot`weapon`, $items`weeping willow wand, fourth of may cosplay saber`],
        [$slot`offhand`, $items`familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`hewn moon-rune spoon`],
        [$slot`acc2`, $items`battle broom, eight days a week pill keeper`],
        [$slot`acc3`, $items`backup camera`]
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
}

// Familiar weight stuff, useful both in run and for the test
export function outfitFamWeight(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("heck", "thrill");
    // Fold the burning newspaper into the crane if need be
    if (have($item`burning newspaper`)) create(1, $item`burning paper crane`);
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`daylight shavings helmet`],
        [$slot`back`, $items`lov epaulettes, unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`makeshift garbage shirt, fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`burning paper crane, familiar scrapbook`],
        [$slot`pants`, $items`tinsel tights, pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`brutal brogues`],
        [$slot`acc2`, $items`hewn moon-rune spoon`],
        [$slot`acc3`, $items`beach comb`]
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
}

// Moxie test outfit
export function outfitMoxie(): void {
    setRetroCape("robot", "thrill");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`very pointy crown`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`industrial fire extinguisher`],
        [$slot`pants`, $items`cargo cultist shorts`],
        [$slot`acc1`, $items`retrospecs`],
        [$slot`acc2`, $items`beach comb`],
        [$slot`acc3`, $items`"I voted!" sticker`]
    ]);
    dressUp(outfit);
}

// Muscle (and HP) test outfit
// Cargo shorts trivialise the HP test
export function outfitMuscle(): void {
    foldIfNotHave($item`wad of used tape`);
    setRetroCape("vampire", "thrill");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`wad of used tape`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`dented scepter`],
        [$slot`pants`, $items`cargo cultist shorts`],
        [$slot`acc1`, $items`retrospecs`],
        [$slot`acc2`, $items`brutal brogues`],
        [$slot`acc3`, $items`"I voted!" sticker`]
    ]);
    dressUp(outfit);
}

// Mysticality test outfit
// The levelling buffs would do this alone tbh
export function outfitMysticality(): void {
    foldIfNotHave($item`wad of used tape`);
    setRetroCape("heck", "thrill");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`astral chapeau, wad of used tape`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`industrial fire extinguisher`],
        [$slot`pants`, $items`pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`dorky glasses, retrospecs`],
        [$slot`acc2`, $items`battle broom`],
        [$slot`acc3`, $items`"I voted!" sticker`]
    ]);
    dressUp(outfit);
}

// Hot resistance test outfit
// Use familiar weight in spare slots for parrot
// This one gets to have an override for cloake saber cheese purposes
export function outfitHotRes(changes: (Item | [Slot, Item])[] = []): void {
    setRetroCape("vampire", "hold");
    // Make KGB give hot resistance
    cliExecute("briefcase enchantment hot");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`daylight shavings helmet`],
        [$slot`back`, $items`unwrapped knock-off retro superhero cape`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`industrial fire extinguisher`],
        [$slot`pants`, $items`pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`kremlin's greatest briefcase`],
        [$slot`acc2`, $items`brutal brogues`],
        [$slot`acc3`, $items`beach comb`]
    ]);
    applyChanges(outfit, changes);
    dressUp(outfit);
    useFamiliar($familiar`exotic parrot`);
}

// Noncombat test outfit
// Put on the powerful glove to cast a cheat code
export function outfitNoncombat(): void {
    cliExecute("briefcase enchantment -combat");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`very pointy crown`],
        [$slot`back`, $items`protonic accelerator pack`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`fourth of may cosplay saber`],
        [$slot`offhand`, $items`industrial fire extinguisher`],
        [$slot`pants`, $items`pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`kremlin's greatest briefcase`],
        [$slot`acc2`, $items`powerful glove`],
        [$slot`acc3`, $items`"I voted!" sticker`]
    ]);
    dressUp(outfit);
    useFamiliar($familiar`disgeist`);
}

// Weapon damage test outfit
export function outfitWeapon(): void {
    foldIfNotHave($item`broken champagne bottle`);
    cliExecute("briefcase enchantment weapon");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`very pointy crown`],
        [$slot`back`, $items`protonic accelerator pack`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`dented scepter`],
        [$slot`offhand`, $items`broken champagne bottle`],
        [$slot`pants`, $items`pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`brutal brogues`],
        [$slot`acc2`, $items`kremlin's greatest briefcase`],
        [$slot`acc3`, $items`powerful glove`]
    ]);
    dressUp(outfit);
}

// Spell damage test outfit
export function outfitSpell(): void {
    foldIfNotHave($item`broken champagne bottle`);
    cliExecute("briefcase enchantment spell");
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`astral chapeau`],
        [$slot`back`, $items`protonic accelerator pack`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`weeping willow wand`],
        [$slot`offhand`, $items`abracandalabra`],
        [$slot`pants`, $items`pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`battle broom`],
        [$slot`acc2`, $items`kremlin's greatest briefcase`],
        [$slot`acc3`, $items`powerful glove`]
    ]);
    dressUp(outfit);
}

// Item test outfit
export function outfitItem(): void {
    foldIfNotHave($item`wad of used tape`);
    let outfit = new Map<Slot, Item[]>([
        [$slot`hat`, $items`wad of used tape`],
        [$slot`back`, $items`vampyric cloake`],
        [$slot`shirt`, $items`shoe ad t-shirt, fresh coat of paint`],
        [$slot`weapon`, $items`weeping willow wand`],
        [$slot`offhand`, $items`cursed magnifying glass`],
        [$slot`pants`, $items`pantogram pants, cargo cultist shorts`],
        [$slot`acc1`, $items`your cowboy boots`],
        [$slot`acc2`, $items`guzzlr tablet`],
        [$slot`acc3`, $items`gold detective badge`]
    ]);
    dressUp(outfit);
    useFamiliar($familiar`trick-or-treating tot`);
    equip($item`li'l ninja costume`);
}