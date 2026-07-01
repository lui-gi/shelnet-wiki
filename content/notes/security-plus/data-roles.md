---
title: data roles
slug: data-roles
section: notes
path: notes/security-plus/data-roles
tags: [sec-plus, governance, privacy, gdpr]
created: 2026-06-30
updated: 2026-06-30
summary: owner, controller, processor, custodian; pick the right one off the verb in the question
suggested: false
---

## the four roles, one line each

four show up on Sec+. the trap is questions that name only one of them, with no pair to anchor against. the fix is to stop memorizing definitions and start reading for the verb the role is doing.

- **owner**: accountable for the data. decides classification, decides who gets access. usually a business executive.
- **controller**: decides *why* the data is collected and *how* it is processed. the legal entity calling the shots under the General Data Protection Regulation (GDPR).
- **processor**: acts on the controller's documented instructions for a defined purpose. does not decide why or how.
- **custodian** (sometimes called steward): hands-on technical protection. configures access controls, runs backups, applies patches.

owner and controller overlap in practice; on the exam they are separated as distinct roles.

## the decision rule

read the question for the verb the role is doing.

| if the role...                                  | it is the...        |
| ----------------------------------------------- | ------------------- |
| **decides** purpose and means (why and how)     | controller          |
| **acts on** another party's documented instructions | processor       |
| is **accountable** for, **classifies**, sets policy | owner           |
| does **hands-on technical** protection          | custodian / steward |

when only one role is described, latch onto the verb. "decides" goes to controller. "acts on instructions" goes to processor. "classifies" or "accountable" goes to owner. "configures controls" or "applies safeguards" goes to custodian.

## controller vs processor under GDPR

both terms come from GDPR. the controller is the data subject's legal counterparty; the processor is a subcontractor.

example: a retailer hires a marketing analytics firm. the retailer specifies the campaign, the customer list to use, and the goal. the analytics firm acts solely on the retailer's documented instructions.

- retailer = **controller** (decides the purpose)
- analytics firm = **processor** (acts on documented instructions)

the giveaway phrase from real exam questions: *"acting solely on the documented instructions"* means processor, every time.

## owner vs controller

both are senior, both are responsible. the split:

- **owner** is an internal-org concept. a business unit head accountable for a data asset, sets classification, signs off on access.
- **controller** is the GDPR, external-facing legal role. determines the lawful basis for processing, faces regulators.

in a US-only or non-regulatory context, owner is the term that shows up. in any question mentioning GDPR, EU, lawful basis, or data subjects, the term you want is controller.

## custodian vs steward

sometimes used interchangeably, sometimes split as:

- **custodian**: the technical role. sysadmin, database administrator (DBA). runs the controls.
- **steward**: an analyst-style role focused on data quality and meaning, less on technical safeguards. sits closer to the business.

on Sec+, either is the right answer for "hands-on technical protection" if the other is not an option. if both appear as choices, prefer custodian for the technical or security-controls phrasing.

## the canonical four-row example

| entity              | decides what data is for | acts on instructions | classifies, sets policy | applies the controls | role           |
| ------------------- | ------------------------ | -------------------- | ----------------------- | -------------------- | -------------- |
| executive sponsor   |                          |                      | yes                     |                      | **owner**      |
| retailer (GDPR)     | yes                      |                      |                         |                      | **controller** |
| analytics vendor    |                          | yes                  |                         |                      | **processor**  |
| sysadmin / DBA      |                          |                      |                         | yes                  | **custodian**  |

if you can fill this table in for the scenario in the question, the role falls out.

source: Sec+ Mistakes Quiz 2, messer-attempt-1b.
