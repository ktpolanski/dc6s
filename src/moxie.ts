import {
    $effects,
} from "libram"
import {
    getBuffs,
} from "./lib"
import {
    outfitMoxie
} from "./outfit"

// Acquire equaliser
getBuffs($effects`expert oiliness, blessing of the bird`)
// Stick on outfit
outfitMoxie();