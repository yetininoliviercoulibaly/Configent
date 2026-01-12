export class SecretNotFoundException extends Error {
  constructor(key: string) {
    super(`Secret with key '${key}' not found.`);
    this.name = "SecretNotFoundException";
  }
}

export class SecretAlreadyExistsException extends Error {
  constructor(key: string) {
    super(`Secret with key '${key}' already exists.`);
    this.name = "SecretAlreadyExistsException";
  }
}
