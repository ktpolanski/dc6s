import { cliExecute, myDaycount, userConfirm } from "kolmafia";
import { get } from "libram";
import { breakfast, garbo, gashHop, nightcap, postrun } from "./lib";

// Wrap the half-loop into a main() function, calling the script will find and run it
// It's necessary as this way I can return easily to combat garbo heisenbugs
export function main(): void {
    // Pre-ascension garbo leg
    // garbo() true means ascending
    // nightcap() true means done for the day, put pyjamas on
    if (myDaycount() > 1) {
        const hop = userConfirm("Hop the gash automatically? Won't perm any skills this way");
        breakfast();
        garbo(true);
        nightcap(false);
        garbo(true);
        gashHop(hop);
    }
    // Run DC6S proper
    if (!get("kingLiberated")) {
        if (!cliExecute("dc6s")) throw "DC6S errored out";
        // If I go straight into garbo from here, it doesn't use organ cleaners correctly
        // So return out and run again from another wrapper layer. Fun!
        return;
    }
    // Post-ascension garbo leg
    if (myDaycount() === 1) {
        postrun();
        breakfast();
        garbo(false);
        nightcap(true);
    }
}
