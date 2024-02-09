/**
 * Ensures that the dependency version has the caret semantic versioning prefix.
 * @param dependencyVersion
 */
export const ensureSemverPrefix = (dependencyVersion: string): string => {
    if (!dependencyVersion.startsWith("^")) {
        return "^" + dependencyVersion;
    }
    return dependencyVersion;
};
