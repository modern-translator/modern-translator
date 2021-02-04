/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';
import getLocale from '../../../helpers/get-locale';

import EnhancedMenu from '../../shared/enhanced-menu';

import { toggleSetting } from '../../../state/root/preferences/actions';
import { open as openDialogAbout } from '../../../state/root/dialog-about/actions';
import { open as openDialogShortcut } from '../../../state/pages/preferences/shortcut-dialog/actions';

import DialogShortcut from './dialog-shortcut';

import {
  requestOpenInBrowser,
  requestResetPreferences,
  requestSetPreference,
  requestSetSystemPreference,
  requestShowRequireRestartDialog,
  getDisplayLanguages,
} from '../../../senders';

const styles = (theme) => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    boxSizing: 'border-box',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  paperTitle: {
    width: '100%',
    maxWidth: 480,
    margin: '0 auto',
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginBottom: 2,
    paddingLeft: 16,
    fontSize: '0.9rem',
    '&:not(:first-child)': {
      marginTop: 36,
    },
  },
  paper: {
    maxWidth: 480,
    margin: '0 auto',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  shortcutKey: {
    lineHeight: '48px',
    padding: '0 16px',
    fontSize: 15,
    color: theme.palette.text.secondary,
  },
  appBarColorDefault: {
    background: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.primary.main,
    color: theme.palette.type === 'dark' ? theme.palette.getContrastText(theme.palette.grey[900]) : theme.palette.primary.contrastText,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  toolbar: {
    minHeight: 40,
    paddingRight: theme.spacing(1.5),
    paddingLeft: theme.spacing(1.5),
  },
  copyright: {
    color: theme.palette.text.disabled,
    fontWeight: 400,
    fontSize: '0.8rem',
    marginTop: theme.spacing(0.5),
    width: '100%',
    maxWidth: 480,
    margin: '0 auto',
  },
  listItemPromotion: {
    paddingLeft: theme.spacing(1),
  },
  promotionBlock: {
    display: 'flex',
    flex: 1,
  },
  promotionLeft: {
    height: 64,
    width: 64,
  },
  promotionRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.5),
  },
  appTitle: {},
  appIcon: {
    height: 64,
  },
});

const renderCombinator = (combinator) => combinator
  .replace(/\+/g, ' + ')
  .replace('alt', window.process.platform !== 'darwin' ? 'alt' : '⌥')
  .replace('shift', window.process.platform !== 'darwin' ? 'shift' : '⇧')
  .replace('mod', window.process.platform !== 'darwin' ? 'ctrl' : '⌘')
  .replace('meta', '⌘')
  .toUpperCase();

const getOpenAtLoginString = (openAtLogin) => {
  if (openAtLogin === 'yes-hidden') return getLocale('yesHidden');
  if (openAtLogin === 'yes') return getLocale('yes');
  return getLocale('no2');
};

const Preferences = (props) => {
  const {
    alwaysOnTop,
    attachToMenubar,
    classes,
    displayLanguage,
    onOpenDialogAbout,
    onOpenDialogShortcut,
    onToggleSetting,
    openAtLogin,
    openOnMenubarShortcut,
    sentry,
    showTransliteration,
    telemetry,
    themeSource,
    translateClipboardOnShortcut,
    translateWhenPressingEnter,
    useHardwareAcceleration,
  } = props;

  const displayLanguages = getDisplayLanguages();

  return (
    <div className={classes.container}>
      <DialogShortcut />
      <AppBar position="static" color="default" elevation={1} classes={{ colorDefault: classes.appBarColorDefault }}>
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography variant="subtitle1" color="inherit" className={classes.title}>{getLocale('preferences')}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.innerContainer}>
        <Typography variant="body2" className={classes.paperTitle}>
          {getLocale('general')}
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List dense disablePadding>
            <EnhancedMenu
              id="displayLanguage"
              buttonElement={(
                <ListItem button>
                  <ListItemText primary={getLocale('displayLanguage')} secondary={displayLanguages[displayLanguage].displayName} />
                  <ChevronRightIcon color="action" />
                </ListItem>
              )}
            >
              {Object.keys(displayLanguages).map((langCode) => (
                <MenuItem
                  key={langCode}
                  dense
                  onClick={() => {
                    requestSetPreference('displayLanguage', langCode);
                    requestShowRequireRestartDialog();
                  }}
                >
                  {displayLanguages[langCode].displayName}
                </MenuItem>
              ))}
            </EnhancedMenu>
            <Divider />
            <EnhancedMenu
              id="theme"
              buttonElement={(
                <ListItem button>
                  <ListItemText primary={getLocale('theme')} secondary={getLocale(themeSource)} />
                  <ChevronRightIcon color="action" />
                </ListItem>
              )}
            >
              <MenuItem dense onClick={() => requestSetPreference('themeSource', 'system')}>{getLocale('system')}</MenuItem>
              <MenuItem dense onClick={() => requestSetPreference('themeSource', 'light')}>{getLocale('light')}</MenuItem>
              <MenuItem dense onClick={() => requestSetPreference('themeSource', 'dark')}>{getLocale('dark')}</MenuItem>
            </EnhancedMenu>
            <Divider />
            <ListItem>
              <ListItemText primary={getLocale('showTransliteration')} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={showTransliteration}
                  onChange={() => onToggleSetting('showTransliteration')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary={getLocale('translateWhenPressingEnter')} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={translateWhenPressingEnter}
                  onChange={() => onToggleSetting('translateWhenPressingEnter')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="body2" className={classes.paperTitle}>
          {getLocale(window.process.platform === 'win32' ? 'taskbar' : 'menubar')}
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List dense disablePadding>
            <ListItem>
              <ListItemText primary={window.process.platform === 'win32' ? getLocale('attachToTaskbar') : getLocale('attachToMenubar')} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={attachToMenubar}
                  onChange={(e) => {
                    requestSetPreference('attachToMenubar', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem
              button
              key="openOnMenubar"
              onClick={() => onOpenDialogShortcut('openOnMenubar', openOnMenubarShortcut)}
              disabled={!attachToMenubar}
            >
              <ListItemText
                primary={getLocale('openKeyboardShortcut')}
                secondary={openOnMenubarShortcut
                  ? renderCombinator(openOnMenubarShortcut) : null}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={getLocale('translateClipboardOnShortcut')}
                secondary={getLocale('translateClipboardOnShortcutDesc')}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={attachToMenubar ? translateClipboardOnShortcut : false}
                  onChange={() => onToggleSetting('translateClipboardOnShortcut')}
                  color="primary"
                  disabled={!attachToMenubar}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={getLocale('alwaysOnTop')}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={attachToMenubar ? alwaysOnTop : false}
                  onChange={(e) => {
                    requestSetPreference('alwaysOnTop', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                  color="primary"
                  disabled={!attachToMenubar}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="body2" className={classes.paperTitle}>
          {getLocale('advanced')}
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List dense disablePadding>
            {window.process.platform === 'darwin' && (
              <>
                <ListItem
                  button
                  onClick={() => window.remote.shell.openExternal('https://translatium.app/popclip')}
                >
                  <ListItemText primary={getLocale('popclipExtension')} />
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
              </>
            )}
            {window.process.platform !== 'linux' && (
              <>
                <EnhancedMenu
                  id="openAtLogin"
                  buttonElement={(
                    <ListItem button>
                      <ListItemText primary={getLocale('openAtLogin')} secondary={getOpenAtLoginString(openAtLogin)} />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                  )}
                >
                  <MenuItem dense onClick={() => requestSetSystemPreference('openAtLogin', 'yes')}>{getLocale('yes')}</MenuItem>
                  {!window.process.mas && <MenuItem dense onClick={() => requestSetSystemPreference('openAtLogin', 'yes-hidden')}>{getLocale('yesHidden')}</MenuItem>}
                  <MenuItem dense onClick={() => requestSetSystemPreference('openAtLogin', 'no')}>{getLocale('no2')}</MenuItem>
                </EnhancedMenu>
                <Divider />
              </>
            )}
            <ListItem>
              <ListItemText
                primary={getLocale('useHardwareAcceleration')}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={useHardwareAcceleration}
                  onChange={(e) => {
                    requestSetPreference('useHardwareAcceleration', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={getLocale('allowCrashReports')}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={sentry}
                  onChange={(e) => {
                    requestSetPreference('sentry', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={getLocale('allowTelemetry')}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={telemetry}
                  onChange={(e) => {
                    requestSetPreference('telemetry', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" color="textPrimary" className={classes.paperTitle}>
          {getLocale('reset')}
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={requestResetPreferences}>
              <ListItemText primary={getLocale('restorePreferencesToDefault')} />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="body2" className={classes.paperTitle} />
        <Paper elevation={0} className={classes.paper}>
          <List dense disablePadding>
            <ListItem button>
              <ListItemText primary={getLocale('about')} onClick={onOpenDialogAbout} />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary={getLocale('website')} onClick={() => requestOpenInBrowser('https://translatium.app?utm_source=translatium_app')} />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary={getLocale('support')} onClick={() => requestOpenInBrowser('https://translatium.app/support?utm_source=translatium_app')} />
            </ListItem>
            {window.process.mas && (
              <>
                <Divider />
                <ListItem button>
                  <ListItemText primary={getLocale('rateMacAppStore')} onClick={() => requestOpenInBrowser('macappstore://apps.apple.com/app/id1547052291?action=write-review')} />
                </ListItem>
              </>
            )}
            {window.process.windowsStore && (
              <>
                <Divider />
                <ListItem button>
                  <ListItemText primary={getLocale('rateMicrosoftStore')} onClick={() => requestOpenInBrowser('ms-windows-store://review/?ProductId=9wzdncrcsg9k')} />
                </ListItem>
              </>
            )}
            <Divider />
            <ListItem button>
              <ListItemText primary={getLocale('quit')} onClick={() => window.remote.app.quit()} />
            </ListItem>
          </List>
        </Paper>
        <Typography
          variant="body2"
          align="right"
          className={classes.copyright}
        >
          Powered by Google Translate
        </Typography>
      </div>
    </div>
  );
};

Preferences.defaultProps = {
  openOnMenubarShortcut: null,
};

Preferences.propTypes = {
  alwaysOnTop: PropTypes.bool.isRequired,
  attachToMenubar: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  displayLanguage: PropTypes.string.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogShortcut: PropTypes.func.isRequired,
  onToggleSetting: PropTypes.func.isRequired,
  openAtLogin: PropTypes.oneOf(['yes', 'yes-hidden', 'no']).isRequired,
  openOnMenubarShortcut: PropTypes.string,
  sentry: PropTypes.bool.isRequired,
  showTransliteration: PropTypes.bool.isRequired,
  telemetry: PropTypes.bool.isRequired,
  themeSource: PropTypes.string.isRequired,
  translateClipboardOnShortcut: PropTypes.bool.isRequired,
  translateWhenPressingEnter: PropTypes.bool.isRequired,
  useHardwareAcceleration: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  alwaysOnTop: state.preferences.alwaysOnTop,
  attachToMenubar: state.preferences.attachToMenubar,
  displayLanguage: state.preferences.displayLanguage,
  openAtLogin: state.systemPreferences.openAtLogin,
  openOnMenubarShortcut: state.preferences.openOnMenubarShortcut,
  sentry: state.preferences.sentry,
  showTransliteration: state.preferences.showTransliteration,
  telemetry: state.preferences.telemetry,
  themeSource: state.preferences.themeSource,
  translateClipboardOnShortcut: state.preferences.translateClipboardOnShortcut,
  translateWhenPressingEnter: state.preferences.translateWhenPressingEnter,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
});

const actionCreators = {
  openDialogAbout,
  openDialogShortcut,
  toggleSetting,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
