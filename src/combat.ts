import { haveEquipped, inHardcore, myFamiliar } from "kolmafia";
import { $effect, $familiar, $item, $monster, $skill, get, have, StrictMacro } from "libram";
import { freeKillsLeft } from "./lib";

// Are we allowed to cast Feel Pride? (helper function for NEP logic)
function canFeelPride(): boolean {
    // Do we even have a Feel Pride to cast?
    if (get("_feelPrideUsed") >= 3) return false;
    // Preferred condition - rocking a familiar scrapbook, bowled sideways and have inner elf
    // (if the preference is 0, then the ball will return upon entering combat)
    const cond1 =
        haveEquipped($item`familiar scrapbook`) &&
        get("cosmicBowlingBallReturnCombats") > 0 &&
        have($effect`Inner Elf`);
    // Panic button conditions - about to run out of garbage shirt charges
    const cond2 = get("garbageShirtCharge") < 5;
    // The final NEP turns are free kills, let's not run out of those either
    const cond3 = freeKillsLeft() < 5;
    return cond1 || cond2 || cond3;
}

export default class Macro extends StrictMacro {
    // Pop some basic delevel and the lovebug stun
    delevel(): Macro {
        return this.trySkill($skill`Micrometeorite`)
            .tryItem($item`Time-Spinner`)
            .trySkill($skill`Summon Love Gnats`);
    }
    static delevel(): Macro {
        return new Macro().delevel();
    }

    // In softcore, the camel should be used for a spit as soon as it's there
    camel(): Macro {
        return this.externalIf(
            !inHardcore() && get("camelSpit") === 100,
            Macro.trySkill($skill`%fn, spit on me!`)
        );
    }
    static camel(): Macro {
        return new Macro().camel();
    }

    // Try to cheese in some extra value stuff
    value(): Macro {
        return this.trySkill($skill`Extract`).trySkill($skill`Sing Along`);
    }
    static value(): Macro {
        return new Macro().value();
    }

    // The default mode of operation is to do the three above
    // Maybe add an extra skill in there
    setup(skill = $skill`none`): Macro {
        if (skill !== $skill`none`) {
            // We got given a skill, work it into the macro
            return this.delevel().camel().value().trySkill(skill);
        } else {
            // No skill just basic stuff
            return this.delevel().camel().value();
        }
    }
    static setup(skill = $skill`none`): Macro {
        return new Macro().setup(skill);
    }

    // ...and then smack with a stick because saber is a thing
    kill(skill = $skill`none`): Macro {
        return this.setup(skill).attack().repeat();
    }
    static kill(skill = $skill`none`): Macro {
        return new Macro().kill(skill);
    }

    // On occasion we get to do the above but with a saucestorm finale
    saucestorm(skill = $skill`none`): Macro {
        return this.setup(skill)
            .skill($skill`Saucestorm`)
            .repeat();
    }
    static saucestorm(skill = $skill`none`): Macro {
        return new Macro().saucestorm(skill);
    }

    // Protopack ghosts want to be shot and trapped
    // Which is a bit scary with its vision of heavy hits
    ghost(): Macro {
        return this.delevel()
            .trySkill($skill`Entangling Noodles`)
            .trySkill($skill`Shoot Ghost`)
            .trySkill($skill`Shoot Ghost`)
            .trySkill($skill`Shoot Ghost`)
            .trySkill($skill`Trap Ghost`);
    }
    static ghost(): Macro {
        return new Macro().ghost();
    }

    // The late scalers want to make use of Feel Pride and bowling sideways
    // But the former under a pretty restrictive set of conditions
    // For which there's a helper function earlier in the file
    // Meanwhile, the latter should not accidentally get used beyond 4 bowlos
    bowloPride(): Macro {
        return this.externalIf(canFeelPride(), Macro.trySkill($skill`Feel Pride`)).externalIf(
            get("_cosmicBowlingSkillsUsed") < 4,
            Macro.trySkill($skill`Bowl Sideways`)
        );
    }
    static bowloPride(): Macro {
        return new Macro().bowloPride();
    }

    // Get out of combat for free!
    // Save KGB and Snokebomb for mother slime as those work against her
    freeRun(): Macro {
        return this.externalIf(
            (myFamiliar() === $familiar`Frumious Bandersnatch` && have($effect`Ode to Booze`)) ||
                myFamiliar() === $familiar`Pair of Stomping Boots`,
            "runaway"
        )
            .trySkill($skill`Reflex Hammer`)
            .trySkill($skill`Throw Latte on Opponent`)
            .trySkill($skill`Feel Hatred`);
    }
    static freeRun(): Macro {
        return new Macro().freeRun();
    }

    // Unload a free kill
    // Unless it's a free fight - then just punch it
    freeKill(): Macro {
        return this.if_($monster`sausage goblin`, Macro.attack().repeat())
            .if_("monstername black crayon", Macro.attack().repeat())
            .trySkill($skill`Chest X-Ray`)
            .trySkill($skill`Shattering Punch`)
            .trySkill($skill`Gingerbread Mob Hit`)
            .trySkill($skill`Asdon Martin: Missile Launcher`);
    }
    static freeKill(): Macro {
        return new Macro().freeKill();
    }
}
