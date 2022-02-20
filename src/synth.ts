import { Item, itemAmount, retrieveItem, useSkill, visitUrl } from "kolmafia";
import { $item, $items, $skill, get, set } from "libram";
import { canCastLibrams } from "./lib";

export default class SynthesisPlanner {
    // Prepare a sorted array of mod0 candies, as we'd rather eat pecan than sprouts
    // We always have sprouts at our disposal
    mod0: Item[] = $items`peppermint sprout, peppermint sprout, peppermint sprout`;

    // Acquire the complex candy to work with
    getCandy() {
        // There are three sources of complex candy:
        // The peppermint garden
        visitUrl("campground.php?action=garden");
        // The crimbo candy summon in all its undeterministic glory
        if (get("_candySummons") === 0) useSkill(1, $skill`Summon Crimbo Candy`);
        // And the mimic equip
        retrieveItem(1, $item`bag of many confections`);
    }

    // Add any pecans we may have found to the mod0 candy list
    addPecans() {
        // Now we'll be able to this.mod0.shift() to get our cheapest mod0 candy
        for (let i = 1; i <= itemAmount($item`Crimbo candied pecan`); i++) {
            this.mod0.unshift($item`Crimbo candied pecan`);
        }
    }

    // This one scenario is tricky - a 0+1 on myst
    solveTrickyMyst() {
        // We're trying to find a pink or orange candy heart
        while (
            canCastLibrams() &&
            itemAmount($item`orange candy heart`) === 0 &&
            itemAmount($item`pink candy heart`) === 0
        ) {
            useSkill(1, $skill`Summon Candy Heart`);
        }
        // Did we find it?
        if (itemAmount($item`orange candy heart`) > 0) {
            return [$item`orange candy heart`, this.mod0.shift()];
        } else if (itemAmount($item`pink candy heart`) > 0) {
            return [$item`pink candy heart`, $item`peppermint twist`];
        } else {
            // We have failed. But we can just default to the LOV chocolate
            return [$item`LOV Extraterrestrial Chocolate`, $item`peppermint twist`];
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

        // The first three plans (3 barks, 2 fudge, 1 bark) are all lit
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
        } else if (itemAmount($item`Crimbo fudge`) === 1) {
            // 1 fudge is still workable, just needs the LOV chocolate or a candy heart
            set("_dc6s_exp_candy", [$item`Crimbo fudge`, $item`bag of many confections`]); // 4+4
            set("_dc6s_myst_candy", this.solveTrickyMyst()); // 0+1
            // Common item
        } else if (itemAmount($item`Crimbo candied pecan`) >= 3) {
            // Pecan yahtzee is the opposite of lit. We'll need to get a sugar summon
            set("_dc6s_exp_candy", [this.mod0.shift(), $item`sugar shield`]); // 0+3
            // Common myst and item
        }
    }
}
