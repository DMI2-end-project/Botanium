import PocketBase, {Record} from "pocketbase";

class DatabaseManager {
  private static _instance: DatabaseManager;
  private _roles: Record[] = [];
  private _pocketbase: PocketBase = new PocketBase('https://pocketbase-dmi2.fly.dev');
  
  private constructor() {
  }
  
  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
  
  get pb() {
    return this._pocketbase;
  }
  
  async fetchRoles() {
    let roles = await this._pocketbase.collection('role').getFullList();
    this._roles = roles;
    return roles;
  }
  
  get roles() {
    return this._roles;
  }
}

export const DatabaseManagerInstance = DatabaseManager.Instance;

//export default DatabaseManager;