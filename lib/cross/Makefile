
Cross.js:	Cross.c Cross.h
	emcc --no-entry Cross.c -o Cross.js -s ENVIRONMENT='web' -s EXPORT_NAME='CrossModule' -s USE_ES6_IMPORT_META=0 -s MODULARIZE=1 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS='["_malloc", "_free", "_fftCross"]' -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -O3

clean:
	rm -f Cross.js
