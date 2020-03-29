const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["bank-holiday"].search(ctx.query);
    } else {
      entities = await strapi.services["bank-holiday"].find(ctx.query);
    }
    return entities.map(entity =>
      sanitizeEntity(entity, { model: strapi.models["bank-holiday"] })
    );
  },

  async findRange(ctx) {
    let entities;
    const { startYear, endYear } = ctx.query
    if (startYear === endYear) {
      const result = await strapi.query('bank-holiday')
      .model.query(qb => {
        qb.where('date', 'LIKE', `${startYear}%`)
      })
      .fetchAll({columns: 'date'});
      entities = result.toJSON();
    } else {
      const result = await strapi.query('bank-holiday')
      .model.query(qb => {
        qb.where('date', 'LIKE', `${startYear}%`)
        .orWhere('date', 'LIKE', `${endYear}%`)
      })
      .fetchAll({columns: 'date'});
      entities = result.toJSON();
    }
    return entities;
  },
};
