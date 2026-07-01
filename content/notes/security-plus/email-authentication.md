---
title: email authentication (SPF, DKIM, DMARC)
slug: email-authentication
section: notes
path: notes/security-plus/email-authentication
tags: [sec-plus, email, authentication, dns]
created: 2026-06-30
updated: 2026-06-30
summary: SPF, DKIM, DMARC, who can send, was it tampered with, what to do on failure
suggested: false
---

## quickstart

three DNS-published controls that answer three different questions about an incoming message. each handles one job, they do not overlap.

- **SPF** (Sender Policy Framework): is this sending IP authorized to send mail for this domain?
- **DKIM** (DomainKeys Identified Mail): cryptographic signature proving the message has not been altered, and that it came from the claimed domain.
- **DMARC** (Domain-based Message Authentication, Reporting, and Conformance): policy layer. ties SPF and DKIM results to the visible From domain (alignment), tells receivers what to do on failure, and gets reports back.

SPF and DKIM are the evidence. DMARC is the verdict and the rules of the courtroom.

## SPF, the IP allowlist

published as a DNS TXT record on the sending domain:

```
example.com.  TXT  "v=spf1 ip4:192.0.2.0/24 include:_spf.google.com -all"
```

receiver looks at the connecting SMTP server's IP. in the allowlist, SPF passes. not in it, SPF fails. `-all` at the end is a hard fail ("anything not listed is forged"); `~all` is soft fail.

failure mode: SPF breaks on plain forwarding. forwarders (mailing lists, `.forward` rules) re-send from their own IP, which is not in the original domain's SPF record.

## DKIM, the signature

the sending server signs selected headers (often From, Subject, Date) plus the message body with a private key. the signature lands in a `DKIM-Signature:` header. the matching public key lives in DNS:

```
selector1._domainkey.example.com.  TXT  "v=DKIM1; k=rsa; p=<base64-pubkey>"
```

receiver pulls the public key, verifies the signature. verifies, DKIM passes; the signed parts of the message were not tampered with in transit. this is straight asymmetric [[cryptography]], same trust model as [[pki]] but distributed via DNS instead of CAs.

failure mode: anything that rewrites a signed header (subject prefixes like `[List]`, footer injection) invalidates the signature.

## DMARC, the policy layer

also a DNS TXT record, on `_dmarc.<domain>`:

```
_dmarc.example.com.  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com; aspf=s; adkim=s"
```

three things to read:

1. **alignment**: the From domain must match either the SPF authenticated domain or the DKIM signing domain. having SPF or DKIM pass is not enough on its own; the visible From has to align.
2. **policy (`p=`)**: what receivers should do when alignment fails.
   - `p=none`: do nothing but report. monitoring mode.
   - `p=quarantine`: send to spam.
   - `p=reject`: refuse the message at SMTP time.
3. **reporting (`rua=`)**: receivers send aggregate reports to the listed address, so the sender can see who is failing and adjust.

## the decision rule

the exam phrasing maps cleanly:

- "is the IP allowed to send?" -> SPF
- "was the message altered? was it really from this domain?" -> DKIM
- "what should the receiver do when authentication fails, and how do I get reports?" -> DMARC

if the question mentions policy, handling failed messages, reporting, or alignment, the answer is DMARC. the trap is putting DKIM where DMARC belongs; DKIM proves integrity, it does not tell the receiver what to do about a failure.

## one more, often confused

**ARC** (Authenticated Received Chain) sits above all three. it lets intermediate forwarders (mailing lists) preserve the original authentication results so DMARC alignment can survive a forward. not always on Sec+, but worth knowing if it shows up.

source: Sec+ Mistakes Quiz 1 (95%), Messer attempts 1a/1b. "tells receivers how to handle messages that fail" is DMARC every time; once put DKIM there and lost the point.
