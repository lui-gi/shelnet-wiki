---
title: uac, unix-like artifact collector
slug: uac-collector
section: notes
path: notes/linux-forensics/uac-collector
tags: [linux-forensics, incident-response, tools, uscc-2026]
created: 2026-06-30
updated: 2026-06-30
summary: single-shot live-response collector for nix triage, analysis-first workflow
suggested: false
---

## what it is

UAC (Unix-like Artifact Collector) is an open-source live-response tool for nix systems: Linux, macOS, AIX, Solaris, FreeBSD. one shell script, no install, runs as root on the target. it grabs everything you need for an analysis-first triage in a single shot: process state, file metadata, hashes, memory, rootkit heuristics. you walk away with a tar of artifacts and analyze offline on a clean box.

the bias is analysis over acquisition. collect cleanly once with a tool like UAC, then spend your time in the artifacts looking for what does not fit. running ad-hoc commands on a possibly-compromised box is how you miss things or get lied to.

repo: github.com/tclahr/uac

## the output directories that matter

UAC drops a single tar with a fixed layout. the directories you reach for most:

| path | what's in it |
| --- | --- |
| `live_response/process/running_processes_full_paths.txt` | executable path per PID, resolved from `/proc/<PID>/exe` |
| `live_response/process/running_processes_cwd.txt` | current working directory per PID, from `/proc/<PID>/cwd` |
| `body_file/body_file.txt` | pipe-delimited metadata for every file on the system, sleuthkit body-file format, timestamps in epoch |
| `hash_executables/` | MD5 and SHA1 hashes of every file with the execute bit set |
| `memory_dump/` | raw memory image, size matches physical RAM of the target |
| `check_rootkit/` | heuristic rootkit detection output (LD_PRELOAD presence, suspicious GID hiding, other heuristics) |

the body file is the workhorse. pipe it into `mactime` or sort by timestamp to build a timeline around the suspected compromise window.

## memory acquisition under the hood

UAC uses AVML (Microsoft, open source) for memory dumps. AVML is user-space and ships no kernel module, so it runs on locked-down boxes without `insmod` rights. output is a `.lime` file you feed straight into Volatility 3.

if you only want the memory image, run AVML directly. UAC wraps it into the broader collection.

## recovering deleted-but-running executables

a common attacker move: drop a binary, run it, `rm` it. on Linux the binary stays mapped into the running process even after the unlink, because the kernel keeps the inode alive as long as a process holds it open. UAC handles both sides:

- live: `cp /proc/<PID>/exe /tmp/recovered` while the process is still up.
- from the collection: deleted executables are auto-recovered as byte-swapped `.dd` files under `proc/<PID>/` in the artifact tar.

class demo: two processes running from `/dev/shm/.ark/` (hidden, world-writable, in-memory), both shown by `ls -la /proc/<PID>/exe` as `(deleted)`. recovering them gave the team the malicious binary to dump strings on and identify the rootkit.

## practical workflow

1. drop UAC on the target: USB, scp, curl from a known-good mirror. single tar, single script.
2. run as root: `./uac -p full <output_dir>`. profiles bound how much you collect. `full` for live triage, `ir_triage` for a faster minimal collection.
3. walk back with the tar. analyze offline on a clean box.
4. start in `check_rootkit/` for the easy wins (LD_PRELOAD, GID hiding). then walk the body file by timestamp around the suspected window. then pivot on suspicious PIDs into `live_response/process/`.
5. for memory analysis, feed `memory_dump/avml.lime` into Volatility 3 with a profile matching the target kernel.

## why not run forensic commands manually

you can. the problem is reproducibility and order-of-operations. ad-hoc `ps`, `netstat`, `find` on a possibly-compromised box risks:

- triggering rootkit defenses. LD_PRELOAD libraries hide processes from `ps` and hide files from `ls`.
- changing access times on the very artifacts you are collecting.
- collecting in the wrong order. most-volatile first matters.

UAC encodes the order, uses low-level filesystem debuggers where userspace tools would be lied to, and produces a consistent layout so the next analyst on the case finds anything in the same place.

source: USCC 2026 camp, Day 4 (Hal Pomeranz, Linux Forensics).
