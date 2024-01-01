all: KissFFT KissFFTModified NayukiCFFT Cross

KissFFT: kissfft/kiss_fft.c kissfft/kiss_fft.h
	emcc --no-entry kissfft/kiss_fft.c -o kissfft/KissFFT.mjs  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='KissFFTModule'  \
	  -s MODULARIZE=1 \
	  -s BINARYEN_ASYNC_COMPILATION=0 \
	  -s SINGLE_FILE=1 \
	  -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_kiss_fft_alloc", "_kiss_fft", "_kiss_fft_free"]' \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -O3

KissFFTModified: kissfftmodified/kiss_fft.c kissfftmodified/kiss_fft.h
	emcc --no-entry kissfftmodified/kiss_fft.c -o kissfftmodified/KissFFT.mjs  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='KissFFTModule'  \
	  -s MODULARIZE=1 \
	  -s BINARYEN_ASYNC_COMPILATION=0 \
	  -s SINGLE_FILE=1 \
	  -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_kiss_fft_alloc", "_kiss_fft", "_kiss_fft_free"]' \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -O3

NayukiCFFT:	nayukic/fft.c nayukic/fft.h
	emcc --no-entry nayukic/fft.c -o nayukic/NayukiCFFT.mjs \
	 	 -s ENVIRONMENT='web'  \
		 -s MODULARIZE=1 \
		 -s BINARYEN_ASYNC_COMPILATION=0 \
		 -s SINGLE_FILE=1 \
	     -s EXPORT_NAME="'NayukiCModule'" \
	     -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_transform_radix2_precalc','_precalc','_dispose','_transform_radix2_precalc_f','_precalc_f','_dispose_f']" \
		 -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
		 -O3

Cross:	cross/Cross.c cross/Cross.h
	emcc --no-entry cross/Cross.c -o cross/Cross.mjs -s ENVIRONMENT='web' -s EXPORT_NAME='CrossModule' -s MODULARIZE=1 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_fftCross"]' -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -O3


.PHONY: clean
clean:
	rm kissfft/KissFFT.mjs
	rm kissfftmodified/KissFFT.mjs
	rm nayukic/NayukiCFFT.mjs
	rm cross/Cross.mjs
