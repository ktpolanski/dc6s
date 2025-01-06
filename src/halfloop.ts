import { cliExecute, myDaycount, print } from "kolmafia";
import { get } from "libram";
import { breakfast, cleanup, garbo, gashHop, locko, nightcap, postrun, pvp } from "./lib";

// Wrap the half-loop into a main() function, calling the script will find and run it
// It's necessary as this way I can return easily to combat garbo heisenbugs

// Accept an optional argument after the script name:
// - 70 is a dc6s argument and is passed to it
// - noascend prepares for ascension but leaves the user in front of the gash
// - postrun ascends, does dc6s, postrun prep, and deposits the user for aftercore
// - hardcore does HCCS (the default is SCCS)
// - nopvp skips PvP
export function main(arg = ""): void {
    // Pre-ascension garbo leg
    // garbo() true means ascending
    // nightcap() true means done for the day, put pyjamas on
    if (myDaycount() > 1) {
        locko();
        breakfast();
        garbo(true);
        nightcap(false);
        garbo(true);
        pvp(arg);
        // This will internally parse the various possible input options
        gashHop(arg);
    }
    // Run DC6S proper
    if (!get("kingLiberated")) {
        // Are we going for a 1/70?
        const dc6sCall = arg.includes("70") ? "dc6s 70" : "dc6s";
        if (!cliExecute(dc6sCall)) throw "DC6S errored out";
        // If I go straight into garbo from here
        // Sometimes it doesn't use organ cleaners correctly
        // If that starts happening again, add a return here
    }
    // Post-ascension garbo leg
    if (myDaycount() === 1) {
        postrun();
        locko();
        breakfast();
        if (!arg.includes("postrun")) {
            garbo(false);
            pvp(arg);
            cleanup();
            nightcap(true);
        } else print("In post-run aftercore!", "blue");
    }
}
