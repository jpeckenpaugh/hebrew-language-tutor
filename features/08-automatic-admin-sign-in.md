# Feature: Automatic Admin Sign-In

- **Sprint:** 03
- **Scope item:** h.)
- **Status:** capability definition

## Capability

Clicking the "Admin" button on the Title screen signs the user in as Admin
automatically, without prompting for a username or password. The Admin sign-in
form is removed.

## Scope Notes

- The existing dummy gate still applies on the backend; the frontend simply
  supplies a fixed credential to obtain an admin token.