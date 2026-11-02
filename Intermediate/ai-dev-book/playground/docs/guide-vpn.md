# Guide: VPN access

## Connecting
Install the WireGuard client and import the profile from the IT portal. The VPN is required for staging and for internal dashboards.

## Problems
If the tunnel connects but internal sites do not load, run `vpnctl doctor`; it fixes the DNS settings on macOS and Windows. If you lost your device, report it to security so they can revoke the profile.
