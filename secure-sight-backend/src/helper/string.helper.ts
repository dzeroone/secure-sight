const pluralRules = new Intl.PluralRules('en-US');

export const pluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count > 1 ? suffix : ''}`;

export const pluralizeWithMapping = (count: number, mapping: {one: string, other: string}) => pluralRules.select(count) == "one" ? mapping.one : mapping.other;