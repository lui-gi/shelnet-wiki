---
title: tls handshake
slug: tls-handshake
section: notes
path: notes/security-plus/tls-handshake
tags: [networking, crypto, sec-plus]
created: 2026-06-18
updated: 2026-06-22
summary: how two strangers agree on a shared key over a hostile network
suggested: false
---

## the goal

both sides need a symmetric key (see [[cryptography]]) without anyone in the middle being able to learn it. TLS 1.3 handshake is the version worth learning; older ones are mostly historical baggage.

## the rough flow

1. client → server: hello, here are my supported ciphers, here's a public ephemeral DH share
2. server → client: hello, here's my cert (see [[pki]]), here's my ephemeral DH share, here's a finished signature
3. both sides derive the same symmetric key from the DH exchange
4. everything after this point is symmetric (AES-GCM or ChaCha20-Poly1305)

## why ephemeral

each session uses a fresh DH key. if someone records the session and later steals the server's long-term key, they still can't decrypt the recording. this property is called forward secrecy.
