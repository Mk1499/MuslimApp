/**
 * moment ships every locale as plain JS with no bundled type declarations,
 * so TypeScript cannot resolve `moment/locale/<name>` on its own (and TS 6
 * errors on side-effect imports that don't resolve to a typed module).
 * Declaring them lets us register a locale at runtime for localised month and
 * weekday names.
 */
declare module 'moment/locale/ar';
