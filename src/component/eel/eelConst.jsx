// src/component/eel/eelConst.jsx

import { getConfig } from './eel.jsx';

export const WEB_SOCKET = () => getConfig().WEB_SOCKET;
export const TITLE = () => getConfig().TITLE;
export const CHART_TYPE = () => getConfig().CHART_TYPE;
export const KEY_WORD = () => getConfig().KEY_WORD;
export const SUBSCRIBE = () => getConfig().SUBSCRIBE;
export const FAILED = () => getConfig().FAILED;
export const SUCCESS = () => getConfig().SUCCESS;

