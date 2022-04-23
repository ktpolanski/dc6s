import { cliExecute, myDaycount } from "kolmafia";
import { get } from "libram";
import { breakfast, garbo, gashHop, nightcap, postrun } from "./lib";

// Wrap the half-loop into a main() function, calling the script will find and run it
// It's necessary as this way I can return easily to combat garbo heisenbugs

// Accept an optional argument after the script name:
// - noascend prepares for ascension but leaves the user in front of the gash
// - hardcore does HCCS (the default is SCCS)
export function main(arg = ""): void {
    // Pre-ascension garbo leg
    // garbo() true means ascending
    // nightcap() true means done for the day, put pyjamas on
    if (myDaycount() > 1) {
        breakfast();
        garbo(true);
        nightcap(false);
        garbo(true);
        // This will internally parse the various possible input options
        gashHop(arg);
    }
    // Run DC6S proper
    if (!get("kingLiberated")) {
        if (!cliExecute("dc6s")) throw "DC6S errored out";
        // If I go straight into garbo from here
        // Sometimes it doesn't use organ cleaners correctly
        // If that starts happening again, add a return here
    }
    // Post-ascension garbo leg
    if (myDaycount() === 1) {
        postrun();
        breakfast();
        garbo(false);
        nightcap(true);
    }
}
