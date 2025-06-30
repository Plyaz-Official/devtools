export interface EnvironmentObject {
  readonly window?: Window;
  readonly process?: {
    readonly env?: Record<string, string | undefined>;
  };
}
/**
 * Check if the environment is Next.js.
 * @param env - The environment object.
 * @returns {boolean} True if the environment is Next.js, false otherwise.
 * @example isNextJS() => true
 */
export function isNextJS(env: EnvironmentObject = globalThis): boolean {
  return typeof env.window !== 'undefined' || Boolean(env.process?.env?.NEXT_RUNTIME);
}

/**
 * Check if the environment is Nest.js.
 * @param env - The environment object.
 * @returns {boolean} True if the environment is Nest.js, false otherwise.
 * @example isNestJS() => true
 */
export function isNestJS(env: EnvironmentObject = globalThis): boolean {
  return Boolean(env.process?.env?.NESTJS_APP);
}
