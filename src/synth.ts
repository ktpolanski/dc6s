import { Item, itemAmount, retrieveItem, sweetSynthesis, toItem, useSkill, visitUrl } from "kolmafia";
import { $item, $items, $skill, get, have, set } from "libram";
import { canCastLibrams } from "./lib";

export class SynthesisPlanner {
    // Prepare a sorted array of mod0 candies, as we'd rather eat pecan than sprouts
    // We always have sprouts at our disposal
    mod0: Item[] = $items`peppermint sprout, peppermint sprout, peppermint sprout`;

    // Acquire candy to work with
    getCandy() {
        // There are three sources of complex candy we'll 100% use:
        // The peppermint garden
        visitUrl("campground.php?action=garden");
        // The crimbo candy summon in all its undeterministic glory
        if (get("_candySummons") === 0) useSkill(1, $skill`Summon Crimbo Candy`);
        // And the mimic equip
        retrieveItem(1, $item`bag of many confections`);
        // The only simple candy we'll need is chubby and plump
        if (!get("_chubbyAndPlumpUsed")) useSkill(1, $skill`chubby and plump`);
    }

    // Add any pecans we may have found to the mod0 candy list
    addPecans() {
        // Now we'll be able to this.mod0.shift() to get our cheapest mod0 candy
        for (let i = 1; i <= itemAmount($item`Crimbo candied pecan`); i++) {
            this.mod0.unshift($item`Crimbo candied pecan`);
        }
    }

    plan() {
        // Get the complex candy in order, and let the solver know about any pecans
        this.getCandy();
        this.addPecans();

        // So these two outcomes are really common in the plans
        set("_dc6s_myst_candy", $items`Chubby and Plump bar, bag of many confections`); // 2+4
        set("_dc6s_item_candy", [this.mod0.shift(), $item`peppermint twist`]); // 0+1
        // But what if this ate a good this.mod0.shift() and then gets overwritten?
        // In 3 barks, mod0 is 100% peppermint sprouts so it doesn't matter

        // 3 barks, 2 fudge, 1 bark are all lit
        if (itemAmount($item`Crimbo peppermint bark`) >= 3) {
            set("_dc6s_exp_candy", [this.mod0.shift(), $item`Crimbo peppermint bark`]); // 0+3
            // Common myst
            set("_dc6s_item_candy", $items`Crimbo peppermint bark, Crimbo peppermint bark`); // 3+3
        } else if (itemAmount($item`Crimbo fudge`) >= 2) {
            set("_dc6s_exp_candy", $items`Crimbo fudge, Crimbo fudge`); // 4+4
            // Common myst and item
        } else if (itemAmount($item`Crimbo peppermint bark`) >= 1) {
            set("_dc6s_exp_candy", [this.mod0.shift(), $item`Crimbo peppermint bark`]); // 0+3
            // Common myst and item
        } else {
            // 1 fudge requires candy heart luck, pecan yahtzee flat out doesn't work
            // Just summon sugar and get it over with
            set("_dc6s_exp_candy", [this.mod0.shift(), $item`sugar shield`]); // 0+3
            // Common myst and item
        }
    }
}

export function retrieveSynth(buff:string): Item[] {
    // Get the candy pair out of the appropriate preference
    // And turn it back into an array of items with the use of a .map
    // (think python's list comprehension in terms of outcome)
    return get(`_dc6s_${buff}_candy`).split(",").map(x => toItem(x));
}

// Actually perform the synthesis
export function performSynth(buff:string): void {
    const candies = retrieveSynth(buff);
    for (const candy of candies) {
        // We should have a candy that crafts into this easily
        // So do the crafting if need be
        if (!retrieveItem(candy)) throw "Something went wrong with synthesis";
    }
    // Okay, here we go...
    sweetSynthesis(candies[0], candies[1]);
}