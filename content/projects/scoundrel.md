---
title: Scoundrel
description: "A single-player card game built in Godot with GDScript. It was built for mobile devices, but still functions normally on the web!"
image: /projects/Scoundrel.png
url: "https://scoundrel.prelac.dev"
tags: [Godot, GDScript]
date: 2025-03-01
category: Personal
---

## Overview

A videogame made to be a copy of a real card game with the same name. While working a full-time job, and on FitBud as a side project, I have slowly started to get burnout. To avoid it, while still honing my skills, I have decided to make a videogame and to fulfill my childhood wish and dream. 

## What I did

I have started looking into the possibilites of the Godot engine. While I originally planned to use Unity, I was intrigued by Godot for multiple reasons, but the main one was the open-source nature of it, as well the backlash from Unity's charging decisions.

I wanted to start with something simple, yet different from a classic reused, 1000 times already done 2D platformer. I decided on a card game that I knew had some rouge-like elements and a decent simple to learn, but hard to master "schtik".

Most of the assets were bought, but to make a ***scene*** (Godot game object) I have used them and modified them to look as they do in the game.  

**Below are the rules of the game, which I have programmed to be true in the videogame**

## The rules of the game are simple:

### Setup: 

Use a **standard deck** of playing cards. **Remove** all *Jokers*, *Red Face* Cards (Jack, Queen, King of Hearts and Diamonds), and *Red Aces* (Ace of Hearts and Diamonds). **Shuffle** the remaining 44 cards to form the dungeon deck. Start with **20 health**.

### Card Types and Values:

*Clubs* and *Spades* are **Monsters**. Their damage value equals their rank: 2-10 as numbered, Jack=11, Queen=12, King=13, Ace=14.

*Diamonds* are **Weapons**. Each weapon does damage equal to its rank. **Weapons are binding**: if you pick one up, you must equip it and discard your previous weapon.

*Hearts* are **Health Potions**. There are 9 in the deck.

### Gameplay:

Each turn represents a **Room**. Deal 4 cards face up from the dungeon deck to form a Room. You have **two choices**:

1. **Avoid the Room**: Scoop up all 4 cards and place them at the **bottom** of the dungeon deck. Then deal a new Room. You **cannot** avoid two Rooms in a row.

2. **Enter the Room**: You **must** face 3 of the 4 cards in the Room, in an order you choose. The *remaining* 4th card is kept and 3 new cards are dealt to form the next Room.

### Combat:

If you fight a Monster without a weapon, subtract its full value from your health. 
- *(e.g. 20HP - 10♣️ = 10 HP)*

If you fight a Monster with a weapon, the damage you take equals the Monster's value minus your weapon's value. Your fists count as 0.
- *(e.g. 10♣️ - 8♦️ = 2 DMG)*

When you first equip a weapon, it can defeat any Monster. After defeating a Monster with a weapon, that weapon can only defeat Monsters with a lower value than the last one it defeated. Track this by placing defeated Monsters below the weapon card. 
- *(e.g. if the last slain Monster is a 10♣️, the next slain Monster **MUST** be 9♣️ or lower)*

### Health Potions:

You may use **only one** Health Potion per room, even if you reveal multiple. Additional potions in the same turn are **discarded**.

You **cannot** restore health beyond 20.

### End of Game:

You win if you clear all cards in the dungeon deck or if a new Room cannot be formed.

You lose if your health reaches 0 or below at any point.

Your score is determined by slain Monsters, the remaining Monsters in the deck if the room cannot be formed, and if there is a **unused** potion in the room.


## Stack

Built with Godot, GDScript.
