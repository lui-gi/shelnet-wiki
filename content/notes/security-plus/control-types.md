---
title: control types and categories
slug: control-types
section: notes
path: notes/security-plus/control-types
tags: [sec-plus, governance, controls]
created: 2026-06-30
updated: 2026-06-30
summary: every Sec+ control has two labels, a category (what it is) and a function (when it acts)
suggested: false
---

## the two axes

every control on Sec+ wears two labels at once. answer both axes or you lose the point.

1. **category** (what kind of thing it is): managerial, operational, technical, physical.
2. **function** (when it acts relative to an incident): preventive, deterrent, detective, corrective, compensating, directive.

the axes are independent. an incident response plan is managerial + corrective. a generator during a power outage is physical + corrective (or physical + compensating, depending on framing). security awareness training is operational + preventive.

## category, the what

- **managerial**: policies, procedures, governance. written by people, signed off by people. an IRP, a risk register, an SLA.
- **operational**: people-driven processes executed day to day. security awareness training, change-management process, manual log review.
- **technical**: enforced by hardware or software. firewalls, MFA (multi-factor authentication), encryption, IDS (intrusion detection system), password complexity rules.
- **physical**: tangible objects in the real world. locks, fences, badges, generators, guards.

quick rule: if a person has to execute it, it's operational; if a thing does the enforcing, it's technical or physical; if it's a document, it's managerial.

## function, the when

ordered by when they act:

- **directive**: tells people what to do before an incident. policy, AUP (acceptable use policy), signage saying "no tailgating".
- **preventive**: stops the incident from happening. firewalls, MFA, locked doors, training.
- **deterrent**: discourages the attacker without technically blocking. visible cameras, warning banners, "guard dog" signs.
- **detective**: notices an incident as or after it happens. IDS, SIEM (security information and event management) alerts, audit logs, motion sensors.
- **corrective**: reduces damage after the incident. IRP (incident response plan) execution, restore from backup, patching the exploited hole, re-imaging.
- **compensating**: a substitute when the primary control is unavailable or infeasible. single-factor auth fails the audit, so add MFA as compensating. legacy DB cannot be encrypted in place, so isolate it on its own VLAN.

## the directive-vs-corrective trap

both can be administrative documents. the question is when they act.

- **directive = before.** instructs behavior. policy, AUP, "thou shalt encrypt."
- **corrective = after.** fixes or reduces damage from something that already happened. IRP execution, restore from backup, patching the exploited hole.

an incident response plan is corrective even though it's a written document, because the plan exists to be executed after an incident. the policy that requires you to have an IRP is directive. read carefully: "the IRP" itself is corrective; "the rule that you must have an IRP" is directive.

## the compensating-vs-something-else trap

a compensating control is the substitute when the intended primary control is missing or broken. it is not "another good idea."

- single-factor auth fails the audit. compensating control: add MFA. not "run more awareness training" (that's preventive but doesn't substitute for the failed auth).
- cannot patch a legacy system. compensating control: network isolation, additional monitoring, a WAF (web application firewall) in front.

ask: what was the original control supposed to do, and what is now doing it instead?

## category traps from practice

- generator during a power outage: physical. it's a thing in the real world that keeps operations running. function = corrective or compensating depending on framing.
- doors unlocked with an access card: physical. badges and locks are physical even when managed digitally.
- security awareness training: operational + preventive. people-driven, stops incidents before they happen.
- encryption at rest: technical + preventive. enforced by software, stops disclosure before it happens. see [[cryptography]] for where each algorithm lands.
- certificate revocation via OCSP: technical + corrective. it kicks in after a key is known bad. for the surrounding machinery see [[pki]].

source: Dion attempt 2 (80%), Messer attempt 1a (80%), Mistakes quiz 1 (95%, repeat-miss on directive-vs-corrective).
