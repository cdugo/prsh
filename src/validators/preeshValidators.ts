import { body, param, query } from 'express-validator';
import { preeshHeaviness } from '@prisma/client';

/**
 * Input validation checks for creating a preesh
 * @returns {object} The validation checks
 */
export const validationForCreatePreesh = () => [
    body('text')
        .isString()
        .withMessage('Text must be a string')
        .bail()
        .notEmpty()
        .withMessage('Text is required'),
    body('authorId')
        .isInt()
        .withMessage('AuthorId must be an integer')
        .bail()
        .notEmpty()
        .withMessage('AuthorId is required'),
    body('receiverId')
        .isInt()
        .withMessage('ReceiverId must be an integer')
        .bail()
        .notEmpty()
        .withMessage('ReceiverId is required'),
    body('heaviness')
        .isIn(Object.values(preeshHeaviness))
        .withMessage('Invalid heaviness value'),
];

/**
 * Input validation checks for validating the ID
 */
export const validateId = () => [
    param('id')
        .isInt()
        .withMessage('Invalid ID format')
        .bail()
        .notEmpty()
        .withMessage('ID is required'),
];

/**
 * Input validation checks for pagination parameters
 */
export const validatePagination = () => [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('pageSize')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Page size must be between 1 and 100'),
];

/**
 * Input validation checks for validating the Beast ID
 */
export const validateBeastId = () => [
    param('beastId')
        .isInt()
        .withMessage('Invalid Beast ID format')
        .bail()
        .notEmpty()
        .withMessage('Beast ID is required'),
];
