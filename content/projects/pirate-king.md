---
title: Pirate King
description: "A pixel-art pirate game for Android, built in Godot: tense ship-to-ship battles out at sea, and slow, cozy days building your ship in the harbor."
image: /projects/pirate-king/banner.png
# The Google Play link goes here once the listing is live; "#" hides the "Visit site" button.
url: "#"
# The trailer's YouTube id (the part after "v=" in its link). Once set, the trailer plays at the top in place of the image.
# video: ""
tags: [Godot, GDScript, Android, GUT]
date: 2026-10-04
category: Personal
---

## Overview

Pirate King is a pirate game about two lives at sea. Out on the waves you fight ship to ship, aiming at the enemy's rooms while your crew run between decks to patch what breaks. Back in the harbor, the pace drops: you build your ship room by room, hire an odd crew, fish off the dock and gamble at the Tavern, and the harbor keeps working while you're away.

## What I did

Pirate King is my second game in Godot, after [Scoundrel](/projects/scoundrel), and the first one I'm taking all the way to Google Play. Scoundrel was a copy of a card game I knew; this one is my own design, built around two moods: the tension of a fight and the calm of a harbor you keep coming back to.

I designed the game and directed every part of it: the rules and the balance, the screens and how they feel in the hand, the sound, and the store page. The code was written with an AI coding assistant, and I worked the way I would with a team: every feature started as a written design, became a step-by-step plan, and was built test-first, with a review before it was merged. The suite has grown past 3,600 automated tests, run headless before every merge.

Two habits kept a game of this size honest:

- **Balance by simulation.** Scripted captains sail a few hundred voyages at a time, and the numbers (how many reach the chest, how many sink, how long a voyage takes) decide whether a fight is too hard, not a hunch.
- **Smoke runs.** A script plays each new feature in a real window on a throwaway save and takes screenshots, so I can see how it looks before it ever reaches my phone.

The store graphics and the trailer are recorded straight from the running game, from a seeded save, by a single script.

## How it plays

1. **Get the ship ready.** In the harbor, keep food, maintenance and morale up, crew the Helm and load cannonballs.
2. **Chart a voyage.** Every voyage is a new map of islands. Pick a route past events, a port and minefields while the navy closes in behind you.
3. **Fight.** Pull alongside pirates, trade ships and the navy, and trade cannon fire broadside to broadside.
4. **Bring the chest home.** Beat the Pirate Captain on the last island, and open a treasure chest: gold, and sometimes diamonds or a new crew member.
5. **Grow.** Spend it on new rooms, upgrades and, in time, a bigger ship.

## Features

### Battle ship to ship

Aim at the enemy's guns, helm, mast or hull. Send your crew running between decks to repair what breaks and heal the wounded, and decide when to fight on and when to sail away. Turn a fight with a Smoke Bomb or a Wind in a Bottle, pause any time or speed up to 2×, and watch a beaten ship burst, tilt and go down.

![Command your crew, broadside to broadside](/projects/pirate-king/shot_1.png)

![Aim at their rooms, shot by shot](/projects/pirate-king/shot_2.png)

### Chart a voyage

Every map is drawn fresh: strange events, a port to trade at, minefields to steer through, and the navy's band creeping up behind. About one map in three hides the Mermaid Island, a two-lane rhythm game where the crew must hold fast through a sea shanty or get hurt.

![Chart a voyage before the navy closes in](/projects/pirate-king/shot_6.png)

![Avoid dangers on your voyage](/projects/pirate-king/shot_7.png)

### Build your ship, room by room

Build and upgrade the Helm, the Anglers Deck, the Gunnery, the Scrub Hold and the Sick Bay inside the hull, each with three levels and its own look. Rooms produce while you're away, and the game catches up when you come back.

![Build your ship, room by room](/projects/pirate-king/shot_3.png)

### Hire an odd crew

Fourteen pirates in four tiers, from Fuse the Bomb Guy to a merman, a skeleton, a shark, and the legendary Simon the Cat and Octavian the Octopus. Every pirate has their own stats, and crewmates who work side by side grow from strangers into hearties.

![Find and hire different crew members](/projects/pirate-king/shot_5.png)

### Fish, shoot, gamble and read the stars

Cast a line for 161 catches, from common fish to legendary sea creatures and sunken treasure. Practice your aim at the Gunnery to earn big cannonballs, try your luck at the Tavern's shell game and roulette, and at a level 3 Helm, trace a constellation among the stars for an edge on the next voyage.

![Fish, shoot and gamble in port](/projects/pirate-king/shot_4.png)

### Grow your fleet

Save up for the brig, a bigger ship with her own enemies and a richer chest, and switch between your ships in the harbor.

![Grow your fleet](/projects/pirate-king/shot_8.png)

### A harbor that lives

Day turns to sunset and night. Gulls cry overhead, clouds drift, fish swim under the dock and your crew wander the quay, all to a soundtrack of sea shanties. Daily and weekly quests, a fish ledger and a crew book give you something to come back for.

## Stack

Built with Godot 4.7 and GDScript, tested with GUT (Godot Unit Test), for Android. Purchases go through Google Play Billing, and the only ads are opt-in rewarded ones from AdMob.

The ships, the harbor and the UI are licensed pixel-art packs, credited in the game. Six of the fourteen crew characters, my studio logo and the voyage map's icon were generated with PixelLab, then recoloured to the game's palette. The music is Tim Beek's Sea Shanties.

## Privacy

The game's [privacy policy](/projects/pirate-king/privacy) says what it keeps on your phone and what goes to Google for the ads and purchases.
