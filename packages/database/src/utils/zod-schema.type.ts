export function defineTableZodSchema<TSelect, TInsert, TUpdate>(schema: {
	select: TSelect;
	insert: TInsert;
	update: TUpdate;
}) {
	return schema;
}
