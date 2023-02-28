import {body} from "express-validator";


export const loginValidation = [
    body('email', 'incorrect mail').isEmail(),
    body('password', 'password length must be at least 5 symbols').isLength({min: 5}),
];
export const registerValidation = [
    body('email', 'incorrect mail').isEmail(),
    body('password', 'password length must be at least 5 symbols').isLength({min: 5}),
    body('firstName', 'fill in you first name').isLength({min: 2}),
    body('secondName', 'fill in you second name').isLength({min: 2}),
    // body('role', 'incorrect role'),
];
export const hotelCreateValidation = [
    body('name', 'Type in title').isLength({min: 2}).isString(),
    body('location', 'Type in location').isLength({min: 3}).isString(),
];
export const hotelCreateServiceValidation = [
    body('name', 'Type in title').isLength({min: 1}).isString(),
    body('price', 'Type in number').not().isEmpty().isNumeric(),
];
// export const hotelCreatePaymentValidation = [
//     body('name', 'Type in title').isLength({min: 1}).isString(),
//     body('price', 'Type in number').not().isEmpty().isNumeric(),
// ];