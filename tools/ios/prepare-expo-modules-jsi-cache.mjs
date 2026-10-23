import { execFile } from 'node:child_process';
import { lstat, mkdir, readdir, readlink, rename, symlink, unlink } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const repositoryRoot = path.resolve(import.meta.dirname, '..', '..');
const packageStore = path.join(repositoryRoot, 'node_modules', '.pnpm');
const packageDirectories = (await readdir(packageStore)).filter((name) =>
  name.startsWith('expo-modules-jsi@'),
);
if (packageDirectories.length !== 1) {
  throw new Error(
    `Expected one installed expo-modules-jsi package, found ${packageDirectories.length}`,
  );
}
const packageDirectory = packageDirectories[0];
if (!packageDirectory) throw new Error('expo-modules-jsi package directory is missing');
const productsPath = path.join(
  packageStore,
  packageDirectory,
  'node_modules',
  'expo-modules-jsi',
  'apple',
  'Products',
);
const backupPath = `${productsPath}.fileprovider-backup`;
const cacheRoot = process.env.EXPO_CUSTOM_BUILD_ROOT ?? '/private/tmp/playlexi-expo-jsi';
const cacheProductsPath = path.join(cacheRoot, 'Products');
const frameworkName = 'ExpoModulesJSI.xcframework';
const frameworkPath = path.join(productsPath, frameworkName);
const cacheFrameworkPath = path.join(cacheProductsPath, frameworkName);
const createStubScript = path.join(
  packageStore,
  packageDirectory,
  'node_modules',
  'expo-modules-jsi',
  'apple',
  'scripts',
  'create-stub-xcframework.sh',
);

async function statOrUndefined(targetPath) {
  try {
    return await lstat(targetPath);
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined;
    throw error;
  }
}

await mkdir(cacheProductsPath, { recursive: true });

const productsStat = await statOrUndefined(productsPath);
if (productsStat?.isSymbolicLink()) {
  const currentTarget = path.resolve(path.dirname(productsPath), await readlink(productsPath));
  if (currentTarget !== cacheProductsPath) {
    throw new Error(`Unexpected Products symlink target: ${currentTarget}`);
  }
  await unlink(productsPath);
  await mkdir(productsPath);
} else if (productsStat?.isDirectory()) {
  const frameworkStat = await statOrUndefined(frameworkPath);
  if (frameworkStat?.isSymbolicLink()) {
    const currentTarget = path.resolve(
      path.dirname(frameworkPath),
      await readlink(frameworkPath),
    );
    if (currentTarget !== cacheFrameworkPath) {
      throw new Error(`Unexpected ExpoModulesJSI framework symlink target: ${currentTarget}`);
    }
  } else if (frameworkStat) {
    if (await statOrUndefined(backupPath)) {
      throw new Error(
        `Products and its backup both contain generated data. Resolve them manually: ${productsPath}`,
      );
    }
    await rename(productsPath, backupPath);
    await mkdir(productsPath);
  }
} else {
  await mkdir(productsPath);
}

if (!(await statOrUndefined(frameworkPath))) {
  await symlink(cacheFrameworkPath, frameworkPath, 'dir');
}

await execFileAsync('/bin/bash', [createStubScript], {
  env: { ...process.env, EXPO_CUSTOM_BUILD_ROOT: cacheRoot },
});

console.log(`ExpoModulesJSI framework cache: ${cacheFrameworkPath}`);
