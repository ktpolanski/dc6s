import { myFamiliar } from "kolmafia";
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
  // And then smack with a stick because saber is a thing
  kill(): Macro {
    return this.delevel().value().attack().repeat();
  }
  static kill(): Macro {
    return new Macro().kill();
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
