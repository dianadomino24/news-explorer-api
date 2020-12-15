const { celebrate, Joi } = require('celebrate');

const validationUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().min(6),
  }),
});

const validationUserSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().min(6),
    name: Joi.string().trim().required().min(2)
      .max(30),
  }),
});

const validationArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().trim().required().min(2)
      .max(50),
    title: Joi.string().trim().required().min(2)
      .max(150),
    text: Joi.string().trim().required().min(2),
    date: Joi.date().required(),
    source: Joi.string().trim().required().min(2),
    link: Joi.string().trim().required().uri(),
    image: Joi.string().trim().required().uri(),
  }),
});

const validationArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().trim().required().length(24)
      .hex(),
  }),
});

module.exports = {
  validationUser,
  validationUserSignUp,
  validationArticle,
  validationArticleId,
};
