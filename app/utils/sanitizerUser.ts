// utils/sanitizeUser.ts
import type { User } from '../models/User';

/**
 * Retorna solo los campos necesarios y seguros para almacenamiento.
 * Evita guardar arrays grandes o relaciones innecesarias.
 */
export const sanitizeUser = (user: User): Partial<User> => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});
