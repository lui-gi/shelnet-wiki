---
title: htb starting point, meow
slug: htb-meow
section: writeups
path: writeups/htb-starting-point
tags: [htb, writeup, beginner]
created: 2026-05-22
updated: 2026-05-22
summary: telnet root with no password, the gentlest possible introduction to htb
suggested: true
---

## recon

nmap turns up port 23 (telnet) open. nothing else.

## exploitation

telnet in. log in as `root`. no password. that's it; flag is in `/root/flag.txt`.

## lesson

old protocols like telnet were never meant to be exposed. a default install with no auth on a public IP is still a real failure mode you'll see in homelab and bad enterprise setups alike.
