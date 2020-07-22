export enum AccessLevel {
  Admin = 1,
  Director = 2,
  Coach = 3,
  Customer = 4,
  Provider = 5,
}

export const hasAccess = (requiredLevel: AccessLevel, userLevel: AccessLevel) =>
  userLevel <= requiredLevel;
