// Human-approved pre-launch migrations; occupied targets remain deferred.
export const slugMigrations = [
  {make: 'mercedes-benz', old: 'rady-107', slug: 'r107', name: 'R107 / C107'},
  {make: 'mercedes-benz', old: 'type-204', slug: 'w204', name: 'W204'},
  {make: 'rolls-royce', old: 'phantom-q1130591', slug: 'phantom-vii', name: 'Phantom VII', productionStart: 2003, productionEnd: 2017, bodyTypes: ['sedan']},
  {make: 'rolls-royce', old: 'phantom-q33657874', slug: 'phantom-viii', name: 'Phantom VIII', productionStart: 2017, productionEnd: null, bodyTypes: ['sedan']},
  {make: 'willys', old: 'willys-overland-jeepster', slug: 'jeepster'},
];

export function applySlugMigrations(records) {
  for (const record of records) {
    const migration = slugMigrations.find(m => m.make === record.makeSlug && [m.old, m.slug].includes(record.slug));
    if (!migration) continue;
    if (records.some(r => r !== record && r.makeSlug === migration.make && r.slug === migration.slug)) {
      throw Error(`Slug migration collision: ${migration.make}/${migration.slug}`);
    }
    const {make, old, productionStart, productionEnd, ...fields} = migration;
    Object.assign(record, fields);
    record.aliases = [...new Set([...(record.aliases ?? []), old])];
    if ('qid' in record) {
      if (productionStart !== undefined) record.productionStart = productionStart;
      if (productionEnd !== undefined) record.productionEnd = productionEnd;
      if (fields.bodyTypes?.length === 1) record.body = fields.bodyTypes[0];
    } else {
      if (productionStart !== undefined) record.from = productionStart;
      if (productionEnd !== undefined) record.to = productionEnd;
    }
  }
  return records;
}
