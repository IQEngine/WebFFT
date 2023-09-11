KissFFT.wasm: KissFFT.js
KissFFT.js: kiss_fft.c kiss_fft.h
	emcc --no-entry kiss_fft.c -o KissFFT.js  \
	  --pre-js locateFile.js  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='KissFFTModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s MODULARIZE=1 \
	  -s BINARYEN_ASYNC_COMPILATION=0 \
	  -s SINGLE_FILE=1 \
	  -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_kiss_fft_alloc", "_kiss_fft", "_kiss_fft_free"]' \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -O3


.PHONY: clean
clean:
	rm matrixMultiply.wasm matrixMultiply.js