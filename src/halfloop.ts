import { cliExecute, myDaycount, userConfirm } from "kolmafia";
import { get } from "libram";
import { breakfast, garbo, gashHop, nightcap, postrun } from "./lib";

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
}

// Post-ascension garbo leg
if (myDaycount() === 1) {
    postrun();
    breakfast();
    garbo(false);
    nightcap(true);
}
