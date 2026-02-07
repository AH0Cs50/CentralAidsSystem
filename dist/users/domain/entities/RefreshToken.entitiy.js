export class RefreshTokenEntry {
    id;
    token;
    userId;
    expiresAt;
    revoked;
    constructor(id, token, userId, expiresAt, revoked = false) {
        this.id = id;
        this.token = token;
        this.userId = userId;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
    }
    isExpired() {
        return new Date() > this.expiresAt;
    }
    revoke() {
        this.revoked = true;
    }
}
