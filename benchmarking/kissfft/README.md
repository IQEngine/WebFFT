# Setting up emscripten toolchain

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
 ```

## Building the module

```bash
cd emsdk
source ./emsdk_env.sh
cd benchmarking/kissfftmarc
make
mv KissFFT.wasm ../KissFFT.wasm
serve -l 8080
```
