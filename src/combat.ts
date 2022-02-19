import { myFamiliar, Skill } from "kolmafia";
import { $effect, $familiar, $item, $skill, have, StrictMacro } from "libram";

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
  // And then smack with a stick because saber is a thing
  kill(skill:Skill = $skill`none`): Macro {
    if (skill !== $skill`none`) {
      // We got given a skill, work it into the macro
      return this.delevel().value().trySkill(skill).attack().repeat();
    } else {
      // No skill just basic kill
      return this.delevel().value().attack().repeat();
    }
  }
  static kill(skill:Skill = $skill`none`): Macro {
    return new Macro().kill(skill);
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
}
