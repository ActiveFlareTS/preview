import { Model } from "sutando";
import { User } from "./users";

export class Credential extends Model {
  // Define fillable attributes for mass assignment protection
  declare publicKey: string;
  declare counter: number;
  declare backedUp: boolean;
  declare transports: string;

  // Define attribute casting
  casts = {
    counter: 'integer',
    backedUp: 'integer',
    // transports is stored as text (likely JSON)
  };

  // Relationships
  relationUser() {
    return this.belongsTo(User);
  }
}