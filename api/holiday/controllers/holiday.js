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
    const {user, leaveYear} = ctx.query
    if (ctx.query._q) {
      // console.log('search')
      entities = await strapi.services.holiday.search(ctx.query);
    } else {
      // console.log('Custom')
      // entities = await strapi.services.holiday.find(ctx.query);
      entities = await strapi.query('holiday')
      .find({user: user, leaveYear: leaveYear, _sort: 'startDate:DESC'});
    }
    return entities.map(entity =>
      sanitizeEntity(entity, { model: strapi.models.holiday })
    );
  },

  async toil(ctx) {
    let entities;
    const result = await strapi.query('holiday')
    .model.query(qb => {
      // qb.whereIn('category', ['TOIL (earned)', 'TOIL (taken)'])
      qb.where('category', 'LIKE', 'TOIL%')
      .where('user', ctx.query.user)
    })
    .fetchAll();
    entities = result.toJSON();
    // console.log(entities)
    return entities;
  },
};
