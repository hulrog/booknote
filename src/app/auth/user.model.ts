export class User {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    private _token: string,
    private tokenExpirationDate: Date | null
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }
}
