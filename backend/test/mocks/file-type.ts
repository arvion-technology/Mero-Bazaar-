// Test-only stub so Jest doesn't need to load the ESM-only 'file-type' package
export const fileTypeFromFile = async (_path?: string) => ({ ext: 'jpg', mime: 'image/jpeg' });
export const fileTypeFromBuffer = async (_buf?: unknown) => ({ ext: 'jpg', mime: 'image/jpeg' });
export const fileTypeFromStream = async (_stream?: unknown) => ({ ext: 'jpg', mime: 'image/jpeg' });