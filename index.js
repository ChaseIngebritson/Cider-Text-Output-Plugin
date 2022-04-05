'use strict';

var fs = require('fs');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

class TextOutputPlugin {
  /**
   * Base Plugin Details (Eventually implemented into a GUI in settings)
   */
  name = 'Text Output Plugin';
  description = 'A Cider Music plugin that outputs song information to a text file';
  version = '0.1.0';
  author = 'Chase Ingebritson';
  fileName = 'output.txt';
  template = `$$t - $$a [$$l]`;
  fields = [{
    key: 'name',
    placeholder: '$$t'
  }, {
    key: 'artistName',
    placeholder: '$$a'
  }, {
    key: 'albumName',
    placeholder: '$$l'
  }, {
    key: 'composerName',
    placeholder: '$$c'
  }];
  /**
   * Private variables for interaction in plugins
   */

  env;
  /**
   * Runs on plugin load (Currently run on application start)
   */

  constructor(env) {
    this.env = env;
    this.debug('Loading Complete');
  }
  /**
   * Runs on app ready
   */


  async onReady() {
    await this.assureOutputFileExists();
    this.debug('Ready');
  }
  /**
   * Runs on renderer ready
   * @param win The current browser window
   */


  onRendererReady(win) {
    this.debug('Renderer Ready');
  }
  /**
   * Runs on app stop
   */


  onBeforeQuit() {
    this.debug('Stopped');
  }
  /**
   * Runs on playback State Change
   * @param attributes Music Attributes (attributes.status = current state)
   */


  onPlaybackStateDidChange(attributes) {
    const updatedTemplate = this.populateTemplate(attributes);
    this.updateOutputFile(updatedTemplate);
  }
  /**
   * Runs on song change
   * @param attributes Music Attributes
   */


  onNowPlayingItemDidChange(attributes) {
    const updatedTemplate = this.populateTemplate(attributes);
    this.updateOutputFile(updatedTemplate);
  }

  debug(text) {
    console.log(`[Plugin][${this.name}]`, text);
  }
  /**
   * Create the output file, or just open it if it already exists
   * @private
   */


  async assureOutputFileExists() {
    try {
      await fs__namespace.promises.mkdir(this.env.dir, {
        recursive: true
      });
      await fs__namespace.promises.open(`${this.env.dir}/${this.fileName}`, 'w');
    } catch (err) {
      console.error(`[Plugin][${this.name}]`, err);
    }
  }
  /**
   * Populate the template with the song and artist
   * @private
   */


  populateTemplate(attributes) {
    let output = this.template;
    this.fields.forEach(field => {
      if (attributes[field.key]) {
        output = output.replaceAll(field.placeholder, attributes[field.key]);
      }
    });
    return output;
  }
  /**
   * Create and update the file
   * @param input The contents to write to the file
   * @private
   */


  async updateOutputFile(input) {
    await fs__namespace.promises.writeFile(`${this.env.dir}/${this.fileName}`, input).catch(err => console.error(`[Plugin][${this.name}]`, err));
  }

}

module.exports = TextOutputPlugin;
