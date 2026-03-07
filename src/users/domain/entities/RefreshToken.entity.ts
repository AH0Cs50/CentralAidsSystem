export class RefreshTokenEntry {
  constructor(
    public readonly id: string,
    public token: string,
    public userId: string,
    public expiresAt: Date,
    public revoked = false
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  revoke() {
    this.revoked = true;
  }
}
