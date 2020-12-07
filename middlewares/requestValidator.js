const { celebrate, Joi } = require('celebrate');

const validationUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validationUserSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validationArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(50),
    title: Joi.string().required().min(2).max(50),
    text: Joi.string().required().min(2).max(500),
    date: Joi.string().required().min(10).max(10),
    source: Joi.string().required().min(10).max(50),
    link: Joi.string().required().min(9).uri(),
    image: Joi.string().required().min(9).uri(),
  }),
});

const validationArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validationUser,
  validationUserSignUp,
  validationArticle,
  validationArticleId,
};
