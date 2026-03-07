export interface IpasswordHasher {

    /**
   * Hash a plain text password.
   * Returns a secure hashed representation ready for storage.
   */
    hash(plainPassword: string): Promise<string>;

    /**
     * Compare a plain text password against a stored hash.
     * Returns true if they match.
     */
    compare(
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean>;
}
