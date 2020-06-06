
import { buildErrorTemplate } from '@/sanityjs';
import Ajv from 'ajv'

interface ValidationErrorParameters {
    errors: Ajv.ErrorObject[]
}

export const ValidationError = buildErrorTemplate<ValidationErrorParameters>(`ValidationError`, 'Validation failed')

