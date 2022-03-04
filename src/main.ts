import { cliExecute, setAutoAttack } from "kolmafia";
import { CommunityService, get } from "libram";
import { assertTest, freeKillsLeft } from "./lib"
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
} from "./tests"

// Do this try/finally syntax to be able to undo autoattack/CCS settings
try {
    // Set up the twiddle CCS script
    cliExecute("ccs dc6s");
    // Do turn zero stuff like pick up items, then run coil wire
    runstart();
    assertTest(CommunityService.CoilWire.run(coilWirePrep, false, 60), "Coil Wire");
    // A sign that we're done levelling is we ran out of free kills
    if (freeKillsLeft() > 0) level();
    // Do stat tests first as buffed up, so they go easy now
    assertTest(CommunityService.Moxie.run(moxiePrep, false, 1), "Moxie");
    assertTest(CommunityService.HP.run(hpPrep, false, 1), "HP");
    assertTest(CommunityService.Muscle.run(musclePrep, false, 1), "Muscle");
    assertTest(CommunityService.Mysticality.run(mysticalityPrep, false, 1), "Mysticality");
    // Now run the familiar weight block 
    // As familiar weight buffs were applied during levelling
    assertTest(CommunityService.HotRes.run(hotResPrep, false, 1), "Hot Resistance");
    assertTest(CommunityService.Noncombat.run(noncombatPrep, false, 1), "Noncombat");
    assertTest(CommunityService.FamiliarWeight.run(famWeightPrep, false, 25), "Familiar Weight");
    // Now do the weapon/spell damage block
    // This might swap places with familiar weight in softcore routing later
    assertTest(CommunityService.WeaponDamage.run(weaponPrep, false, 1), "Weapon Damage");
    assertTest(CommunityService.SpellDamage.run(spellPrep, false, 25), "Spell Damage");
    // And cap it off with the item test for Feel Lost purposes
    assertTest(CommunityService.BoozeDrop.run(itemPrep, false, 1), "Item");
} finally {
    setAutoAttack(0);
    cliExecute("ccs default");
}

// End the run once the bits are done
if (get("csServicesPerformed").split(",").length === 11) {
    CommunityService.donate();
    CommunityService.printLog();
}