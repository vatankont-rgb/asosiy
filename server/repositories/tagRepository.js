const BaseRepository = require('./baseRepository');

class TagRepository extends BaseRepository {
  constructor() {
    super('tags');
  }
}

module.exports = new TagRepository();
