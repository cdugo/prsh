import { body, oneOf, param } from 'express-validator';

/**
 * Input validation checks for creating a beast
 * @returns {object} The validation checks
 */
export const validationForCreateBeast = () => [body('gamerTag')
    .isString()
    .withMessage('GamerTag must be a string')
    .bail()
    .notEmpty()
    .withMessage('GamerTag is required')
    .bail()
    .isLength({ max: 20 })
    .withMessage('GamerTag must be less than 20 characters')
    .bail()
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('GamerTag contains invalid characters'),
body('email')
    .isString()
    .withMessage('Email must be a string')
    .bail()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email is not valid')];

/**
 * Input validation checks for updating a beast
 */
export const validationForUpdateBeast = () => [body('gamerTag')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('GamerTag must be a string')
    .bail()
    .notEmpty()
    .withMessage('GamerTag is required')
    .bail()
    .isLength({ max: 20 })
    .withMessage('GamerTag must be less than 20 characters')
    .bail()
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('GamerTag contains invalid characters'),
body('email')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Email must be a string')
    .bail()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email is not valid'),
oneOf([
    body('gamerTag').exists(),
    body('email').exists(),
], { message: 'At least one of \'gamerTag\' or \'email\' must be provided' }),
];

/**
 * Input validation checks for validating the ID
 */
export const validateId = () => [param('id')
    .isNumeric()
    .withMessage('Invalid ID format')
    .bail()
    .notEmpty()
    .withMessage('ID is required')];
