import {User} from '../entities/user.entity.js'

export interface IUserRepository {
  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @returns A User entity if found, otherwise null.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their unique ID.
   * @param id - The ID of the user to find.
   * @returns A User entity if found, otherwise null.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Persists a new or updated User entity.
   * @param user - The User entity to save.
   */
  save(user: User): Promise<void>;

  /**
   * Deletes a user by their unique ID.
   * Optional, but often useful.
   */
  delete(id: string): Promise<void>;

  /**
   * Updates an existing user entity.
   * Optional depending on whether save() covers updates.
   */
  update(user: User): Promise<void>;
}
