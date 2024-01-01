KissFFT.js: kiss_fft.c kiss_fft.h
	emcc --no-entry kiss_fft.c -o KissFFT.mjs  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='KissFFTModule'  \
	  -s MODULARIZE=1 \
	  -s BINARYEN_ASYNC_COMPILATION=1 \
	  -s SINGLE_FILE=1 \
	  -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_kiss_fft_alloc", "_kiss_fft", "_kiss_fft_free"]' \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -O3


.PHONY: clean
clean:
	rm KissFFT.mjs