# Policy: incident severity

## Levels
- SEV1: a core flow (checkout, login) is down for many customers. Page immediately, status page update within 15 minutes.
- SEV2: a core flow is degraded, or a non-core flow is down. Page the owning team.
- SEV3: a minor bug with a workaround. Handle in working hours.
- SEV4: cosmetic issue. Normal backlog.

## Postmortems
SEV1 and SEV2 incidents need a blameless postmortem within 5 working days.
