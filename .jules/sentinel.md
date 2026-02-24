# Sentinel's Security Journal

## 2026-02-24 - [Unprotected Public Signup in Admin System]
**Vulnerability:** The application exported a `signup` Server Action that allowed any user to create an account. Since the middleware only checked for a valid session and not for roles or membership in a staff whitelist, any registered user gained full access to the MIS.
**Learning:** Exported Server Actions are public endpoints reachable by anyone, even if not linked in the UI. Unused or dangerous actions must be removed to minimize the attack surface.
**Prevention:** Remove unused authentication actions and implement role-based access control or a whitelist for administrative systems. Use defensive programming in all entry points (like Server Actions) by validating inputs and verifying authorization.
