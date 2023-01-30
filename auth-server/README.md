# auth-server
An auth server for a 2022/2023 bootcamp capstone. This REST-based API uses JWTs to authenticate users and manages a whitelist of refresh tokens allowing users to re-authenticate without having to sign in multiple times. Currently will validate Google OAuth2 tokens for the companion restaurant app as well.

# JWT

-- Verifies tokens from the www.google.com provider via the public key resource made available at https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com via https://firebase.google.com/docs/auth/admin/verify-id-tokens
