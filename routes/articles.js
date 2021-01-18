const router = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  validationArticle,
  validationArticleId,
} = require('../middlewares/requestValidator');

router.get('/', getArticles);
router.post('/', validationArticle, createArticle);
router.delete('/:articleId', validationArticleId, deleteArticle);

module.exports = router;
