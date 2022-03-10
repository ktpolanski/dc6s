import { setAutoAttack } from "kolmafia";
import { CommunityService, get } from "libram";
import { assertTest, freeKillsLeft, PropertyManager } from "./lib";
import level from "./level";
import runstart from "./runstart";
import {
    coilWirePrep,
    famWeightPrep,
    hotResPrep,
    hpPrep,
    itemPrep,
    moxiePrep,
    musclePrep,
    mysticalityPrep,
    noncombatPrep,
    spellPrep,
    weaponPrep,
} from "./tests";

// Do this try/finally syntax to be able to undo autoattack/CCS/recovery settings
try {
    // Set up the twiddle CCS script and skip autorecovery
    PropertyManager.set({
        customCombatScript: "dc6s",
        battleAction: "custom combat script",
        recoveryScript: "",
    });
    // Do turn zero stuff like pick up items, then run coil wire
    runstart();
    assertTest(CommunityService.CoilWire, coilWirePrep, 60);
    // A sign that we're done levelling is we ran out of free kills
    if (freeKillsLeft() > 0) level();
    // Do stat tests first as buffed up, so they go easy now
    assertTest(CommunityService.Moxie, moxiePrep, 1);
    assertTest(CommunityService.HP, hpPrep, 1);
    assertTest(CommunityService.Muscle, musclePrep, 1);
    assertTest(CommunityService.Mysticality, mysticalityPrep, 1);
    // Now run the familiar weight block
    // As familiar weight buffs were applied during levelling
    assertTest(CommunityService.HotRes, hotResPrep, 1);
    assertTest(CommunityService.Noncombat, noncombatPrep, 1);
    assertTest(CommunityService.FamiliarWeight, famWeightPrep, 25);
    // Now do the weapon/spell damage block
    // This might swap places with familiar weight in softcore routing later
    assertTest(CommunityService.WeaponDamage, weaponPrep, 1);
    assertTest(CommunityService.SpellDamage, spellPrep, 25);
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
