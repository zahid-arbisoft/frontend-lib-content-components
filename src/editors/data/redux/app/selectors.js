import { createSelector } from 'reselect';
import { blockTypes } from '../../constants/app';
import * as urls from '../../services/cms/urls';
import * as module from './selectors';

export const appSelector = (state) => state.app;

const mkSimpleSelector = (cb) => createSelector([module.appSelector], cb);

// top-level app data selectors
export const simpleSelectors = {
  blockContent: mkSimpleSelector(app => app.blockContent),
  blockId: mkSimpleSelector(app => app.blockId),
  blockType: mkSimpleSelector(app => app.blockType),
  blockValue: mkSimpleSelector(app => app.blockValue),
  studioView: mkSimpleSelector(app => app.studioView),
  learningContextId: mkSimpleSelector(app => app.learningContextId),
  editorInitialized: mkSimpleSelector(app => app.editorInitialized),
  saveResponse: mkSimpleSelector(app => app.saveResponse),
  lmsEndpointUrl: mkSimpleSelector(app => app.lmsEndpointUrl),
  studioEndpointUrl: mkSimpleSelector(app => app.studioEndpointUrl),
  unitUrl: mkSimpleSelector(app => app.unitUrl),
  blockTitle: mkSimpleSelector(app => app.blockTitle),
  assets: mkSimpleSelector(app => app.assets),
};

export const returnUrl = createSelector(
  [module.simpleSelectors.unitUrl, module.simpleSelectors.studioEndpointUrl, module.simpleSelectors.learningContextId],
  (unitUrl, studioEndpointUrl, learningContextId) => (
    urls.returnUrl({ studioEndpointUrl, unitUrl, learningContextId })
  ),
);

export const isInitialized = createSelector(
  [
    module.simpleSelectors.unitUrl,
    module.simpleSelectors.blockValue,
  ],
  (unitUrl, blockValue) => !!(blockValue && (unitUrl || blockValue.data.is_lib_v2)),
);

export const displayTitle = createSelector(
  [
    module.simpleSelectors.blockType,
    module.simpleSelectors.blockTitle,
  ],
  (blockType, blockTitle) => {
    if (blockType === null) {
      return null;
    }
    if (blockTitle !== null) {
      return blockTitle;
    }
    return (blockType === blockTypes.html)
      ? 'Text'
      : blockType[0].toUpperCase() + blockType.substring(1);
  },
);

export const analytics = createSelector(
  [
    module.simpleSelectors.blockId,
    module.simpleSelectors.blockType,
    module.simpleSelectors.learningContextId,
  ],
  (blockId, blockType, learningContextId) => (
    { blockId, blockType, learningContextId }
  ),
);

export const isRaw = createSelector(
  [module.simpleSelectors.studioView],
  (studioView) => {
    if (!studioView || !studioView.data || !studioView.data.html) {
      return null;
    }
    if (studioView.data.html.includes('data-editor="raw"')) {
      return true;
    }
    return false;
  },
);

export const isLibrary = createSelector(
  [module.simpleSelectors.learningContextId],
  (learningContextId) => {
    if (!learningContextId) {
      return null;
    }
    if (learningContextId && learningContextId.startsWith('library-v1')) {
      return true;
    }
    return false;
  },
);

export default {
  ...simpleSelectors,
  isInitialized,
  returnUrl,
  displayTitle,
  analytics,
  isRaw,
  isLibrary,
};
