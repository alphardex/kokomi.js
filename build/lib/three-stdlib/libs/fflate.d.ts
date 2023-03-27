/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/
/**
 * Streaming DEFLATE compression
 */
declare var Deflate: (opts: any, cb: any) => void;
export { Deflate };
/**
 * Asynchronous streaming DEFLATE compression
 */
declare var AsyncDeflate: (opts: any, cb: any) => void;
export { AsyncDeflate };
export declare function deflate(data: any, opts: any, cb: any): () => void;
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
export declare function deflateSync(data: any, opts: any): Uint8Array | Uint16Array | Uint32Array;
/**
 * Streaming DEFLATE decompression
 */
declare var Inflate: (cb: any) => void;
export { Inflate };
/**
 * Asynchronous streaming DEFLATE decompression
 */
declare var AsyncInflate: (cb: any) => void;
export { AsyncInflate };
export declare function inflate(data: any, opts: any, cb: any): () => void;
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export declare function inflateSync(data: any, out: any): any;
/**
 * Streaming GZIP compression
 */
declare var Gzip: (opts: any, cb: any) => void;
export { Gzip };
/**
 * Asynchronous streaming GZIP compression
 */
declare var AsyncGzip: (opts: any, cb: any) => void;
export { AsyncGzip };
export declare function gzip(data: any, opts: any, cb: any): () => void;
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
export declare function gzipSync(data: any, opts: any): Uint8Array | Uint16Array | Uint32Array;
/**
 * Streaming GZIP decompression
 */
declare var Gunzip: (cb: any) => void;
export { Gunzip };
/**
 * Asynchronous streaming GZIP decompression
 */
declare var AsyncGunzip: (cb: any) => void;
export { AsyncGunzip };
export declare function gunzip(data: any, opts: any, cb: any): () => void;
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
export declare function gunzipSync(data: any, out: any): any;
/**
 * Streaming Zlib compression
 */
declare var Zlib: (opts: any, cb: any) => void;
export { Zlib };
/**
 * Asynchronous streaming Zlib compression
 */
declare var AsyncZlib: (opts: any, cb: any) => void;
export { AsyncZlib };
export declare function zlib(data: any, opts: any, cb: any): () => void;
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
export declare function zlibSync(data: any, opts: any): Uint8Array | Uint16Array | Uint32Array;
/**
 * Streaming Zlib decompression
 */
declare var Unzlib: (cb: any) => void;
export { Unzlib };
/**
 * Asynchronous streaming Zlib decompression
 */
declare var AsyncUnzlib: (cb: any) => void;
export { AsyncUnzlib };
export declare function unzlib(data: any, opts: any, cb: any): () => void;
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export declare function unzlibSync(data: any, out: any): any;
export { gzip as compress, AsyncGzip as AsyncCompress };
export { gzipSync as compressSync, Gzip as Compress };
/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
declare var Decompress: (cb: any) => void;
export { Decompress };
/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
declare var AsyncDecompress: (cb: any) => void;
export { AsyncDecompress };
export declare function decompress(data: any, opts: any, cb: any): () => void;
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export declare function decompressSync(data: any, out: any): any;
/**
 * Streaming UTF-8 decoding
 */
declare var DecodeUTF8: (cb: any) => void;
export { DecodeUTF8 };
/**
 * Streaming UTF-8 encoding
 */
declare var EncodeUTF8: (cb: any) => void;
export { EncodeUTF8 };
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
export declare function strToU8(str: any, latin1: any): Uint8Array | Uint16Array | Uint32Array;
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
export declare function strFromU8(dat: any, latin1: any): string | Uint8Array | Uint16Array | Uint32Array;
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */
declare var ZipPassThrough: (filename: any) => void;
export { ZipPassThrough };
/**
 * Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
 * for better performance
 */
declare var ZipDeflate: (filename: any, opts: any) => void;
export { ZipDeflate };
/**
 * Asynchronous streaming DEFLATE compression for ZIP archives
 */
declare var AsyncZipDeflate: (filename: any, opts: any) => void;
export { AsyncZipDeflate };
/**
 * A zippable archive to which files can incrementally be added
 */
declare var Zip: (cb: any) => void;
export { Zip };
export declare function zip(data: any, opts: any, cb: any): () => void;
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
export declare function zipSync(data: any, opts: any): Uint8Array;
/**
 * Streaming pass-through decompression for ZIP archives
 */
declare var UnzipPassThrough: {
    (): void;
    compression: number;
};
export { UnzipPassThrough };
/**
 * Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
 * better performance.
 */
declare var UnzipInflate: {
    (): void;
    compression: number;
};
export { UnzipInflate };
/**
 * Asynchronous streaming DEFLATE decompression for ZIP archives
 */
declare var AsyncUnzipInflate: {
    (_: any, sz: any): void;
    compression: number;
};
export { AsyncUnzipInflate };
/**
 * A ZIP archive decompression stream that emits files as they are discovered
 */
declare var Unzip: (cb: any) => void;
export { Unzip };
/**
 * Asynchronously decompresses a ZIP archive
 * @param data The raw compressed ZIP file
 * @param cb The callback to call with the decompressed files
 * @returns A function that can be used to immediately terminate the unzipping
 */
export declare function unzip(data: any, cb: any): (() => void) | undefined;
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @returns The decompressed files
 */
export declare function unzipSync(data: any): {};
