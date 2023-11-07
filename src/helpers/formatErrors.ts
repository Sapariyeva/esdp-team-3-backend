import { ValidationError } from 'class-validator';

export const formatErrors = (errors: ValidationError[]) => {
    const updatedErrors: { field: string; messages: string[] }[] = [];

    errors.forEach(e => {
        if (e.constraints) {
            const error = {
                field: e.property,
                messages: Object.values(e.constraints),
            };
            updatedErrors.push(error);
        }
    });
    return updatedErrors;
};
