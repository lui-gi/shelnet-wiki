---
title: pki
slug: pki
section: notes
path: notes/security-plus/pki
tags: [crypto, sec-plus, pki]
created: 2026-06-14
updated: 2026-06-20
summary: public key infrastructure, how the web decides which keys to trust
suggested: false
---

## the problem

asymmetric crypto (see [[cryptography]]) only works if you know whose public key you're using. on the open internet you have no prior relationship with most servers. PKI is the answer.

## the answer

a certificate is a public key + identity (domain name, org, validity dates) + a signature from someone you already trust. that someone is a certificate authority (CA).

## the chain

your browser trusts a small set of root CAs out of the box. roots sign intermediate CAs. intermediates sign end-entity certs (the ones servers actually present). validating a cert means walking that chain back to a root you trust.

## what breaks it

expired certs, revoked certs (CRL / OCSP), name mismatches, self-signed certs (no chain), and CAs that get compromised.
