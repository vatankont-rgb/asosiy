const BaseRepository = require('./baseRepository');

class CategoryRepository extends BaseRepository {
  constructor() {
    super('categories');
    this.seedDefaultCategories();
  }

  seedDefaultCategories() {
    const list = this.read();
    if (list.length === 0) {
      const defaults = [
        { id: 'cat-1', names: { uz: 'Siyosat', uzk: 'Сиёсат', en: 'Politics' }, slug: 'siyosat', order: 1, parentId: null },
        { id: 'cat-2', names: { uz: 'Iqtisodiyot', uzk: 'Иқтисодиёт', en: 'Economy' }, slug: 'iqtisodiyot', order: 2, parentId: null },
        { id: 'cat-3', names: { uz: 'Texnologiya', uzk: 'Технология', en: 'Technology' }, slug: 'texnologiya', order: 3, parentId: null },
        { id: 'cat-4', names: { uz: 'Sport', uzk: 'Спорт', en: 'Sport' }, slug: 'sport', order: 4, parentId: null },
        { id: 'cat-5', names: { uz: 'Madaniyat', uzk: 'Маданият', en: 'Culture' }, slug: 'madaniyat', order: 5, parentId: null },
        { id: 'cat-6', names: { uz: 'Tahlil', uzk: 'Таҳлил', en: 'Analysis' }, slug: 'tahlil', order: 6, parentId: null }
      ];
      this.write(defaults);
    }
  }
}

module.exports = new CategoryRepository();
