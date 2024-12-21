const fs = require('fs-extra');
const path = require('path');

const files = [
    'index.html',
    'styles.css',
    'js',
    'res'
];

const platforms = [
    'win',
    'linux',
    'macos'
];

async function copyAssets() {
    try {
        // Create dist directory if it doesn't exist
        await fs.ensureDir('dist');

        // For each platform
        for (const platform of platforms) {
            const platformDir = path.join('dist', platform);
            await fs.ensureDir(platformDir);

            // Copy each file/directory
            for (const file of files) {
                const src = path.join(__dirname, '..', file);
                const dest = path.join(platformDir, file);
                
                if (await fs.pathExists(src)) {
                    await fs.copy(src, dest);
                    console.log(`Copied ${file} to ${platform} build`);
                } else {
                    console.warn(`Warning: ${file} not found`);
                }
            }

            // Move the executable to its platform directory
            const exeName = platform === 'win' ? 'no-safe-nook-win.exe' :
                           platform === 'macos' ? 'no-safe-nook-macos' :
                           'no-safe-nook-linux';
            
            const exeSrc = path.join('dist', exeName);
            const exeDest = path.join(platformDir, exeName);
            
            if (await fs.pathExists(exeSrc)) {
                await fs.move(exeSrc, exeDest, { overwrite: true });
                console.log(`Moved executable to ${platform} directory`);
            }
        }

        console.log('Post-build process completed successfully!');
    } catch (err) {
        console.error('Error during post-build:', err);
        process.exit(1);
    }
}

copyAssets(); 