export const sc = {
  object: (obj: {[key: string]: NodeSchema}, opts: ObjectOpts = {}): ObjectSchema => {
    return {
      kind: "object",
      fields: Object.entries(obj).map(entry => ({name: entry[0], value: entry[1]})),
      opts,
    };
  },
  string: (): StringSchema => ({kind: "string"}),
  boolean: (): BooleanSchema => ({kind: "boolean"}),
  array: (child: NodeSchema): ArraySchema => ({kind: "array", child}),
  link: (tag: symbol): LinkSchema => ({kind: "link", tag}),
  allLinks: (tag: symbol): AllLinksSchema => ({kind: "all_links", tag}),
} as const;

export type NodeSchema =
  | ObjectSchema
  | StringSchema
  | BooleanSchema
  | ArraySchema
  | LinkSchema
  | AllLinksSchema
;

export type RootSchema = {
  root: NodeSchema,
  symbols: {[key: symbol]: NodeSchema}
};

export type ObjectOpts = {
  summarize?: undefined | ((v: unknown) => string),
};
export type ObjectField = {
  name: string,
  value: NodeSchema,
};
export type ObjectSchema = {
  kind: "object",
  fields: ObjectField[],
  opts: ObjectOpts,
};
export type ArraySchema = {
  kind: "array",
  child: NodeSchema,
};
export type StringSchema = {
  kind: "string",
};
export type BooleanSchema = {
  kind: "boolean",
};
export type LinkSchema = {
  kind: "link",
  tag: symbol,
};
export type AllLinksSchema = {
  kind: "all_links",
  tag: symbol,
};

// TODO: summarize should return a JSX.Element rather than just a single
// string.
export function summarize(value: unknown, schema: NodeSchema): string {
  if(schema.kind === "object") {
    return schema.opts.summarize?.(value) ?? "E_NO_SUMMARY";
  }
  return "E_NO_SUMMARY";
}

// link should stringify to its name
// the name can be found in the root data

// !
// schemas define how the data should be rendered
// we should:
// - define a parser and stringifier for each schema
// - define an editor for each schema
//
// !
// should stringification be possible without knowing the schema?
// - the reason it isn't right now is for:
//   - schema-defined field order in objects
//   - 'array_symbol', 'array_item' in ArraySchema