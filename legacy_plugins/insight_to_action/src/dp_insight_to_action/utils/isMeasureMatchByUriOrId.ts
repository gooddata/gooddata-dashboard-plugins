import {
    IMeasureBody,
    IMeasureDefinition,
    IMeasureMetadataObject,
    isIdentifierRef,
} from "@gooddata/sdk-model";

export const isMeasureMatchByUriOrId = (
    measure: IMeasureBody<IMeasureDefinition>,
    matchMeasure: IMeasureMetadataObject | undefined,
) => {
    if (!matchMeasure) return false;

    return isIdentifierRef(measure.definition.measureDefinition.item)
        ? measure.definition.measureDefinition.item.identifier === matchMeasure.id
        : measure.definition.measureDefinition.item.uri === matchMeasure.uri;
};
