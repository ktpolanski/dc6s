import {
    $effects,
} from "libram"
import {
    getBuffs,
} from "./lib"
import {
    outfitMuscle,
} from "./outfit"

// Ensure equalizer
getBuffs($effects`expert oiliness`)
// Stick on outfit
outfitMuscle();