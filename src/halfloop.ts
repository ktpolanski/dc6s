import { cliExecute, myDaycount } from "kolmafia";
import { get } from "libram";
import { breakfast, garbo, gashHop, nightcap, postrun } from "./lib";

// Wrap the half-loop into a main() function, calling the script will find and run it
// It's necessary as this way I can return easily to combat garbo heisenbugs

// Accept an optional argument after the script name
// If set to noascend, deposit the user in front of the gash, ready to hop
// Useful if perming stuff is going to happen
export function main(hop?: string): void {
    // Pre-ascension garbo leg
    // garbo() true means ascending
    // nightcap() true means done for the day, put pyjamas on
    if (myDaycount() > 1) {
        breakfast();
        garbo(true);
        nightcap(false);
        garbo(true);
        // This turns the input argument into a true/false that gashHop() understands
        gashHop(hop !== "noascend");
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
