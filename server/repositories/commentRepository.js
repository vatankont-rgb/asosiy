const BaseRepository = require('./baseRepository');

class CommentRepository extends BaseRepository {
  constructor() {
    super('comments');
  }

  async getByArticleId(articleId) {
    const list = this.read();
    return list.filter(c => c.articleId === articleId);
  }
}

module.exports = new CommentRepository();
