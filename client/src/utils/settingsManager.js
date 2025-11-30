/**
 * ヘッダー検索設定の管理ロジック
 */

const STORAGE_KEYS = {
  DEFAULT_PLAYBACK: 'defaultPlaybackMode',
  SHORT_VIDEO_FILTER_ENABLED: 'shortVideoFilterEnabled',
  SHORT_VIDEO_FILTER_MINUTES: 'shortVideoFilterMinutes',
  DARK_MODE: 'darkMode',
};

/**
 * デフォルト再生方式を保存
 */
export function saveDefaultPlayback(mode) {
  try {
    const seconds = 60 * 60 * 24 * 365 * 10;
    const expires = new Date(Date.now() + seconds * 1000).toUTCString();
    document.cookie = `StreamType=${encodeURIComponent(mode)}; expires=${expires}; path=/`;
    localStorage.setItem(STORAGE_KEYS.DEFAULT_PLAYBACK, mode);
  } catch (e) {
    console.error('saveDefaultPlayback error', e);
  }
}

/**
 * デフォルト再生方式を読み込み
 */
export function loadDefaultPlayback() {
  try {
    const fromStorage = localStorage.getItem(STORAGE_KEYS.DEFAULT_PLAYBACK);
    if (fromStorage) return fromStorage;

    const m = (document.cookie.match(new RegExp('(^| )StreamType=([^;]+)')) || [])[2];
    if (m) {
      const mode = decodeURIComponent(m);
      localStorage.setItem(STORAGE_KEYS.DEFAULT_PLAYBACK, mode);
      return mode;
    }

    return '1';
  } catch (e) {
    console.error('loadDefaultPlayback error', e);
    return '1';
  }
}

/**
 * 短動画フィルタ設定を保存
 */
export function saveShortVideoFilter(enabled, minutes) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_ENABLED, JSON.stringify(enabled));
    localStorage.setItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_MINUTES, JSON.stringify(minutes));
    window.__autoplayDurationFilter = {
      enabled,
      minutes,
      maxSeconds: minutes * 60,
    };
    console.log('[settings] saveShortVideoFilter:', window.__autoplayDurationFilter);
  } catch (e) {
    console.error('saveShortVideoFilter error', e);
  }
}

/**
 * 短動画フィルタ設定を読み込み
 */
export function loadShortVideoFilter() {
  try {
    const enabled = localStorage.getItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_ENABLED);
    const minutes = localStorage.getItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_MINUTES);

    const result = {
      enabled: enabled !== null ? JSON.parse(enabled) : false,
      minutes: minutes !== null ? JSON.parse(minutes) : 4,
    };

    window.__autoplayDurationFilter = {
      enabled: result.enabled,
      minutes: result.minutes,
      maxSeconds: result.minutes * 60,
    };

    console.log('[settings] loadShortVideoFilter:', window.__autoplayDurationFilter);
    return result;
  } catch (e) {
    console.error('loadShortVideoFilter error', e);
    return { enabled: false, minutes: 4 };
  }
}

/**
 * ダークモード設定を保存
 */
export function saveDarkMode(isDark) {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark);
  } catch (e) {
    console.error('saveDarkMode error', e);
  }
}

/**
 * ダークモード設定を読み込み
 */
export function loadDarkMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return stored === 'true';
  } catch (e) {
    console.error('loadDarkMode error', e);
    return false;
  }
}

/**
 * URLが有効か検証
 */
export function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
