# Guide: deploying a service

## Normal deploys
Merging to main builds an image and deploys it to staging. Promote to production with `deployctl promote <service>`; the rollout goes to 5% of traffic, then 50%, then 100%, with a 10 minute pause between steps.

## Rolling back
Run `deployctl rollback <service>` to return to the previous version. A rollback skips the pauses and finishes in about 2 minutes.

## Freeze
There are no production deploys on Friday after 15:00 or during a declared SEV1, except fixes for that incident.
