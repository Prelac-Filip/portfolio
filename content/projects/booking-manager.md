---
title: Booking Manager
description: "My first full-time job. The biggest booking system for yacht charters in the world, handling more than 6000 companies and 12k boats."
image: /projects/Booking_manager.jpg
url: "https://www.booking-manager.com/"
tags: [Java 8, JSP, Plain JS, Bootstrap 5, Vue.js, REST, SOAP, Testmonitor, Monolithic]
date: 2022-07-04
category: Professional
---

## Overview

Booking Manager is the biggest yacht charter booking system and management software. It offers a **desktop** application, an **online** platform, custom client **websites**, a **widget** for websites, **REST** API, and **SOAP** API.

It is a B2B application that connects charters with booking agencies, so it represents two different entities with different features. There is over *5000* agents, more than *1300* charter operators, and over *12k* boats.

Since the company exists since 2002, there is a lot of legacy code, which needs to be maintained and refined for optimizations to support such large client base and data sets. A big step for the project was to upgrade our online platform to start using **Vue.js** instead of JSP's and plain JS.

I have learned a lot during my time spent here, and have learned many lessons, such as: 
- how to deal with imposter syndrome
- how to navigate a huge system with many services without being overwhelmed
- how to clearly communicate a found issue
- how to ask for help, while explaining what I tried and how I approached a problem

## What I did

I maintained and developed new features on the whole system, ranging from the backend, our API's, and the frontend. 

As a Junior, my first big task was developing a system that would allow clients to order their booking items and discounts for easier navigation and a faster work environment. I developed an *interface* which could be and is now used for multiple different objects that also need ordering, all while using a **stable** and **tested** solution, which can be used on both the desktop application, as well as the online one. 

My second notable task as a Junior was to assist my then Senior and mentor with implementing a solution which would combine both the API from Booking Manager and the API from Nausys so that our client would have offers from both systems on his website. I was involved in the **planning** and **architectural** process, as well as the **implementation** and **testing** phase.

Lastly, there was a need for a new middleware for one of our biggest clients, where they needed to have direct communication with their guests, while not breaking the trust of the agencies that brought these guests to them. I was in charge of communication on this new project, writing down all of the needs and specifications, and the development itself. I have implemented a middleware that would anonymize the e-mail addresses for the charter company, but internally would send the e-mail to the correct guests.

After these and many other implementations and bug-fixings, I was promoted to a Team Lead where I was also introduced in the role in two different environments.

Firstly, I **led a team** of me and 2 other colleagues, where I was tasked of completing two major inner projects which would be developed independetly but at the same time.

The first project was introducing a *inner payment proccessing* system for our accounting department. The task was to minimize the current and slow manual process of creating invoices, and then manually sending them to clients. The payout of the project other than making our other department more efficent, would be the possibilty for our clients to add their credit cards and be automatically billed if they allow us to.

What we have done is made a new UI on our online platform for our accounting department where they could see a list of all clients that have entered their payment data. Through this UI they could charge the clients by selecting a card, entering the amount and clicking a button. The payment process was handled and implemented with **Stripe**. For the client side, we have made a new tab in both the online platform and our desktop application, where they could enter their credit card data, as well as select whether they want to be auto-billed, in such cases, our accounting department didn't even need to go through the new UI for demanding payments.

The second project was regarding a new *structured QA* process. Using **Testmonitor** I was in charge of overviewing and guiding our QA engineer on how to write tests for our support department. This project was supposed to be an introduction point for anyone new or unfamiliar with several processes inside our Booking Manager ecosystem. The tests were defined by our different user paths, and have been prioritized based on their significance.

After these two projects, my **involment and dedication** was recognized and rewarded by a new position of then managing our entire development department. I was still involved in the development process itself, however, now I was also managing Sprints, delegating Jira tickets, had a direct communication and alignment meetings with the head of our support department to help with prioritizing the correct tickets, and finally I was also in direct communication with a new big client that was to be introduced to our application, being the techincal person for all questions, as well as in communication for understanding their needs / features that needed to be implemented.

Finally, I was in charge of the interview process of hiring new Junior developers, I was determining their critical thinking skills, presenting algorithmic problems to solve, and judging their character for the culture and team fit. 

## Stack

Built with Java 8, JSP, Plain JS, Bootstrap 5, Vue.js, PrimeVue, REST, SOAP, Testmonitor.
