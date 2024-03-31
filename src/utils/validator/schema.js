const Joi = require('joi');

function validator(schema, data) {
  const joiSchema = Joi.object(schema)
    .messages({
      'any.required': 'O campo {{#label}} é obrigatório',
      'string.base': 'O campo {{#label}} deve ser tipo "texto"',
      'string.empty': 'O campo {{#label}} não pode ser vazio',
      'string.min': 'O campo {{#label}} deve ter um comprimento mínimo de {{#limit}}',
      'string.max': 'O campo {{#label}} deve ter um comprimento máximo de {{#limit}}',
      'string.email': 'O campo {{#label}} não é um e-mail válido',
      'number.base': 'O campo {{#label}} deve ser tipo "Numérico"',
      'number.min': 'O campo {{#label}} deve ter valor mínimo de {{#limit}}',
      'number.max': 'O campo {{#label}} deve ter valor máximo de {{#limit}}',
      'date.base': 'O campo {{#label}} não é uma data válida',
      'object.unknown': 'O campo {{#label}} não permitido',
      'any.only': 'O campo {{#label}} aceita apenas {{#valids}}',
    })
    .options({
      abortEarly: false,
    })

  const validate = joiSchema.validate(data)

  if (validate.error) {
    const errorDetails = {
      details: validate.error.message.split('. '),
    }

    throw new Error(JSON.stringify(errorDetails))
  }
}

exports.validate = validator;