---
title: Qartora
description: "My first project at Serapion. An AI first multi-tenant application, using WhatsApp/Instagram as an entry point, and Shopify to pull products and display them to users based on their needs/queries."
image: /projects/qartora-logo.svg
url: "https://qartora.com/"
tags: [React, shadcn, NestJS, Next.js, PostgreSQL, Vercel SDK, TypeORM]
date: 2026-02-01
category: Professional
---

## Overview

An chat-like application that uses an **AI agent** to fetch, filter, and display products which are pulled from **Shopify**. The application has two entry points: **WhatsApp** and **Instagram**. Based on this, the application follows their respective designs, determined on the channel of entry. 

The application other than the AI chat, contains a cart and creation of an order that is sent and processed through Shopify. 

## What I did

I started on this project by implementing the frontend using **React** with **shadcn**, while being aware of the work done in the backend which used **NestJS**. After implementing the reusable UI components and to follow the given design, I ensured that we had mocked data being pulled in a way that required minimal changes once the backend was done. 

I was then working on the backend, since I have already prepared the mock to be ready for the connection with real data, I was tasked to connect the API data with the frontend. Afterwards, I started preparing the application to support **multi-tenancy** on a single deployment by using **slugs** in the path. While working on this, it was decided from the clients side that we would actually use a **subdomain** approach rather than the slugs, but we would still use a single DB. 

Then I prepared the application to be able to support **multiple channels** (we started only with WhatsApp), so I made the UI to be configurable, as well as link generation based on the selected channel.

I was also assigned the **360 Dialog** transfer from our application to the clients new backoffice app. Some UI / UX redesigning of the backoffice, etc.

## Responsibilities

- Communicate with the client regarding desired functionalities of the system
- Present developed functionalities on a Sprint basis.
- Develop and test new functionalities, as well as maintain the system.
- Develop and execute plans for testing, and system validation.
- Ensure that the final product meets the client’s expectations.

## Stack

Built with React, shadcn, NestJS, Next.js, PostgreSQL, Vercel SDK, TypeORM.
