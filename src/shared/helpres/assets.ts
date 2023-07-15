export function isNil(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

export function assertIsDefined<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (isNil(value)) {
    throw new Error(
      message ?? `Expected 'value' to be defined, but received ${ String(value) }`,
    );
  }
}
