# Security Policy

## Supported Versions

Only the latest release receives security fixes. No backports are made to older versions.

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |
| Older   | ❌        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Use GitHub's private disclosure feature instead:
👉 [Report a vulnerability](https://github.com/dmoo500/ha-enhanced-person-card/security/advisories/new)

Include as much detail as possible:
- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Affected versions

## Response Timeline

This is a single-maintainer open-source project. I will do my best to:

- **Acknowledge** your report within **7 days**
- **Assess and respond** with a plan within **14 days**
- **Release a fix** within **30 days** where technically feasible

## Scope

**In scope:**
- Security issues in the card's own TypeScript/JavaScript code (`src/`, `enhanced-person-card.js`)
- Vulnerabilities introduced via direct or transitive npm dependencies that have an available upstream fix

**Out of scope:**
- Vulnerabilities in Home Assistant Core, HACS, or other external systems
- Dependency vulnerabilities with no upstream patch available
- Issues requiring physical access to the user's Home Assistant instance
- Misconfiguration of the user's Home Assistant environment

## Disclosure Policy

Once a fix is released, I will publish a GitHub Security Advisory crediting the reporter (unless they prefer to remain anonymous).
