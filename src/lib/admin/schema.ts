/**
 * Field schema for the admin content editor.
 *
 * A document's schema is a plain, serializable description of its fields:
 * the server uses it to validate saves, the client renders a form from it.
 * Nothing here imports Node APIs, so it is safe in Client Components.
 */

export type SelectOption = { value: string; label: string };

type Base = {
  key: string;
  label: string;
  /** Short hint under the field. */
  help?: string;
  /** Empty value → key removed from JSON (for `foo?: string` fields). */
  optional?: boolean;
};

export type Field =
  | (Base & { type: "text"; placeholder?: string; required?: boolean; mono?: boolean })
  | (Base & { type: "textarea"; rows?: number; required?: boolean })
  | (Base & { type: "number"; min?: number; max?: number })
  | (Base & { type: "boolean" })
  | (Base & { type: "select"; options: SelectOption[] })
  | (Base & { type: "icon" })
  | (Base & { type: "image" })
  | (Base & { type: "video" })
  | (Base & { type: "strings"; itemLabel?: string })
  | (Base & { type: "list"; fields: Field[]; itemLabel?: string; titleKey?: string; min?: number })
  | (Base & { type: "group"; fields: Field[]; collapsed?: boolean });

export type Schema = Field[];

/* ───────────── builders (keep document definitions terse) ───────────── */

export const f = {
  text: (key: string, label: string, opts: Partial<Extract<Field, { type: "text" }>> = {}): Field => ({
    type: "text",
    key,
    label,
    ...opts,
  }),
  textarea: (key: string, label: string, opts: Partial<Extract<Field, { type: "textarea" }>> = {}): Field => ({
    type: "textarea",
    key,
    label,
    ...opts,
  }),
  number: (key: string, label: string, opts: Partial<Extract<Field, { type: "number" }>> = {}): Field => ({
    type: "number",
    key,
    label,
    ...opts,
  }),
  boolean: (key: string, label: string, help?: string): Field => ({ type: "boolean", key, label, help }),
  select: (key: string, label: string, options: SelectOption[], opts: Partial<Base> = {}): Field => ({
    type: "select",
    key,
    label,
    options,
    ...opts,
  }),
  icon: (key = "icon", label = "Иконка"): Field => ({ type: "icon", key, label }),
  image: (key: string, label: string, opts: Partial<Base> = {}): Field => ({ type: "image", key, label, ...opts }),
  video: (key: string, label: string, opts: Partial<Base> = {}): Field => ({ type: "video", key, label, ...opts }),
  strings: (key: string, label: string, opts: Partial<Extract<Field, { type: "strings" }>> = {}): Field => ({
    type: "strings",
    key,
    label,
    ...opts,
  }),
  list: (
    key: string,
    label: string,
    fields: Field[],
    opts: Partial<Extract<Field, { type: "list" }>> = {},
  ): Field => ({ type: "list", key, label, fields, ...opts }),
  group: (key: string, label: string, fields: Field[], opts: Partial<Extract<Field, { type: "group" }>> = {}): Field => ({
    type: "group",
    key,
    label,
    fields,
    ...opts,
  }),
};

/* ───────────── defaults ───────────── */

/** A blank value for a field — used for new list items and new collection entries. */
export function emptyValue(field: Field, iconFallback = "box"): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
    case "image":
    case "video":
      return "";
    case "number":
      return field.min ?? 0;
    case "boolean":
      return false;
    case "select":
      return field.options[0]?.value ?? "";
    case "icon":
      return iconFallback;
    case "strings":
    case "list":
      return [];
    case "group":
      return emptyObject(field.fields, iconFallback);
  }
}

export function emptyObject(schema: Schema, iconFallback = "box"): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of schema) {
    if (field.optional) continue;
    out[field.key] = emptyValue(field, iconFallback);
  }
  return out;
}

/* ───────────── validation / normalization ───────────── */

export type ValidationError = { path: string; message: string };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Validate `value` against `schema` and return a normalized copy.
 *
 * - Known fields are coerced to their declared type.
 * - Unknown keys are kept as-is (they came from the original document).
 * - Optional fields with empty values are dropped from the object.
 * - `validIcons` restricts icon fields to the registry.
 */
export function normalizeObject(
  schema: Schema,
  value: unknown,
  ctx: { validIcons: Set<string>; path?: string; errors: ValidationError[] },
): Record<string, unknown> {
  const src = isPlainObject(value) ? value : {};
  const out: Record<string, unknown> = { ...src };
  const base = ctx.path ? `${ctx.path}.` : "";

  for (const field of schema) {
    const path = base + field.key;
    const raw = src[field.key];
    const result = normalizeField(field, raw, { ...ctx, path });
    if (result === undefined) {
      delete out[field.key];
    } else {
      out[field.key] = result;
    }
  }
  return out;
}

function normalizeField(
  field: Field,
  raw: unknown,
  ctx: { validIcons: Set<string>; path: string; errors: ValidationError[] },
): unknown {
  const { path, errors } = ctx;
  switch (field.type) {
    case "text":
    case "textarea": {
      const s = raw == null ? "" : String(raw);
      if (field.required && !s.trim()) errors.push({ path, message: `«${field.label}»: обязательное поле` });
      if (field.optional && !s.trim()) return undefined;
      return s;
    }
    case "image":
    case "video": {
      const s = raw == null ? "" : String(raw).trim();
      if (s && !/^(\/|https?:\/\/)/.test(s)) {
        errors.push({ path, message: `«${field.label}»: путь должен начинаться с / или https://` });
      }
      if (field.optional && !s) return undefined;
      return s;
    }
    case "number": {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(n)) {
        if (field.optional) return undefined;
        errors.push({ path, message: `«${field.label}»: должно быть числом` });
        return field.min ?? 0;
      }
      if (field.min !== undefined && n < field.min) errors.push({ path, message: `«${field.label}»: минимум ${field.min}` });
      if (field.max !== undefined && n > field.max) errors.push({ path, message: `«${field.label}»: максимум ${field.max}` });
      return n;
    }
    case "boolean":
      return raw === true || raw === "true" || raw === "on";
    case "select": {
      const s = raw == null ? "" : String(raw);
      if (field.optional && !s) return undefined;
      if (!field.options.some((o) => o.value === s)) {
        errors.push({ path, message: `«${field.label}»: недопустимое значение «${s}»` });
      }
      return s;
    }
    case "icon": {
      const s = raw == null ? "" : String(raw);
      if (!ctx.validIcons.has(s)) errors.push({ path, message: `«${field.label}»: неизвестная иконка «${s}»` });
      return s;
    }
    case "strings": {
      const arr = Array.isArray(raw) ? raw : [];
      const list = arr.map((x) => (x == null ? "" : String(x))).filter((x) => x.trim() !== "");
      if (field.optional && list.length === 0) return undefined;
      return list;
    }
    case "list": {
      const arr = Array.isArray(raw) ? raw : [];
      const list = arr.map((item, i) => normalizeObject(field.fields, item, { ...ctx, path: `${path}[${i}]` }));
      if (field.min !== undefined && list.length < field.min) {
        errors.push({ path, message: `«${field.label}»: минимум ${field.min} элемент(а)` });
      }
      if (field.optional && list.length === 0) return undefined;
      return list;
    }
    case "group": {
      if (field.optional && (raw == null || (isPlainObject(raw) && Object.keys(raw).length === 0))) return undefined;
      return normalizeObject(field.fields, raw, { ...ctx, path });
    }
  }
}
