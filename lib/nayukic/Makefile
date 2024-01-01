
NayukiCFFT.js:	fft.c fft.h
	emcc -O3 -I. \
	     --memory-init-file 0 \
	     -s PRECISE_F32=1 \
	 	 -s ENVIRONMENT='web'  \
		 -s USE_ES6_IMPORT_META=0  \
		 -s MODULARIZE=1 \
		 -s BINARYEN_ASYNC_COMPILATION=1 \
		 -s SINGLE_FILE=1 \
	     -s EXPORT_NAME="'NayukiCModule'" \
	     -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_transform_radix2_precalc','_precalc','_dispose','_transform_radix2_precalc_f','_precalc_f','_dispose_f']" \
		 -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	     -o NayukiCFFT.js \
	     fft.c

clean:
	rm -f NayukiCFFT.js

