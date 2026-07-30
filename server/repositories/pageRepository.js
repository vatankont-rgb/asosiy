const BaseRepository = require('./baseRepository');

class PageRepository extends BaseRepository {
  constructor() {
    super('pages');
  }
}

module.exports = new PageRepository();
