---
title: incident response phases
slug: incident-response-phases
section: notes
path: notes/security-plus/incident-response-phases
tags: [sec-plus, incident-response, governance]
created: 2026-06-30
updated: 2026-06-30
summary: the seven NIST IR phases, what each one actually means, and the traps Sec+ uses to swap them
suggested: false
---

## the seven phases

Sec+ questions on incident response (IR) almost always reduce to "given this scenario, which phase is it?" the phases are short words with overlapping vibes, so the exam leans on that. learn the order, learn the verb that signals each one, and the questions fall out.

NIST SP 800-61 sequence, which is what Sec+ uses:

1. preparation
2. detection
3. analysis
4. containment
5. eradication
6. recovery
7. lessons learned

mnemonic: **p**lease **d**o **a**ll **c**ontainment **e**fforts **r**egarding **l**essons.

some sources collapse detection and analysis into "identification" for a six-step version. ignore that on Sec+; stick to seven.

## what each phase actually is

### preparation

before anything bad happens. you are building the capability to respond:

- policies: the incident response plan (IRP), comms plan
- tooling: security information and event management (SIEM), endpoint detection and response (EDR), ticketing, jump kits
- training: tabletop exercises, runbooks
- people: on-call roster, IR team roles

if the scenario describes a tabletop, a playbook update, or a new tool rollout, it is preparation.

### detection

something has been spotted. an alert fires, a user reports a phishing email, a SIEM correlation hits. the whole phase is "we now believe an incident may be happening." it does not yet involve confirming what it is or scoping the damage.

### analysis

the team confirms the alert is real, scopes the incident, identifies affected systems, and determines root cause.

this is the phase where root cause gets nailed down. that is the trap: if the question says "analyzing evidence and determining root cause," the answer is analysis. lessons learned is a common wrong choice.

### containment

stop the spread. isolate compromised hosts from the network, disable compromised accounts, block malicious IPs at the firewall.

containment is about impact. preserving forensic artifacts happens, but only as a side effect. read carefully: "mitigate the impact by preventing other devices from being affected" is containment. "isolating the evidence that reveals the cause" is a distractor written to look like containment.

### eradication

remove the threat from affected systems. delete malware, close exploited vulnerabilities, reimage compromised hosts. if containment is "stop the spread," eradication is "kill the source."

### recovery

restore operations. bring systems back from clean backups, verify they work, monitor for re-infection. the business returns to normal here.

### lessons learned

post-mortem on the response itself. document what went well, what did not, update the IRP and playbooks. trap: this phase examines the process. the technical root cause of the incident lives in analysis.

questions phrased as "examining the effectiveness of the incident response process" or "documenting improvements for future incident response" point here.

## the two traps to drill

- **analysis vs lessons learned.** both involve review. analysis reviews evidence and finds the technical root cause. lessons learned reviews the response process and finds organizational improvements.
- **containment vs evidence isolation.** containment isolates systems to stop the spread. preserving evidence happens throughout. if the question phrases it as "isolating evidence to reveal the cause," that is a distractor. containment's goal is impact mitigation.

## verb cheatsheet

if the question stem uses one of these verbs, the phase falls out.

| phase | verbs in the question |
| --- | --- |
| preparation | establish, develop, train, build |
| detection | alert, report, observe, spot |
| analysis | determine, confirm, scope, root cause |
| containment | isolate, prevent spread, block, disable |
| eradication | remove, delete, patch, reimage |
| recovery | restore, rebuild, validate, monitor |
| lessons learned | review the process, document improvements, update IRP |

source: Sec+ Messer attempt 1b (83.33%), Dion attempt 2 (80%).
