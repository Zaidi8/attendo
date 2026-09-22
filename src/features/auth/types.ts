/**
 * Domain representation of an authenticated teacher. Screens and hooks depend on
 * this shape — never on the raw Firebase `User` — so Firebase types don't leak
 * into the UI layer (architecture: keep raw Firebase out of screens).
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
