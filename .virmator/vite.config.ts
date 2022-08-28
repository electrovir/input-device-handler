import {UserConfig} from 'vite';
import baseConfig from './vite-base';

const viteConfig: UserConfig = {
    ...baseConfig,
    base: process.env.GITHUB_ACTIONS ? '/input-device-handler/' : '',
};

export default viteConfig;
