import { inHardcore, setAutoAttack } from "kolmafia";
import { CommunityService, get } from "libram";
import { assertTest, damageTests, freeKillsLeft, PropertyManager, weightTests } from "./lib";
import level from "./level";
import runstart from "./runstart";
import { coilWirePrep, hpPrep, itemPrep, moxiePrep, musclePrep, mysticalityPrep } from "./tests";

// Do this try/finally syntax to be able to undo autoattack/CCS/recovery settings
try {
    // Set up the twiddle CCS script and skip autorecovery
    PropertyManager.set({
        customCombatScript: "dc6s",
        battleAction: "custom combat script",
        recoveryScript: "",
    });
    // Do turn zero stuff like pick up items, then run coil wire
    // This logTask thing just times how long the functions take to run
    CommunityService.logTask("Run start", runstart);
    assertTest(CommunityService.CoilWire, coilWirePrep, 60);
    // A sign that we're done levelling is we ran out of free kills
    if (freeKillsLeft() > 0) CommunityService.logTask("Levelling", level);
    // Do stat tests first as buffed up, so they go easy now
    assertTest(CommunityService.Moxie, moxiePrep, 1);
    assertTest(CommunityService.HP, hpPrep, 1);
    assertTest(CommunityService.Muscle, musclePrep, 1);
    assertTest(CommunityService.Mysticality, mysticalityPrep, 1);
    // Test order depends on hardcore/softcore
    if (inHardcore()) {
        // In hardcore, familiar weight buffs are all popped during levelling
        // So need to do the weight tests first so they don't run out
        weightTests();
        damageTests();
    } else {
        // In softcore, the critical familiar weight is filled by repaid diaper
        // And the camel spit is used during levelling instead to accelerate things
        // So need to do the damage tests first so the spit doesn't run out
        damageTests();
        weightTests();
    }
    // And cap it off with the item test for Feel Lost purposes
    assertTest(CommunityService.BoozeDrop, itemPrep, 1);
} finally {
    setAutoAttack(0);
    // This reverts the .set() stuff from earlier
    PropertyManager.resetAll();
}

// End the run once the bits are done
if (get("csServicesPerformed").split(",").length === 11) {
    CommunityService.donate();
    CommunityService.printLog();
}
