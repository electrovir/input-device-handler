import {join} from 'path';
import {currentDir, defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';

export default defineConfig({forGitHubPages: true}, (baseConfig) => {
    return {
        ...baseConfig,
        build: {
            ...baseConfig.build,
            outDir: join(currentDir, 'build-dist'),
        },
    };
});
