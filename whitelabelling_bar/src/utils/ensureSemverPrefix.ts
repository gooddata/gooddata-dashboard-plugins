export const ensureSemverPrefix = (dependencyVersion: string): string => {
    if (!dependencyVersion.startsWith("^")) {
        return "^" + dependencyVersion;
    }
    return dependencyVersion;
};
