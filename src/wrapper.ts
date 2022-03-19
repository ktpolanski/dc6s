import { cliExecute } from "kolmafia";

// The entire half-loop wrapper cannot run uninterrupted
// As this leads to a bizarre garbo heisenbug where organ cleaners don't work properly
// However, interrupting and re-running some time after DC6S is done works fine
// So the half-loop script now returns after DC6S. Just re-run it again
if (cliExecute("dc6s_halfloop")) cliExecute("dc6s_halfloop");
