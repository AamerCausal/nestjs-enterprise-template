export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

export class ServiceResult {
  static success<T>(data: T): Result<T> {
    return { success: true, data };
  }

  static failure<E = string>(error: E): Result<never, E> {
    return { success: false, error };
  }
}