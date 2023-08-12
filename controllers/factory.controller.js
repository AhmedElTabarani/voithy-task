const APIFeatures = require('../utils/APIFeature');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/sendResponse');

class FactoryController {
  create = (Model) =>
    asyncHandler(async (req, res, next) => {
      const doc = await Model.create(req.body);
      if (doc.password) doc.password = undefined;

      sendSuccess(doc, 201, res);
    });

  getAll = (Model) =>
    asyncHandler(async (req, res, next) => {
      const APIFeature = new APIFeatures(Model.find(), req.query);
      const query = APIFeature.filter()
        .sort()
        .select()
        .paginate()
        .getQuery();

      const docs = await query;
      sendSuccess(docs, 200, res);
    });

  getOne = (Model) =>
    asyncHandler(async (req, res, next) => {
      const doc = await Model.findById(req.params.id);

      if (!doc)
        return next(
          new AppError(
            `There is no ${Model.modelName} with this id`,
            404
          )
        );

      sendSuccess(doc, 200, res);
    });

  update = (Model) =>
    asyncHandler(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return next(
          new AppError(
            `There is no ${Model.modelName} with this id`,
            404
          )
        );
      }
      sendSuccess(doc, 200, res);
    });

  delete = (Model) =>
    asyncHandler(async (req, res, next) => {
      await Model.findByIdAndDelete(req.params.id);
      sendSuccess(null, 204, res);
    });
}
module.exports = new FactoryController();
