import { buildDynamicErrorTemplate } from "../error-helpers";


export const NoUpdateQueryFound = buildDynamicErrorTemplate('NoUpdateQueryFound')
export const NoRemoveQueryFound = buildDynamicErrorTemplate('NoRemoveQueryFound')
export const NoFindQueryFound = buildDynamicErrorTemplate('NoFindQueryFound')
export const NoMatchingResult = buildDynamicErrorTemplate('NoMatchingResult')