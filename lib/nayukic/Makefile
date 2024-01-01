NayukiCFFT.js:	fft.c fft.h
	emcc --no-entry fft.c -o NayukiCFFT.mjs \
	 	 -s ENVIRONMENT='web'  \
		 -s MODULARIZE=1 \
		 -s BINARYEN_ASYNC_COMPILATION=1 \
		 -s SINGLE_FILE=1 \
	     -s EXPORT_NAME="'NayukiCModule'" \
	     -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_transform_radix2_precalc','_precalc','_dispose','_transform_radix2_precalc_f','_precalc_f','_dispose_f']" \
		 -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
		 -O3

clean:
	rm -f NayukiCFFT.mjs

