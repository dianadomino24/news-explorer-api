const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError('Articles are not found');
      }
      return res.status(200).send(articles);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Validation error while creating article');
      }
      return next(err);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new NotFoundError('The article has not been found'))
    .then((article) => {
      // prohibition to delete other people's articles
      if (article.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('You can\'t delete other people\'s articles');
      }

      Article.findByIdAndRemove(req.params.articleId)
        .then((deletedArticle) => res.status(200).send(deletedArticle));
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
