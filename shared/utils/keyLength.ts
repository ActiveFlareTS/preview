export const keyLength = (tableName: string): number => {
  switch (tableName) {
    case "users":
      return 8;

    default:
      throw new Error(`Unknown table name in keyLength: ${tableName}`);
  }
};

