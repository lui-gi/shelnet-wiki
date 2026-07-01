---
title: honeytokens, honeyfiles, honeypots
slug: deception-tech
section: notes
path: notes/security-plus/deception-tech
tags: [sec-plus, deception, detective-controls]
created: 2026-06-30
updated: 2026-06-30
summary: three sizes of decoy, token to file to pot, and how to tell them apart on the exam
suggested: false
---

## the scale

these three show up as four-way distractors on Sec+. the only safe play is knowing the scale: token, file, pot. three sizes of decoy, smallest to largest:

- **honeytoken**: a single fake datum. an API key, a fake row in a database, a bogus email address. zero legitimate use, so any access is a guaranteed signal of compromise.
- **honeyfile**: a decoy document placed where only a snoop would open it. a file named `passwords.xlsx` or `Q3-financials-DRAFT.pdf` wired to alert on access. file-sized, sits inside an otherwise-real filesystem.
- **honeypot**: an entire decoy system or service. fake SSH server, fake web app, sometimes a whole subnet (a honeynet). costs more to run, catches a broader attacker profile.

bigger decoy, more attacker behavior observed, more cost to maintain, and more chance it gets fingerprinted as fake.

## why they count as detective controls

they generate high-signal alerts because nothing legitimate ever touches them. they don't prevent the attack; they tell you, with near-zero false positives, that one is happening.

contrast a regular SIEM (security information and event management) alert built on user behavior: the SIEM has to suppress noise from real users. a honeytoken has no real users at all, so the noise floor is structurally zero.

## practical placement

- **honeytoken**: scatter fake AWS keys in code repos, fake credentials on lateral-movement targets, fake admin emails in mailing lists. alert on the matching auth log lines and on any outbound HTTP request using the key.
- **honeyfile**: in file shares (named like the share's real documents), in user home directories, in cloud storage buckets. canary tokens (canarytokens.org) generate trackable PDFs and Docs that beacon when opened.
- **honeypot**: outside the firewall to study the internet's noise floor, or inside as an internal trap: an "abandoned" jump box, a fake DB server with attractive port banners.

## exam-style traps

- "decoy document strategically placed to trigger an alert when accessed" -> **honeyfile**
- "fake API key, fake DB row, indicates a compromise when used" -> **honeytoken**
- "decoy system" or "decoy server" -> **honeypot**

parse the noun. document or file means honeyfile. credential or data element means honeytoken. system, server, or service means honeypot. no ambiguity once you spot it.

source: Sec+ Dion attempt 2 (80%).
