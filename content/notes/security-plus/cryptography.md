---
title: cryptography
slug: cryptography
section: notes
path: notes/security-plus/cryptography
tags: [crypto, sec-plus]
created: 2026-06-12
updated: 2026-06-29
summary: symmetric vs asymmetric, hashing, where each one shows up in the real world
suggested: true
---

## symmetric

symmetric uses the same key on both ends. fast, but you have to get the key to the other side somehow, which is the hard part. AES is the one to know.

## asymmetric

two keys: public and private. anything encrypted with one is decryptable only by the other. slow, so usually used to bootstrap a symmetric key (see [[tls-handshake]]).

## hashing

one-way. you put a thing in, you get a fixed-length fingerprint out, and you can't go backward. SHA-256 is the default to reach for. used for integrity.

## where each shows up

which one you reach for depends on the job.

- file encryption at rest: symmetric (AES)
- TLS in flight: asymmetric to agree on a key, then symmetric for the data
- password storage: hashing (with a salt; usually argon2 or bcrypt)
- certificates: asymmetric, with a chain of trust (see [[pki]])
