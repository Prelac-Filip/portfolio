---
title: Fitbud
description: "A mobile-first, offline-first application for working-out. Built with Java 21 and Spring Boot, as well as Flutter for the FE"
image: /projects/fitbud.jpg
url: "#"
tags: [Java 21, Spring Boot, Flutter, PostgreSQL]
date: 2023-06-01
category: Personal
---

## Overview

An offline-first application, designed as a native mobile app firstly, however, it's supported on the browser as well. Built with Spring Boot to learn it and it's many capabilities, this application has a custom OAuth JWT token system, while also having the Google and Facebook OAuth implementations. It's using REST API for all CRUD operations, while following the HATEOAS principle. For the DB I'm using PostgreSQL with it's JSON column capabilities and things like GIN indexes for faster DB searches.

## Features

- **Auth** 

First-party JWT issuer. BCrypt-hashed passwords, HS256 access tokens (15m), opaque SHA-256-hashed refresh tokens (30d) with rotation. **Plus OAuth social login** (Google + Facebook) via token-exchange

- **Workouts** 

REST + HATEOAS CRUD. Each workout has a `visibility ∈ {PRIVATE, PUBLIC, FRIENDS}`. Conditional links (`edit`/`delete`) are emitted only when the viewer can perform the action. Paged listings via Spring Data + `PagedResourcesAssembler`. JSON Merge Patch for `PATCH`. Also **full-text search** over the workout body, **optimistic-locking** (`version`) on mutations, **client-supplied-id upsert** (`PUT`), and **soft-delete + delta-sync** for offline clients.

- **Exercises** 

A global exercise **catalog** (admin-curated) plus per-workout **exercise lines** (sets + reps + note, ordered). Reads are open to any authenticated user; writes are admin-only. Optimistic-locking, soft-delete, trigram name search, and delta-sync — same offline-sync machinery as recipes.

- **Workout Plans** 

A user-owned, ordered **collection of workouts** with its own `visibility ∈ {PRIVATE, PUBLIC, FRIENDS}`. Membership add/remove/reorder, per-workout visibility filtering (a workouts own visibility always wins, inaccessible members are hidden and not counted), optimistic-locking, soft-delete, and delta-sync.

- **Achievements.** 

An **offline-first, server-evaluated achievements system** awarding tiered (Bronze/Silver/Gold) badges across three metrics: `WORKOUTS_COMPLETED`, `DISTINCT_EXERCISES_USED`, and `LOGIN_STREAK`. Two metrics are server-derived from existing data; `LOGIN_STREAK` is the single client-reported signal (`PUT /me/streak`), stored as a monotonic maximum. Unlocks are append-only and never revoked. The sync contract is **reduced**: delta cursor + `X-Server-Time` header only — no tombstones, no `@Version`/409, and no scheduled pruner.

- **Friendships.** 

Mutual request/accept relationship between two users. Canonical-ordered pair table (`user_a < user_b`) with `PENDING`/`ACCEPTED` states. `FRIENDS`-visibility workouts are visible only to accepted friends, checked live on every read. Users can be **found by exact email** and browsed via a **profile hub** that links to the user's workouts, plans, and achievements. Those per-owner listings reuse the same `FRIENDS` visibility filtering; a friend's achievements are friend-gated (404 for non-friends, since achievements have no PUBLIC tier).

## Flutter

The project follows a **layered MVVM** (Model–View–ViewModel) architecture with an explicit data layer. Dependencies always point inward: **UI → ViewModels → Repositories → (API clients / DAOs) → plain domain models**. Nothing points back out.

There is to much to point out here, so I would refer you to the architecture doc on my Github.

## What I did

Everything, from the idea, to the documentation, to the backend implementation all the way to the UI/UX, and finally deployment on my own self-host machine. Best way to see the application is to test it yourself. :) 

## Stack

Built with Java 21, Spring Boot, Flutter, and PostgreSQL
