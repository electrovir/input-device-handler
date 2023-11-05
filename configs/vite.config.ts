import {join} from 'path';
import {defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';

export default defineConfig({forGitHubPages: true}, (baseConfig, basePaths) => {
    return {
        ...baseConfig,
        build: {
            ...baseConfig.build,
            outDir: join(basePaths.cwd, 'dist-build'),
        },
    };
});
