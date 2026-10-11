import { Kind, parse, valueFromASTUntyped, type FieldNode, type SelectionSetNode } from "graphql";

export type ReadField = { name: string; alias?: string; arguments: Record<string, string>; fields: ReadField[] };
export class QueryError extends Error {}

const argumentsByField: Record<string, string[]> = {
  divisions: ["limit"], division: ["id"], districts: ["division_id", "limit"], district: ["id"],
  upazilas: ["district_id", "limit"], upazila: ["id"], unions: ["upazila_id", "limit"],
  holidays: ["limit"], encyclopedia: ["category", "limit"], encyclopediaCategories: [], search: ["q"],
};

export function parseReadQuery(query: string, variables: Record<string, unknown> = {}, operationName?: string): ReadField[] {
  if (query.length > 10_000) throw new QueryError("Query exceeds 10,000 characters.");
  let document;
  try { document = parse(query, { maxTokens: 1000 }); } catch { throw new QueryError("Invalid GraphQL syntax."); }
  if (document.definitions.length !== 1 || document.definitions[0].kind !== Kind.OPERATION_DEFINITION) throw new QueryError("Send one query operation; fragments are not supported.");
  const operation = document.definitions[0];
  if (operation.operation !== "query") throw new QueryError("Only read queries are supported.");
  if (operationName && operation.name?.value !== operationName) throw new QueryError("Unknown operation name.");
  for (const variable of operation.variableDefinitions ?? []) {
    const name = variable.variable.name.value;
    if (!(name in variables) && variable.defaultValue) variables = { ...variables, [name]: valueFromASTUntyped(variable.defaultValue) };
    if (!(name in variables) && variable.type.kind === Kind.NON_NULL_TYPE) throw new QueryError(`Missing variable '${name}'.`);
  }
  if (operation.selectionSet.selections.length > 10) throw new QueryError("At most 10 root fields are allowed.");
  let count = 0;
  function fields(selection: SelectionSetNode, depth: number): ReadField[] {
    if (depth > 5) throw new QueryError("Query nesting exceeds 5 levels.");
    return selection.selections.flatMap((node) => {
      if (++count > 200) throw new QueryError("Too many selected fields.");
      if (node.kind !== Kind.FIELD) throw new QueryError("Fragments are not supported.");
      if (node.name.value.startsWith("__")) throw new QueryError("Introspection fields are not supported.");
      for (const directive of node.directives ?? []) {
        if (!["skip", "include"].includes(directive.name.value)) throw new QueryError("Unsupported directive.");
        const condition = directive.arguments?.find((a) => a.name.value === "if");
        const value = condition && valueFromASTUntyped(condition.value, variables);
        if (typeof value !== "boolean") throw new QueryError("Directive condition must be boolean.");
        if (directive.name.value === "skip" ? value : !value) return [];
      }
      const args: Record<string, string> = Object.create(null);
      for (const arg of node.arguments ?? []) {
        if (Object.hasOwn(args, arg.name.value)) throw new QueryError("Duplicate argument.");
        const value = valueFromASTUntyped(arg.value, variables);
        if (!["string", "number", "boolean"].includes(typeof value)) throw new QueryError("Arguments must be scalar values.");
        args[arg.name.value] = String(value);
      }
      if (depth === 1) validateRoot(node, args);
      return [{ name: node.name.value, alias: node.alias?.value, arguments: args, fields: node.selectionSet ? fields(node.selectionSet, depth + 1) : [] }];
    });
  }
  return fields(operation.selectionSet, 1);
}

function validateRoot(node: FieldNode, args: Record<string, string>) {
  const allowed = Object.hasOwn(argumentsByField, node.name.value) ? argumentsByField[node.name.value] : undefined;
  if (!allowed) throw new QueryError(`Unsupported field '${node.name.value}'.`);
  for (const [key, value] of Object.entries(args)) {
    if (!allowed.includes(key)) throw new QueryError(`Unsupported argument '${key}'.`);
    if (key === "limit" || key === "id" || key.endsWith("_id")) {
      if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1 || (key === "limit" && Number(value) > 100)) throw new QueryError(`Invalid '${key}'; limits must be between 1 and 100 and IDs must be positive integers.`);
    } else if (!value.trim() || value.length > 200) throw new QueryError(`Invalid '${key}'.`);
  }
  if (["division", "district", "upazila"].includes(node.name.value) && !args.id) throw new QueryError("An id is required.");
  if (node.name.value === "encyclopedia" && !args.category) throw new QueryError("A category is required.");
  if (node.name.value === "search" && !args.q) throw new QueryError("A search query is required.");
  if (!node.selectionSet) throw new QueryError("Select the fields to return.");
}

export function projectGraphQL(value: unknown, selections: ReadField[]): unknown {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.map((item) => projectGraphQL(item, selections));
  if (!selections.length) return value;
  if (typeof value !== "object") throw new QueryError("Cannot select nested fields on a scalar.");
  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = Object.create(null);
  for (const field of selections) {
    if (!Object.hasOwn(source, field.name)) throw new QueryError(`Unknown selected field '${field.name}'.`);
    result[field.alias ?? field.name] = projectGraphQL(source[field.name], field.fields);
  }
  return result;
}
