// Jest manual mock for the ESM-only `file-type` package (v21+).
// `file-type` ships ESM with no CommonJS `require` export condition, so the
// default Jest resolver cannot load it. This manual mock (auto-used for
// node_modules packages) lets specs import modules that transitively pull in
// `file-type` (e.g. common/uploads/upload.util.ts, vendor-kyc upload utils).
module.exports = {
  fileTypeFromFile: jest.fn(),
  fileTypeFromBuffer: jest.fn(),
  fileTypeStream: jest.fn(),
};
