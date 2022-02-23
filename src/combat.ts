import { myFamiliar, Skill } from "kolmafia";
import { $effect, $familiar, $item, $monster, $skill, get, have, StrictMacro } from "libram";
import { freeKillsLeft } from "./lib";

// Are we allowed to cast Feel Pride? (helper function for NEP logic)
function canFeelPride(): boolean {
    // Preferred condition - rocking a left-hand man, bowled sideways and have inner elf
    // (if the preference is 0, then the ball will return upon entering combat)
    const cond1 = ((myFamiliar() === $familiar`left-hand man`) && (get("cosmicBowlingBallReturnCombats") > 0) && have($effect`inner elf`));
    // Panic button conditions - about to run out of garbage shirt charges
    const cond2 = (get("garbageShirtCharge") < 5);
    // The final NEP turns are free kills, let's not run out of those either
    const cond3 = (freeKillsLeft() < 5);
    return (cond1 || cond2 || cond3);
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

    // Try to cheese in some extra value stuff
    value(): Macro {
        return this.trySkill($skill`Extract`).trySkill($skill`Sing Along`);
    }
    static value(): Macro {
        return new Macro().value();
    }

    // The default mode of operation is to do the two above
    // Maybe add an extra skill in there
    setup(skill = $skill`none`): Macro {
        if (skill !== $skill`none`) {
            // We got given a skill, work it into the macro
            return this.delevel().value().trySkill(skill);
        } else {
            // No skill just basic stuff
            return this.delevel().value();
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
    
    // On occasion we get to do the above but with a geyser finale
    geyser(skill = $skill`none`): Macro {
        return this.setup(skill).skill($skill`saucegeyser`).repeat();
    }
    static geyser(skill = $skill`none`): Macro {
        return new Macro().geyser(skill);
    }
    
    // Protopack ghosts want to be shot and trapped
    // Which is a bit scary with its vision of heavy hits
    ghost(): Macro {
        return this.delevel().trySkill($skill`entangling noodles`)
            .trySkill($skill`shoot ghost`)
            .trySkill($skill`shoot ghost`)
            .trySkill($skill`shoot ghost`)
            .trySkill($skill`trap ghost`);
    }
    static ghost(): Macro {
        return new Macro().ghost();
    }
    
    // The NEP wants to make use of Feel Pride and bowling sideways
    // But the former under a pretty restrictive set of conditions
    // For which there's a helper function earlier in the file
    NEP(): Macro {
        return this.externalIf(canFeelPride(), Macro.trySkill($skill`feel pride`))
            .trySkill($skill`bowl sideways`);
    }
    static NEP(): Macro {
        return new Macro().NEP();
    }

    // Get out of combat for free!
    // Save KGB and Snokebomb for mother slime as those work against her
    freeRun(): Macro {
        return this.externalIf(
            (myFamiliar() === $familiar`Frumious Bandersnatch` && have($effect`Ode to Booze`)) ||
                myFamiliar() === $familiar`Pair of Stomping Boots`,
            "runaway"
        )
            .trySkill($skill`Asdon Martin: Spring-Loaded Front Bumper`)
            .trySkill($skill`Reflex Hammer`)
            .trySkill($skill`Throw Latte on Opponent`)
            .trySkill($skill`Feel Hatred`);
    }
    static freeRun(): Macro {
        return new Macro().freeRun();
    }
    
    // Unload a free kill
    // Unless it's a sausage goblin, a free fight - then just punch it
    freeKill(): Macro {
        return this.if_($monster`sausage goblin`, Macro.attack().repeat())
            .trySkill($skill`chest x-ray`)
            .trySkill($skill`shattering punch`)
            .trySkill($skill`gingerbread mob hit`)
            .trySkill($skill`asdon martin: missile launcher`)
    }
    static freeKill(): Macro {
        return new Macro().freeKill();
    }
}
