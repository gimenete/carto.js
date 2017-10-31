var CartoDBLayer = require('../../../geo/map/cartodb-layer');

function Layer (source, style, opts) {
  if (typeof arguments[0] === 'string') {
    this._id = arguments[0];
    this._source = arguments[1];
    this._style = arguments[2];
  } else {
    this._source = arguments[0];
    this._style = arguments[1];
    this._id = 'fakeId';
  }
  this._visible = true;
}

Layer.prototype.setStyle = function (style, opts) {
  opts = opts || {};
  this._style = style;
  if (!this._internalModel) {
    return;
  }
  this._internalModel.set('cartocss', style.toCartoCSS(), { silent: true });
  if (opts.reload === false) {
    return Promise.resolve();
  }
  return this._internalModel._engine.reload();
};

Layer.prototype.hide = function () {
  this._visible = false;
  if (this._internalModel) {
    this._internalModel.hide();
  }
};

Layer.prototype.show = function () {
  this._visible = true;
  if (this._internalModel) {
    this._internalModel.show();
  }
};

Layer.prototype.setSource = function (source) {
  this._source = source;
  if (this._internalModel) {
    this._internalModel.set('source', source);
  }
};

Layer.prototype.$setEngine = function (engine) {
  this._source.$setEngine(engine);
  this._internalModel = new CartoDBLayer({
    id: this._id,
    source: this._source.$getInternalModel(),
    cartocss: this._style.toCartoCSS(),
    visible: this._visible
  }, { engine: engine });
};

Layer.prototype.$getInternalModel = function () {
  return this._internalModel;
};

module.exports = Layer;
