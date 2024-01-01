Cross.js:	Cross.c Cross.h
	emcc --no-entry Cross.c -o Cross.mjs -s ENVIRONMENT='web' -s EXPORT_NAME='CrossModule' -s MODULARIZE=1 -s BINARYEN_ASYNC_COMPILATION=1 -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_fftCross"]' -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -O3

clean:
	rm -f Cross.mjs
