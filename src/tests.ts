import {
    adv1,
    buy,
    changeMcd,
    cliExecute,
    elementalResistance,
    equip,
    handlingChoice,
    haveEffect,
    myHp,
    myMaxhp,
    runChoice,
    runCombat,
    setAutoAttack,
    toInt,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $effect,
    $effects,
    $element,
    $familiar,
    $item,
    $items,
    $location,
    $monster,
    $skill,
    $slot,
    AsdonMartin,
    CombatLoversLocket,
    get,
    have,
    set,
} from "libram";
import {
    adventureMacro,
    bustGhost,
    castLibrams,
    foldIfNotHave,
    getInnerElf,
    heal,
    getBuffs,
    mapMacro,
    saberCheese,
    setChoice,
    useIfHave,
} from "./lib";
import Macro from "./combat";
import {
    outfit,
    outfitCoilWire,
    outfitEarly,
    outfitFamWeight,
    outfitHotRes,
    outfitItem,
    outfitMoxie,
    outfitMuscle,
    outfitMysticality,
    outfitNoncombat,
    outfitSpell,
    outfitWeapon,
} from "./outfit";
import { performSynth } from "./synth"

// Prepare for coil wire, i.e. do early run stuff
export function coilWirePrep(): void {
	// Pre-coil fights are quite minimal on buffs, not enough mana to go ham
	getBuffs($effects`inscrutable gaze, feeling excited`);
	// Go saber a skeleton real quick
	if (!have($item`orange`)) {
		useFamiliar($familiar`crimbo shrub`);
		// Decorate Crimbo Shrub with LED Mandala, Jack-O-Lantern Lights, Popcorn Strands, and Big Red-Wrapped Presents
		if (!get("_shrubDecorated")) {
			const decorations = toInt($item`box of old Crimbo decorations`);
			visitUrl(`inv_use.php?pwd=&which=99&whichitem=${decorations}`);
			visitUrl(`choice.php?whichchoice=999&pwd=&option=1&topper=2&lights=5&garland=3&gift=2`);
		}
		foldIfNotHave($item`tinsel tights`);
		// Put on the scrapbook to get a scrap off the shrub doing stuff
		outfitEarly($items`familiar scrapbook`);
		mapMacro($location`the skeleton store`, $monster`novelty tropical skeleton`, Macro.trySkill($skill`open a big red present`).trySkill($skill`Use the Force`));
		// Do a quick soak to heal up as early mana is scarce
		if (myHp() < 0.5*myMaxhp()) cliExecute("hottub");
		// This leaves behind the mapping preference set because lol saber
		if (get("mappingMonsters")) set("mappingMonsters", false);
	}
	// Set up MCD on 10 now that shrub has provided us with some funds
	if (!have($item`detuned radio`)) buy(1, $item`detuned radio`);
	changeMcd(10);
	// Catch a kramco with the mimic out, and a paranormal prediction to boot
	if (!have($item`bag of many confections`)) {
		useFamiliar($familiar`stocking mimic`);
		foldIfNotHave($item`tinsel tights`);
		outfitEarly($items`protonic accelerator pack, Kramco Sausage-o-Matic™`);
		adventureMacro($location`noob cave`, Macro.kill());
		heal();
		// Take the bag of many confections off
		equip($slot`familiar`, $item`none`);
	}
	// We got a ghost to bust
	bustGhost();
	// Okay, that's it for the early stuff! Put on the outfit and go coil some wire!
	// The outfit maximises MP so as much of it is available after the test as possible
	outfitCoilWire();
	castLibrams();
}

// Prepare for the moxie test
export function moxiePrep(): void {
	// Acquire equaliser
	getBuffs($effects`expert oiliness, blessing of the bird`);
	// Stick on outfit
	outfitMoxie();
}

// Prepare for the HP test
export function hpPrep(): void {
	// Ensure equalizer
	getBuffs($effects`expert oiliness`);
	// Stick on outfit... just go with muscle
	outfitMuscle();
}

// Prepare for the muscle test
export function musclePrep(): void {
	// Ensure equalizer
	getBuffs($effects`expert oiliness`);
	// Stick on outfit
	outfitMuscle();
}

// Prepare for the mysticality test
export function mysticalityPrep(): void {
	// Stick on outfit
	outfitMysticality();
}

// Prepare for the hot resistance test
export function hotResPrep(): void {
	// Ensure buffs
	getBuffs($effects`feel peaceful, empathy`);
	// Collect extinguisher foam and a cloake buff via saber cheese
	if (!have($effect`fireproof foam suit`)) {
		// The outfit has the saber and the extinguisher in it already
		outfitHotRes($items`vampyric cloake`);
		saberCheese(
			Macro.trySkill($skill`Become a Cloud of Mist`).trySkill($skill`Fire Extinguisher: Foam Yourself`)
		);
		// Need to fix preferences as saber autoattack means mafia doesn't see these being used
		set("_vampyreCloakeFormUses", get("_vampyreCloakeFormUses")-1);
		set("_fireExtinguisherCharge", get("_fireExtinguisherCharge")-10);
	}
	// Stick on outfit proper
	outfitHotRes();
}

// Prepare for the noncombat test
export function noncombatPrep(): void {
	// Fuel up asdon for buffing purposes
	if (!have($effect`driving stealthily`)) {
		if (!AsdonMartin.fillWithInventoryTo(37)) throw "Breadcar refuses to charge to 37!"
	}
	// Get buffs
	getBuffs($effects`sonata of sneakiness, smooth movement, gummed shoes, empathy`);
	getBuffs($effects`throwing some shade, feeling lonely, silent running, driving stealthily`);
	// Apply outfit...
	outfitNoncombat();
	// ...and get one more buff, as the outfit features the powerful glove
	getBuffs($effects`invisible avatar`);
}

// Prepare for the familiar weight test
export function famWeightPrep(): void {
	// Acquire saber cheesed meteor shower
	if (!have($effect`meteor showered`)) {
		useFamiliar($familiar`none`);
		equip($item`fourth of may cosplay saber`);
		saberCheese(Macro.trySkill($skill`meteor shower`));
		// Auto-attack saber means mafia doesn't get to see the meteor shower, let it know
		set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
	}
	// We want to be platypus for aftercore anyway, so let's save a turn here while we're at it
	if (!get("moonTuned")) cliExecute("spoon platypus");
	// Most buffs should be on from levelling, as they get used early to make familiar go brrr
	getBuffs($effects`robot friends, empathy`);
	outfitFamWeight();
	// Quick cheeser thing while we have full weight - set up DDV for spell test later
	// This is good to do now as there's floating feel peaceful from hotres
	// And the parrot is as fat as it's going to get
	while (haveEffect($effect`Visions of the Deep Dark Deeps`) < 30) {
		useFamiliar($familiar`exotic parrot`);
		// Just in case, to avoid disappointment
		if (elementalResistance($element`spooky`) < 10) throw "Can't get enough spooky resistance for DDV!"
		// DDV needs 500 HP minimum
		if ((myMaxhp() < 500) && !have($effect`song of starch`)) useSkill(1, $skill`song of starch`);
		// This thing slaps the HP hard
		heal();
		useSkill(1, $skill`deep dark visions`);
		heal();
	}
	// Use the BBB and its free +10lb equip
	useFamiliar($familiar`baby bugged bugbear`);
	if (!have($item`bugged beanie`)) {
		visitUrl("arena.php");
		equip($item`bugged beanie`);
	}
}

// Prepare for the weapon damage test
export function weaponPrep(): void {
	// Buff up
	getBuffs($effects`song of the north, carol of the bulls, blessing of the bird`);
	getBuffs($effects`lack of body-building, billiards belligerence, the power of lov`);
	// Buffs with commas in the names don't work well with $effects
	getBuffs([$effect`frenzied, bloody`]);
	// Acquire Inner Elf for test purposes
	getInnerElf();
	// Get carol ghost buff
	if (!have($effect`Do You Crush What I Crush?`)) {
		useFamiliar($familiar`ghost of crimbo carols`);
		// Use a reflex hammer to get out
		equip($item`Lil' Doctor™ bag`);
		// The Dire Warren has a beast, and just a beast - how fortunate for us!
		adventureMacro($location`the dire warren`, Macro.freeRun());
	}
	// Alright, camel, time for your great moment! The combat that does all the things!
	// Spit on me, and a meteor shower, and sabering out!
	if (!have($effect`meteor showered`)) {
		useFamiliar($familiar`melodramedary`);
		equip($item`fourth of may cosplay saber`);
		// Saber items
		setChoice(1387, 3);
		Macro.trySkill($skill`%fn, spit on me!`)
			.trySkill($skill`meteor shower`)
			.skill($skill`Use the Force`)
			.setAutoAttack();
		CombatLoversLocket.reminisce($monster`ungulith`);
		// Backup macro submission just in case - autoattack works though
		runCombat(Macro.trySkill($skill`%fn, spit on me!`)
			.trySkill($skill`meteor shower`)
			.skill($skill`Use the Force`)
			.toString()
		);
		// Saber stuff
		if (handlingChoice()) runChoice(-1);
		// Auto-attack saber means mafia doesn't get to see the things being used, let it know
		// 1932 is the ungulith ID, make locket uses know
		if (get("_locketMonstersFought") === "") set("_locketMonstersFought", "1932");
		else set("_locketMonstersFought", get("_locketMonstersFought")+",1932"));
		set("camelSpit", 0);
		set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
	}
	// Suit up, add the last few buffs...
	outfitWeapon();
	getBuffs($effects`cowrruption, bow-legged swagger`);
}

// Prepare for spell damage test
export function spellPrep(): void {
	// Start off with Simmer so it doesn't muck anything up later
	getBuffs($effects`simmering`);
	// Acquire some constituent pieces
	if (!have($effect`sigils of yeg`)) cliExecute("cargo 177");
	if (!have($effect`pisces in the skyces`)) useSkill(1, $skill`summon alice's army cards`);
	// Now that that's done, other stuff! A LOT of it!
	getBuffs($effects`spirit of garlic, Jackasses' Symphony of Destruction, Arched Eyebrow of the Archmage`);
	getBuffs($effects`carol of the hells, mental a-cue-ity, song of sauce, the magic of lov`);
	getBuffs($effects`sigils of yeg, concentration, baconstoned, pisces in the skyces, grumpy and ornery`);
	// Traditionally Inner Elf
	getInnerElf();
	// Two birds with one stone - meteor shower and mini-adventurer buff
	if (!have($effect`Meteor Showered`) && get("_meteorShowerUses") < 5) {
		if (!have($effect`Saucefingers`)) {
			useFamiliar($familiar`Mini-Adventurer`);
			if (get("miniAdvClass") === 0) {
				// Get the mini-adventurer to become a sauceror for subsequent buffing
				setChoice(768, 4);
				// This should fail horribly if something goes wrong
				setAutoAttack(0);
				adv1($location`the dire warren`);
				// The noncombat just zooms by too fast and the class change doesn't get picked up
				set("miniAdvClass", 4);
			}
		}
		equip($item`fourth of may cosplay saber`);
		// There's gonna be a round before we get out and these are scalers... let's be safe
		getBuffs($effects`blood bubble`);
		// The NEP mobs should hopefully tank a single smack of the mini-sauce guy
		saberCheese(Macro.trySkill($skill`Meteor Shower`), $location`the neverending party`);
		// Auto-attack saber means mafia doesn't get to see the meteor shower, let it know
		set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
	}
	// Alright, gear and do the thing!
	outfitSpell();
}

// Prepare for item/booze drop test
export function itemPrep(): void {
	// Fuel up asdon for buffing purposes
	if (!have($effect`driving observantly`)) {
		if (!AsdonMartin.fillWithInventoryTo(37)) throw "Breadcar refuses to charge to 37!"
	}
	// Item buff time
	getBuffs($effects`fat leon's phat loot lyric, singer's faithful ocelot`);
	getBuffs($effects`driving observantly, pork barrel`);
	if (!have($effect`synthesis: collection`)) performSynth("item");
	// Get bowlo buff and batform in a single runaway
	if (!have($effect`cosmic ball in the air`)) {
		useFamiliar($familiar`none`);
		equip($item`vampyric cloake`);
		equip($item`Lil' Doctor™ bag`);
		adventureMacro(
			$location`The Dire Warren`,
			Macro.trySkill($skill`bowl straight up`).trySkill($skill`become a bat`).freeRun()
		);
	}
	// Cast feel lost, put on clothes and that's all the setup done. Squint time!
	getBuffs($effects`feeling lost, steely-eyed squint`);
	outfitItem();
}