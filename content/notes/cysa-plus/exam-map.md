---
title: cysa+ study curriculum
slug: exam-map
section: notes
path: notes/cysa-plus/exam-map
tags: [cysa-plus, exam-prep, roadmap, curriculum]
created: 2026-07-02
updated: 2026-07-02
summary: concept-sequenced cysa+ curriculum, 15 units mapped back to CS0-003 objectives
suggested: false
---

## how this is ordered

CompTIA's four official domains are weight-ordered, not concept-ordered. this curriculum re-sequences them so each topic builds on the last: understand the environment, know the threat, detect it, manage weaknesses, respond, communicate. each unit still points back at its official objective, so nothing gets skipped, just moved.

## exam at a glance

- questions: up to 85 (multiple-choice + performance-based / PBQs)
- time: 165 minutes
- passing score: 750 / 900
- validity: 3 years
- official domains and weight:
  - 1.0 security operations, 33%
  - 2.0 vulnerability management, 30%
  - 3.0 incident response and management, 20%
  - 4.0 reporting and communication, 17%

the two big domains (security operations + vulnerability management) are ~63% of the exam. weight your study time accordingly, but don't skip reporting; it is heavily PBQ-tested and easy points if you know the frameworks.

## unit 1: foundations, system and network architecture

maps to obj. 1.1. start here. everything else assumes this context.

- logging and log ingestion: operating system concepts, network logs, flow data
- operating system concepts: registry, system hardening, file structure, configuration files
- network architecture: on-prem, cloud, hybrid, network segmentation, zero trust, software-defined networking (SDN)
- infrastructure concepts: serverless, virtualization, containerization
- identity and access management (IAM): MFA, SSO, federation, privileged access management, cloud access security broker (CASB)
- encryption: PKI, SSL inspection, certificate management
- sensitive data protection: data loss prevention (DLP), personally identifiable info (PII), cardholder data

goal: be able to describe why architecture choices change what an analyst can see and defend.

## unit 2: know the threat, intelligence and hunting

maps to obj. 1.4. learn the adversary model before learning detection.

- threat intelligence: open-source vs. proprietary, information sharing and analysis center (ISAC), threat feeds, indicator management (structured threat information expression / trusted automated exchange of intelligence information, STIX/TAXII)
- threat classification: known vs. unknown threats, zero-day, advanced persistent threats (APTs)
- threat actors: nation-state, hacktivist, organized crime, insider threat; motivations and capabilities
- tactics, techniques, and procedures (TTPs)
- confidence levels, collection methods, intelligence cycle
- threat hunting: hypothesis-driven hunting, indicators of compromise (IOCs), focusing/reducing the attack surface, integrated intelligence, improving detection capabilities

goal: distinguish threat intelligence (what's out there) from threat hunting (proactively searching your own environment).

## unit 3: detect it, indicators of malicious activity

maps to obj. 1.2. the heart of the analyst job.

- network-related indicators: bandwidth consumption, beaconing, irregular peer-to-peer, rogue devices, scans/sweeps, unusual traffic spikes, activity on unexpected ports
- host-related indicators: capacity/resource consumption, unauthorized software, malicious processes, memory contents, unauthorized changes/privileges, registry changes, unauthorized scheduled tasks
- application-related indicators: anomalous activity, introduction of new accounts, unexpected output/outbound communication, service interruption, app logs
- other indicators: social engineering attacks, obfuscated links

goal: given a scenario or log snippet, identify what's abnormal and classify it.

## unit 4: detect it, tools and techniques

maps to obj. 1.3. hands-on toolbox; expect PBQs here.

- capturing network traffic: Wireshark, tcpdump
- file analysis: Strings, VirusTotal, hashing
- sandboxing: Joe Sandbox, Cuckoo Sandbox
- common techniques: pattern recognition, command & control interpretation, interpreting suspicious commands, email analysis (header, impersonation, DKIM, SPF, DMARC, embedded links), file/log analysis, user behavior analysis
- programming/scripting awareness: JSON, XML, Python, JavaScript, PowerShell, regular expressions
- endpoint security: endpoint detection and response (EDR), extended detection and response (XDR)
- security information and event management (SIEM) and security orchestration, automation, and response (SOAR)
- DNS and IP reputation analysis

goal: know which tool answers which question, and read basic tool output.

## unit 5: efficiency and process improvement

maps to obj. 1.5. often overlooked, but tested.

- standardizing processes and streamlining operations
- automation and orchestration (SOAR), use of playbooks
- single pane of glass, technology/tool integration (APIs, webhooks, plugins)

goal: understand why SOCs automate and standardize, and what trade-offs come with it.

## unit 6: vulnerability management, scanning

maps to obj. 2.1. begin the largest single skill cluster.

- asset discovery: mapping/enumeration, active vs. passive scanning
- scan types: internal/external, credentialed/non-credentialed, agent vs. agentless, static vs. dynamic analysis
- special considerations: scheduling, performance/sensitivity levels, segmentation, regulatory requirements
- industry frameworks: PCI DSS, CIS benchmarks, OWASP, ISO 27000 series

## unit 7: vulnerability management, analyzing tool output

maps to obj. 2.2.

- web application scanners (Burp Suite, ZAP, Arachni, Nikto)
- infrastructure scanners (Nessus, OpenVAS, Qualys)
- software composition analysis
- network/wireless tools (nmap, Angry IP Scanner)
- cloud infrastructure assessment (ScoutSuite, Prowler, Pacu)
- debuggers, multipurpose tools (Metasploit, Recon-ng)

## unit 8: vulnerability management, prioritization

maps to obj. 2.3. the "so what" of scanning.

- common vulnerability scoring system (CVSS) interpretation: base, temporal, environmental metrics
- CVSS metrics: attack vectors, complexity, privileges required, user interaction, scope, impact (CIA)
- validation: true/false positives, true/false negatives
- context awareness: internal vs. external, isolated vs. exposed
- exploitability / weaponization, asset value, zero-day

## unit 9: vulnerability management, mitigating controls

maps to obj. 2.4. connect vulnerabilities to attacks and fixes.

- common attacks and associated controls: XSS (reflected, persistent), overflow attacks (buffer, integer, heap, stack), data poisoning, broken access control, cryptographic failures, injection (SQL, command), CSRF, directory traversal, IAM/SSRF/RFI/LFI attacks
- secure coding best practices: input validation, output encoding, session management, authentication, parameterized queries
- secure software development life cycle (SDLC)
- attack surface management, control types, and defense in depth

## unit 10: vulnerability management, response and governance

maps to obj. 2.5.

- compensating controls, control types (managerial, operational, technical)
- patching and configuration management, maintenance windows, exceptions
- risk management: acceptance, transference, avoidance, mitigation
- policies, governance, service-level objectives (SLOs) / SLAs
- attack surface management, secure disposal, threat modeling, and the role of CI/CD

## unit 11: incident response, attack methodology frameworks

maps to obj. 3.1. map attacker behavior before responding to it.

- cyber kill chain
- diamond model of intrusion analysis
- MITRE ATT&CK
- open source security testing methodology manual (OSSTMM)
- OWASP testing guide

goal: be able to place an observed attack onto each framework's stages.

## unit 12: incident response, activities

maps to obj. 3.2. the active response phase.

- detection and analysis: IOCs, evidence acquisition, data/log analysis
- containment, eradication, and recovery
- scope, impact, isolation, remediation, re-imaging
- chain of custody, forensic analysis, root cause analysis

## unit 13: incident response, lifecycle (prep and post-incident)

maps to obj. 3.3.

- preparation: IR plan, tools, training, testing/exercises (tabletop, simulations)
- post-incident: forensic analysis, lessons learned, root cause analysis, after-action reports
- detection and monitoring as ongoing activities
- the full lifecycle and where each phase fits

sec+ version of the phases lives at [[incident-response-phases]]; cysa+ goes deeper here.

## unit 14: reporting and communication, vulnerability management

maps to obj. 4.1.

- vulnerability management reporting: affected hosts, risk score, mitigation, recurrence, prioritization
- compliance reports, action plans, inhibitors to remediation (memoranda of understanding / MOUs, SLAs, business process interruption, legacy/proprietary systems)
- metrics and KPIs: trends, top vulnerabilities, recurrence, SLAs/SLOs
- stakeholder identification and communication

## unit 15: reporting and communication, incident response

maps to obj. 4.2. finish strong; easy PBQ points.

- stakeholder identification and communication
- incident declaration and escalation
- incident response reporting: executive summary, who/what/when/where/why, recommendations, timeline, impact, scope, evidence
- communication: legal, public relations (customer/media), regulatory/law enforcement reporting, root cause, lessons learned

## suggested study order summary

1. weeks 1-2: units 1-5 (security operations foundations)
2. weeks 3-4: units 6-10 (vulnerability management, heaviest hands-on)
3. week 5: units 11-13 (incident response)
4. week 6: units 14-15 (reporting) + full review
5. week 7: PBQ drills + practice exams, retarget weak areas

## hands-on lab priorities

PBQs test these.

- build a mini-SOC: forward logs into a SIEM, write correlation rules
- run and interpret nmap, Nessus/OpenVAS, and Wireshark output
- read and interpret a CVSS vector string by hand
- walk a phishing-to-malware scenario through the full IR lifecycle
- map a sample attack onto MITRE ATT&CK and the cyber kill chain

always verify sub-objectives against CompTIA's official CS0-003 objectives PDF before exam day; bulleted examples in the blueprint are non-exhaustive.

source: CompTIA CySA+ CS0-003 exam objectives.
