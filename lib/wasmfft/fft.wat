;; Copyright (C) 2022 Jeppe Johansen - jeppe@j-software.dk
(module
    
    (import "Math" "cos" (func $cos (param f32) (result f32)))
    (import "Math" "sin" (func $sin (param f32) (result f32)))
    (import "Math" "ceil" (func $ceil (param f32) (result i32)))
    (import "Math" "log2" (func $log2 (param f32) (result f32)))

    (import "config" "points" (global $points i32))
    (import "config" "inputType" (global $inputType i32))
    (import "config" "outputType" (global $outputType i32))
    (import "config" "shift" (global $shift i32))
    (import "config" "scale" (global $scale f32))

    (memory (export "memory") 1)

    (global $memoryOffset (mut i32) (i32.const 0))

    (global $fftBits        (mut i32) (i32.const 0))

    (global $outBufferR     (mut i32) (i32.const 0))
    (global $workBufferR    (mut i32) (i32.const 0))
    (global $workBufferI    (mut i32) (i32.const 0))
    (global $inBuffer       (mut i32) (i32.const 0))
    (global $briOffset      (mut i32) (i32.const 0))
    (global $twiddleBanks   (mut i32) (i32.const 0))
    (global $twiddleFactorsOffsetsR (mut i32) (i32.const 0))
    (global $twiddleFactorsOffsetsI (mut i32) (i32.const 0))

    (global $schedule (mut i32) (i32.const 0))
    (global $scheduleCount (mut i32) (i32.const 0))

    (type $layerFunc (func (param i32)))

    (func $allocateBuffer (param $size i32) (param $alignment i32) (result i32)

        (local $offset i32)

        global.get      $memoryOffset
        local.get       $alignment
        i32.const       1
        i32.sub
        i32.add
        local.tee       $offset

        local.get       $alignment
        i32.const       1
        i32.sub
        i32.const       0xFFFFFFFF
        i32.xor
        i32.and
        local.tee       $offset

        local.get       $size
        i32.add
        global.set      $memoryOffset

        ;; Check if area goes outside current memory size
        global.get      $memoryOffset
        memory.size
        i32.const       65536
        i32.mul
        i32.gt_u

        (if
            (then
                global.get      $memoryOffset
                memory.size
                i32.const       65536
                i32.mul
                i32.sub
                i32.const       65535
                i32.add
                i32.const       16
                i32.shr_u

                memory.grow
                drop
            )
        )

        local.get       $offset
    )

    (func $magSqrSIMD (param $tmpArg i32)

        (local $_points i32)
        (local $bufR i32)
        (local $outR i32)
        (local $bufI i32)
        (local $i    i32)
        (local $tmp  v128)

        (local $outMask     i32)
        (local $outOffset   i32)

        global.get      $points
        local.set       $_points

        global.get      $workBufferR
        local.set       $bufR
        global.get      $workBufferI
        local.set       $bufI
        global.get      $outBufferR
        local.set       $outR
        
        i32.const       0
        local.set       $i

        local.get       $_points
        i32.const       4
        i32.mul
        i32.const       1
        i32.sub
        local.set       $outMask

        global.get      $shift
        (if
            (then
                local.get       $_points
                i32.const       2
                i32.mul
                local.set       $outOffset
            )
            (else
                i32.const       0
                local.set       $outOffset
            )
        )

        (loop $inner_loop

            local.get       $outR
            local.get       $outOffset
            i32.add

            local.get       $bufR
            v128.load
            local.tee       $tmp
            local.get       $tmp
            f32x4.mul

            local.get       $bufI
            v128.load
            local.tee       $tmp
            local.get       $tmp
            f32x4.mul

            f32x4.add
            v128.store

            ;; Done
            local.get       $outOffset
            i32.const       16
            i32.add
            local.get       $outMask
            i32.and
            local.set       $outOffset

            local.get       $bufR
            i32.const       16
            i32.add
            local.set       $bufR
            
            local.get       $bufI
            i32.const       16
            i32.add
            local.set       $bufI
            
            local.get       $i
            i32.const       4
            i32.add
            local.tee       $i
            local.get       $_points
            i32.lt_u
            br_if           $inner_loop
        )
    )

    (func $inputLayer0And1RealSIMD (param $tmpArg i32)
        (local $nb      i32)
        (local $idx     i32)
        (local $b0      i32)
        (local $b0End   i32)
        (local $outIdxR i32)
        (local $outIdxI i32)

        (local $x       v128)
        (local $xr      v128)
        (local $xi      v128)
        (local $yr      v128)
        (local $yi      v128)
        (local $tmp     v128)
        (local $scaling v128)

        ;; nb = self.points
        global.get      $points
        local.set       $nb

        ;; b0 = self.base(self.briIndices)
        global.get      $briOffset
        local.tee       $b0
        local.get       $nb
        i32.add
        local.set       $b0End

        ;; outIdxR = self.base(self.bufferReal)
        global.get      $workBufferR
        local.set       $outIdxR
        ;; outIdxI = self.base(self.bufferImag)
        global.get      $workBufferI
        local.set       $outIdxI

        ;; scaling = splat scale
        global.get      $scale
        f32x4.splat
        local.set       $scaling

        ;; for _ in range(0, self.points, 4):
        (loop $inner_loop
            ;; idx = self.i32_load(self.briIndices, b0)
            local.get       $b0
            i32.load
            local.set       $idx

            ;; self.v128_load32_zero(self.inbuffer, x, idx, 0)
            local.get       $idx
            v128.load32_zero
            local.set       $x
            ;; self.v128_load32_lane(self.inbuffer, x, idx+2*nb, 1)

            local.get       $idx
            local.get       $nb
            i32.const       2
            i32.mul
            i32.add
            local.get       $x
            v128.load32_lane    1
            local.set       $x
            ;; self.v128_load32_lane(self.inbuffer, x, idx+1*nb, 2)
            local.get       $idx
            local.get       $nb
            i32.add
            local.get       $x
            v128.load32_lane    2
            local.set       $x
            ;; self.v128_load32_lane(self.inbuffer, x, idx+3*nb, 3)
            local.get       $idx
            local.get       $nb
            i32.const       3
            i32.mul
            i32.add
            local.get       $x
            v128.load32_lane    3
            local.set       $x

            ;; yr = self.v128_select(x, x,[0,1,2,3, 0,1,2,3, 8,9,10,11, 8,9,10,11]) + self.v128_select(x,-x,[4,5,6,7, 20,21,22,23, 12,13,14,15, 28,29,30,31])
            local.get       $x
            local.get       $x
            i8x16.shuffle   0 1 2 3  0 1 2 3  8 9 10 11  8 9 10 11
            local.get       $x
            local.get       $x
            f32x4.neg
            i8x16.shuffle   4 5 6 7  20 21 22 23  12 13 14 15  28 29 30 31
            f32x4.add
            local.set       $yr

            ;; tmp = self.v128_select(yr,-yr,[8,9,10,11, 28,29,30,31, 24,25,26,27, 12,13,14,15])
            local.get       $yr
            local.get       $yr
            f32x4.neg
            i8x16.shuffle   8 9 10 11  28 29 30 31  24 25 26 27  12 13 14 15
            local.set       $tmp

            ;; xi = self.v128_and(tmp, np.array([0x0, 0xFFFFFFFF, 0x0, 0xFFFFFFFF], dtype=np.uint32))
            local.get       $tmp
            v128.const      i32x4 0x0 0xFFFFFFFF 0x0 0xFFFFFFFF
            v128.and
            local.set       $xi
            ;; xr = self.v128_select(yr,yr,[0,1,2,3, 4,5,6,7, 0,1,2,3, 4,5,6,7]) + self.v128_and(tmp, np.array([0xFFFFFFFF, 0x0, 0xFFFFFFFF, 0x0], dtype=np.uint32))
            local.get       $yr
            local.get       $yr
            i8x16.shuffle   0 1 2 3  4 5 6 7  0 1 2 3  4 5 6 7
            local.get       $tmp
            v128.const      i32x4 0xFFFFFFFF 0x0 0xFFFFFFFF 0x0
            v128.and
            f32x4.add
            local.set       $xr

            ;; self.storeF32x4(self.bufferReal, outIdxR, xr)
            local.get       $outIdxR
            local.get       $xr
            local.get       $scaling
            f32x4.mul
            v128.store
            ;; self.storeF32x4(self.bufferImag, outIdxI, xi)
            local.get       $outIdxI
            local.get       $xi
            local.get       $scaling
            f32x4.mul
            v128.store

            ;; outIdxR += 16
            local.get       $outIdxR
            i32.const       16
            i32.add
            local.set       $outIdxR
            ;; outIdxI += 16
            local.get       $outIdxI
            i32.const       16
            i32.add
            local.set       $outIdxI
        
            ;; b0 += 4
            local.get       $b0
            i32.const       4
            i32.add
            local.tee       $b0
            ;; Loop end
            local.get       $b0End
            i32.lt_u
            br_if           $inner_loop
        )
    )

    (func $inputLayer0And1SIMD (param $tmpArg i32)

        (local  $i          i32)
        (local  $idx        i32)
        (local  $nb         i32)
        (local  $b0         i32)
        (local  $outIdxR    i32)
        (local  $outIdxI    i32)

        (local  $ri0s       v128)
        (local  $cris       v128)
        (local  $ri1s       v128)
        (local  $dris       v128)

        (local  $scaling    v128)

        (local  $rs         v128)
        (local  $is         v128)

        ;; nb = self.points * 2
        global.get      $points
        i32.const       2
        i32.mul
        local.set       $nb

        ;; let scaling = scale
        global.get      $scale
        f32x4.splat
        local.set       $scaling

        ;; b0 = self.base(self.briIndices)
        global.get      $briOffset
        local.set       $b0
        
        ;; outIdxR = self.base(self.bufferReal)
        global.get      $workBufferR
        local.set       $outIdxR
        ;; outIdxI = self.base(self.bufferImag)
        global.get      $workBufferI
        local.set       $outIdxI

        i32.const       0
        local.set       $i

        ;; for _ in range(0, nb, 8):
        (loop $inner_loop
            ;; idx = self.i32_load(self.briIndices, b0)
            local.get       $b0
            i32.load
            local.set       $idx

            ;; ri0s = self.loadF32x4_64bit(self.inbuffer, idx)
            local.get       $idx
            v128.load64_zero
            local.set       $ri0s

            ;; cris = self.loadF32x4_64bit(self.inbuffer, idx)
            local.get       $idx
            local.get       $nb
            i32.add
            v128.load64_zero
            local.set       $cris

            ;; ri1s = self.loadF32x4_64bit(self.inbuffer, idx)
            local.get       $idx
            local.get       $nb
            i32.const       2
            i32.mul
            i32.add
            v128.load64_zero
            local.tee       $ri1s

            ;; dris = self.loadF32x4_64bit(self.inbuffer, idx)
            local.get       $idx
            local.get       $nb
            i32.const       3
            i32.mul
            i32.add
            v128.load64_zero
            local.tee       $dris

            ;; r1s = self.v128_select(ri1s, dris, [0,1,2,3, 0,1,2,3, 16,17,18,19, 20,21,22,23])
            ;; local.get       $ri1s
            ;; local.get       $dris
            i8x16.shuffle   0 1 2 3  0 1 2 3  16 17 18 19  20 21 22 23
            ;; r1s = self.v128_xor(r1s, np.array([0,0x80000000,0,0x80000000], dtype=np.uint32))
            v128.const      i32x4 0 0x80000000 0 0x80000000
            v128.xor
            ;; r0s = self.v128_select(ri0s, cris, [0,1,2,3, 0,1,2,3, 16,17,18,19, 20,21,22,23])
            local.get       $ri0s
            local.get       $cris
            i8x16.shuffle   0 1 2 3  0 1 2 3  16 17 18 19  20 21 22 23
            ;; rs = r0s + r1s
            f32x4.add
            local.set       $rs

            ;; i1s = self.v128_select(ri1s, dris, [4,5,6,7, 4,5,6,7, 20,21,22,23, 16,17,18,19])
            local.get       $ri1s
            local.get       $dris
            i8x16.shuffle   4 5 6 7  4 5 6 7  20 21 22 23  16 17 18 19
            ;; i1s = self.v128_xor(i1s, np.array([0,0x80000000,0,0x80000000], dtype=np.uint32))
            v128.const      i32x4 0 0x80000000 0 0x80000000
            v128.xor
            ;; i0s = self.v128_select(ri0s, cris, [4,5,6,7, 4,5,6,7, 20,21,22,23, 16,17,18,19])
            local.get       $ri0s
            local.get       $cris
            i8x16.shuffle   4 5 6 7  4 5 6 7  20 21 22 23  16 17 18 19
            ;; _is = i0s + i1s
            f32x4.add
            local.set       $is

            local.get       $outIdxR
            ;; xs = self.v128_swizzle(rs, [0,1,2,3, 4,5,6,7, 0,1,2,3, 4,5,6,7])
            local.get       $rs
            local.get       $rs
            i8x16.shuffle   0 1 2 3  4 5 6 7  0 1 2 3  4 5 6 7
            ;; ys = self.v128_swizzle(rs, [8,9,10,11, 12,13,14,15, 8,9,10,11, 12,13,14,15])
            local.get       $rs
            local.get       $rs
            i8x16.shuffle   8 9 10 11  12 13 14 15  8 9 10 11  12 13 14 15
            ;; ys = self.v128_xor(ys, np.array([0,0,0x80000000,0x80000000], dtype=np.uint32))
            v128.const      i32x4 0 0 0x80000000 0x80000000
            v128.xor
            ;; x = xs +ys
            f32x4.add
            ;; x *= scaling
            local.get       $scaling
            f32x4.mul
            ;; self.storeF32x4(self.bufferReal, outIdxR, x)
            v128.store

            local.get       $outIdxI

            ;; ixs = self.v128_swizzle(_is, [0,1,2,3, 4,5,6,7, 0,1,2,3, 4,5,6,7])
            local.get       $is
            local.get       $is
            i8x16.shuffle   0 1 2 3  4 5 6 7  0 1 2 3  4 5 6 7
            ;; iys = self.v128_swizzle(_is, [8,9,10,11, 12,13,14,15, 8,9,10,11, 12,13,14,15])
            local.get       $is
            local.get       $is
            i8x16.shuffle   8 9 10 11  12 13 14 15  8 9 10 11  12 13 14 15
            ;; iys = self.v128_xor(iys, np.array([0,0x80000000,0x80000000,0], dtype=np.uint32))
            v128.const      i32x4 0 0x80000000 0x80000000 0
            v128.xor
            ;; y = ixs+iys
            f32x4.add
            ;; y *= scaling
            local.get       $scaling
            f32x4.mul
            ;; self.storeF32x4(self.bufferImag, outIdxI, y)
            v128.store

            ;; b0 += 4
            local.get       $b0
            i32.const       4
            i32.add
            local.set       $b0
            ;; outIdxR += 16
            local.get       $outIdxR
            i32.const       16
            i32.add
            local.set       $outIdxR
            ;; outIdxI += 16
            local.get       $outIdxI
            i32.const       16
            i32.add
            local.set       $outIdxI

            local.get       $i
            i32.const       8
            i32.add
            local.tee       $i
            local.get       $nb
            i32.lt_u
            br_if           $inner_loop
        )
    )

    (func $layerRadix4SIMD (param $layer i32)

        (local $n           i32)
        (local $twBaseR     i32)

        (local $nb      i32)
        (local $i       i32)
        (local $pti     i32)

        (local $iiR0    i32)
        (local $iiI0    i32)
        (local $iBufR   i32)
        (local $iBufI   i32)
        (local $twR0    i32)

        (local $y0r     v128)
        (local $y0i     v128)
        (local $x1r     v128)
        (local $x1i     v128)
        (local $x2r     v128)
        (local $x2i     v128)
        (local $x3r     v128)
        (local $x3i     v128)

        (local $w1r     v128)
        (local $w2r     v128)
        (local $w3r     v128)
        (local $w1i     v128)
        (local $w2i     v128)
        (local $w3i     v128)

        (local $y1r     v128)
        (local $y1i     v128)
        (local $y2r     v128)
        (local $y2i     v128)
        (local $y3r     v128)
        (local $y3i     v128)
        
        (local $ar      v128)
        (local $cr      v128)
        (local $br      v128)
        (local $di      v128)
        (local $dr      v128)
        (local $bi      v128)
        (local $ai      v128)
        (local $ci      v128)

        i32.const       1
        local.get       $layer
        i32.shl
        local.set       $n

        ;; var bank = this.#twiddleBankIndices + layer * 8;
        global.get      $twiddleBanks
        local.get       $layer
        i32.const       3
        i32.shl
        i32.add

        ;; let twR = this.#floatMemory.getInt32(bankAddr, true);
        i32.load
        local.set       $twBaseR

        ;; nb = n*2
        local.get       $n
        i32.const       2
        i32.mul
        local.set       $nb

        ;; iiR0 = self.base(self.bufferReal)
        global.get      $workBufferR
        local.set       $iiR0
        ;; iiI0 = self.base(self.bufferImag)
        global.get      $workBufferI
        local.tee       $iiI0

        ;; pti = 0
        global.get      $points
        i32.const       4
        i32.mul
        i32.add
        local.set       $pti
        (loop $outer_loop
            ;; twR0 = twBaseR
            local.get       $twBaseR
            i32.const       96
            i32.sub
            local.set       $twR0

            ;; iBufR = iiR0
            local.get       $iiR0
            local.set       $iBufR
            ;; iBufI = iiI0
            local.get       $iiI0
            local.tee       $iBufI

            ;; i = 0
            local.get       $nb
            i32.add
            local.set       $i
            (loop $inner_loop
                ;; y0r = self.loadF32x4(self.bufferReal, iBufR)
                local.get       $iBufR
                v128.load
                local.set       $y0r
                ;; y0i = self.loadF32x4(self.bufferImag, iBufI)
                local.get       $iBufI
                v128.load
                local.set       $y0i
                ;; iBufR += nb
                local.get       $iBufR
                local.get       $nb
                i32.add
                ;; x1r = self.loadF32x4(self.bufferReal, iBufR)
                v128.load
                local.set       $x1r
                ;; iBufI += nb
                local.get       $iBufI
                local.get       $nb
                i32.add
                ;; x1i = self.loadF32x4(self.bufferImag, iBufI)
                v128.load
                local.set       $x1i
                ;; iBufR += nb
                local.get       $iBufR
                local.get       $nb
                i32.const       2
                i32.mul
                i32.add
                ;; x2r = self.loadF32x4(self.bufferReal, iBufR)
                v128.load
                local.set       $x2r
                ;; iBufI += nb
                local.get       $iBufI
                local.get       $nb
                i32.const       2
                i32.mul
                i32.add
                ;; x2i = self.loadF32x4(self.bufferImag, iBufI)
                v128.load
                local.set       $x2i

                ;; w1r = self.loadF32x4(twR, twR0+16)
                local.get       $twR0
                i32.const       128
                i32.add
                local.tee       $twR0
                v128.load
                local.set       $w1r
                ;; w1i = self.loadF32x4(twI, twI0+16)
                local.get       $twR0
                v128.load       offset=16
                local.set       $w1i

                ;; y2r = x2r * w1r - x2i * w1i
                local.get       $x2r
                local.get       $w1r
                f32x4.mul
                local.get       $x2i
                local.get       $w1i
                f32x4.mul
                f32x4.sub
                local.set       $y2r
                ;; y2i = x2r * w1i + x2i * w1r
                local.get       $x2r
                local.get       $w1i
                f32x4.mul
                local.get       $x2i
                local.get       $w1r
                f32x4.mul
                f32x4.add
                local.set       $y2i

                ;; w2r = self.loadF32x4(twR, twR0+32)
                local.get       $twR0
                v128.load       offset=32
                local.set       $w2r
                ;; w2i = self.loadF32x4(twI, twI0+32)
                local.get       $twR0
                v128.load       offset=48
                local.set       $w2i

                ;; y1r = x1r * w2r - x1i * w2i
                local.get       $x1r
                local.get       $w2r
                f32x4.mul
                local.get       $x1i
                local.get       $w2i
                f32x4.mul
                f32x4.sub
                local.set       $y1r
                ;; y1i = x1r * w2i + x1i * w2r
                local.get       $x1r
                local.get       $w2i
                f32x4.mul
                local.get       $x1i
                local.get       $w2r
                f32x4.mul
                f32x4.add
                local.set       $y1i

                ;; ar = y0r + y1r
                local.get       $y0r
                local.get       $y1r
                f32x4.add
                local.set       $ar
                ;; cr = y0r - y1r
                local.get       $y0r
                local.get       $y1r
                f32x4.sub
                local.set       $cr
                ;; ai = y0i + y1i
                local.get       $y0i
                local.get       $y1i
                f32x4.add
                local.set       $ai
                ;; ci = y0i - y1i
                local.get       $y0i
                local.get       $y1i
                f32x4.sub
                local.set       $ci

                ;; iBufR += nb
                local.get       $iBufR
                local.get       $nb
                i32.const       3
                i32.mul
                i32.add
                ;; x3r = self.loadF32x4(self.bufferReal, iBufR)
                v128.load
                local.set       $x3r
                ;; iBufI += nb
                local.get       $iBufI
                local.get       $nb
                i32.const       3
                i32.mul
                i32.add
                ;; x3i = self.loadF32x4(self.bufferImag, iBufI)
                v128.load
                local.set       $x3i

                ;; w3r = self.loadF32x4(twR, twR0+48)
                local.get       $twR0
                v128.load       offset=64
                local.set       $w3r
                ;; w3i = self.loadF32x4(twI, twI0+48)
                local.get       $twR0
                v128.load       offset=80
                local.set       $w3i

                ;; y3r = x3r * w3r - x3i * w3i
                local.get       $x3r
                local.get       $w3r
                f32x4.mul
                local.get       $x3i
                local.get       $w3i
                f32x4.mul
                f32x4.sub
                local.set       $y3r
                ;; y3i = x3r * w3i + x3i * w3r
                local.get       $x3r
                local.get       $w3i
                f32x4.mul
                local.get       $x3i
                local.get       $w3r
                f32x4.mul
                f32x4.add
                local.set       $y3i

                ;; br = y2r + y3r
                local.get       $y2r
                local.get       $y3r
                f32x4.add
                local.set       $br
                ;; di = y2r - y3r
                local.get       $y2r
                local.get       $y3r
                f32x4.sub
                local.set       $di
                ;; dr = y2i - y3i
                local.get       $y2i
                local.get       $y3i
                f32x4.sub
                local.set       $dr
                ;; bi = y2i + y3i
                local.get       $y2i
                local.get       $y3i
                f32x4.add
                local.set       $bi


                ;; z3r = cr - dr
                ;; self.storeF32x4(self.bufferReal, iBufR, z3r)
                local.get       $iBufR
                local.get       $nb
                i32.const       3
                i32.mul
                i32.add

                local.get       $cr
                local.get       $dr
                f32x4.sub

                v128.store
                ;; z3i = ci + di
                ;; self.storeF32x4(self.bufferImag, iBufI, z3i)
                local.get       $iBufI
                local.get       $nb
                i32.const       3
                i32.mul
                i32.add

                local.get       $ci
                local.get       $di
                f32x4.add

                v128.store

                local.get       $iBufI
                local.get       $nb
                i32.const       2
                i32.mul
                i32.add
                ;; z2i = ai - bi
                ;; self.storeF32x4(self.bufferImag, iBufI, z2i)
                local.get       $ai
                local.get       $bi
                f32x4.sub

                v128.store

                local.get       $iBufR
                local.get       $nb
                i32.const       2
                i32.mul
                i32.add
                ;; z2r = ar - br
                ;; self.storeF32x4(self.bufferReal, iBufR, z2r)
                local.get       $ar
                local.get       $br
                f32x4.sub

                v128.store

                local.get       $iBufR
                local.get       $nb
                i32.add
                ;; z1r = cr + dr
                ;; self.storeF32x4(self.bufferReal, iBufR, z1r)
                local.get       $cr
                local.get       $dr
                f32x4.add

                v128.store

                local.get       $iBufI
                local.get       $nb
                i32.add
                ;; z1i = ci - di
                ;; self.storeF32x4(self.bufferImag, iBufI, z1i)
                local.get       $ci
                local.get       $di
                f32x4.sub

                v128.store

                local.get       $iBufR
                ;; z0r = ar + br
                ;; self.storeF32x4(self.bufferReal, iBufR, z0r)
                local.get       $ar
                local.get       $br
                f32x4.add

                v128.store

                local.get       $iBufI
                ;; z0i = ai + bi
                ;; self.storeF32x4(self.bufferImag, iBufI, z0i)
                local.get       $ai
                local.get       $bi
                f32x4.add

                v128.store
                ;; iBufR += 16
                local.get       $iBufR
                i32.const       16
                i32.add
                local.set       $iBufR
                ;; iBufI += 16
                local.get       $iBufI
                i32.const       16
                i32.add
                local.tee       $iBufI

                ;; if $iBufI < $i:
                ;;     continue
                ;; break
                local.get       $i
                i32.lt_u
                br_if           $inner_loop
            )
 
            ;; iiR0 += 4*nb
            local.get       $iiR0
            local.get       $nb
            i32.const       2
            i32.shl
            i32.add
            local.set       $iiR0
            ;; iiI0 += 4*nb
            local.get       $iiI0
            local.get       $nb
            i32.const       2
            i32.shl
            i32.add
            local.tee       $iiI0
            ;; if iiI0 < pti
            ;;     continue
            ;; break
            local.get       $pti
            i32.lt_u
            br_if           $outer_loop
        )
    )

    (func $layer3Radix4SIMD (param $layer i32)

        (local $n       i32)

        (local $nb      i32)
        (local $i       i32)
        (local $pti     i32)

        (local $iiR0    i32)
        (local $iiI0    i32)
        (local $iBufR   i32)
        (local $iBufI   i32)

        (local $y0r     v128)
        (local $y0i     v128)
        (local $x1r     v128)
        (local $x1i     v128)
        (local $x2r     v128)
        (local $x2i     v128)
        (local $x3r     v128)
        (local $x3i     v128)

        (local $w1r     v128)
        (local $w2r     v128)
        (local $w3r     v128)
        (local $w1i     v128)
        (local $w2i     v128)
        (local $w3i     v128)

        (local $y1r     v128)
        (local $y1i     v128)
        (local $y2r     v128)
        (local $y2i     v128)
        (local $y3r     v128)
        (local $y3i     v128)
        
        (local $ar      v128)
        (local $cr      v128)
        (local $br      v128)
        (local $di      v128)
        (local $dr      v128)
        (local $bi      v128)
        (local $ai      v128)
        (local $ci      v128)

        i32.const       8
        local.set       $n

        ;; nb = n*2
        i32.const       16
        local.set       $nb

        ;; iiR0 = self.base(self.bufferReal)
        global.get      $workBufferR
        local.set       $iiR0
        ;; iiI0 = self.base(self.bufferImag)
        global.get      $workBufferI
        local.set       $iiI0

        ;; w1r = self.loadF32x4(twR, twR0+16)
        v128.const      f32x4 1.0 0.9238795  0.70710677 0.38268343
        local.set       $w1r
        ;; w1i = self.loadF32x4(twI, twI0+16)
        v128.const      f32x4 0.0 -0.38268343 -0.70710677 -0.9238795
        local.set       $w1i

        ;; w2r = self.loadF32x4(twR, twR0+32)
        v128.const      f32x4 1.0  0.70710677  0.0 -0.70710677
        local.set       $w2r
        ;; w2i = self.loadF32x4(twI, twI0+32)
        v128.const      f32x4 0.0 -0.70710677 -1.0 -0.70710677
        local.set       $w2i

        ;; w3r = self.loadF32x4(twR, twR0+48)
        v128.const      f32x4 1.0 0.38268343 -0.70710677 -0.9238795
        local.set       $w3r
        ;; w3i = self.loadF32x4(twI, twI0+48)
        v128.const      f32x4 0.0 -0.9238795  -0.70710677  0.38268343
        local.set       $w3i

        ;; pti = 0
        i32.const       0
        local.set       $pti

        (loop $outer_loop
            ;; iBufR = iiR0
            local.get       $iiR0
            local.set       $iBufR
            ;; iBufI = iiI0
            local.get       $iiI0
            local.set       $iBufI


            ;; y0r = self.loadF32x4(self.bufferReal, iBufR)
            local.get       $iBufR
            v128.load
            local.set       $y0r

            ;; y0i = self.loadF32x4(self.bufferImag, iBufI)
            local.get       $iBufI
            v128.load
            local.set       $y0i

            ;; x1r = self.loadF32x4(self.bufferReal, iBufR)
            local.get       $iBufR
            v128.load       offset=16
            local.set       $x1r

            ;; x1i = self.loadF32x4(self.bufferImag, iBufI)
            local.get       $iBufI
            v128.load       offset=16
            local.set       $x1i

            ;; x2r = self.loadF32x4(self.bufferReal, iBufR)
            local.get       $iBufR
            v128.load       offset=32
            local.set       $x2r
            
            ;; x2i = self.loadF32x4(self.bufferImag, iBufI)
            local.get       $iBufI
            v128.load       offset=32
            local.set       $x2i

            ;; y2r = x2r * w1r - x2i * w1i
            local.get       $x2r
            local.get       $w1r
            f32x4.mul
            local.get       $x2i
            local.get       $w1i
            f32x4.mul
            f32x4.sub
            local.set       $y2r
            ;; y2i = x2r * w1i + x2i * w1r
            local.get       $x2r
            local.get       $w1i
            f32x4.mul
            local.get       $x2i
            local.get       $w1r
            f32x4.mul
            f32x4.add
            local.set       $y2i

            ;; y1r = x1r * w2r - x1i * w2i
            local.get       $x1r
            local.get       $w2r
            f32x4.mul
            local.get       $x1i
            local.get       $w2i
            f32x4.mul
            f32x4.sub
            local.set       $y1r
            ;; y1i = x1r * w2i + x1i * w2r
            local.get       $x1r
            local.get       $w2i
            f32x4.mul
            local.get       $x1i
            local.get       $w2r
            f32x4.mul
            f32x4.add
            local.set       $y1i

            ;; ar = y0r + y1r
            local.get       $y0r
            local.get       $y1r
            f32x4.add
            local.set       $ar
            ;; cr = y0r - y1r
            local.get       $y0r
            local.get       $y1r
            f32x4.sub
            local.set       $cr
            ;; ai = y0i + y1i
            local.get       $y0i
            local.get       $y1i
            f32x4.add
            local.set       $ai
            ;; ci = y0i - y1i
            local.get       $y0i
            local.get       $y1i
            f32x4.sub
            local.set       $ci

            ;; x3r = self.loadF32x4(self.bufferReal, iBufR)
            local.get       $iBufR
            v128.load       offset=48
            local.set       $x3r
            ;; iBufI += nb
            local.get       $iBufI
            ;; x3i = self.loadF32x4(self.bufferImag, iBufI)
            v128.load       offset=48
            local.set       $x3i

            ;; y3r = x3r * w3r - x3i * w3i
            local.get       $x3r
            local.get       $w3r
            f32x4.mul
            local.get       $x3i
            local.get       $w3i
            f32x4.mul
            f32x4.sub
            local.set       $y3r
            ;; y3i = x3r * w3i + x3i * w3r
            local.get       $x3r
            local.get       $w3i
            f32x4.mul
            local.get       $x3i
            local.get       $w3r
            f32x4.mul
            f32x4.add
            local.set       $y3i

            ;; br = y2r + y3r
            local.get       $y2r
            local.get       $y3r
            f32x4.add
            local.set       $br
            ;; di = y2r - y3r
            local.get       $y2r
            local.get       $y3r
            f32x4.sub
            local.set       $di
            ;; dr = y2i - y3i
            local.get       $y2i
            local.get       $y3i
            f32x4.sub
            local.set       $dr
            ;; bi = y2i + y3i
            local.get       $y2i
            local.get       $y3i
            f32x4.add
            local.set       $bi


            ;; z3r = cr - dr
            ;; self.storeF32x4(self.bufferReal, iBufR, z3r)
            local.get       $iBufR

            local.get       $cr
            local.get       $dr
            f32x4.sub

            v128.store      offset=48
            ;; z3i = ci + di
            ;; self.storeF32x4(self.bufferImag, iBufI, z3i)
            local.get       $iBufI

            local.get       $ci
            local.get       $di
            f32x4.add

            v128.store      offset=48

            local.get       $iBufI
            ;; z2i = ai - bi
            ;; self.storeF32x4(self.bufferImag, iBufI, z2i)
            local.get       $ai
            local.get       $bi
            f32x4.sub

            v128.store      offset=32

            local.get       $iBufR
            ;; z2r = ar - br
            ;; self.storeF32x4(self.bufferReal, iBufR, z2r)
            local.get       $ar
            local.get       $br
            f32x4.sub

            v128.store      offset=32

            local.get       $iBufR
            ;; z1r = cr + dr
            ;; self.storeF32x4(self.bufferReal, iBufR, z1r)
            local.get       $cr
            local.get       $dr
            f32x4.add

            v128.store      offset=16

            local.get       $iBufI
            ;; z1i = ci - di
            ;; self.storeF32x4(self.bufferImag, iBufI, z1i)
            local.get       $ci
            local.get       $di
            f32x4.sub

            v128.store      offset=16

            local.get       $iBufR
            ;; z0r = ar + br
            ;; self.storeF32x4(self.bufferReal, iBufR, z0r)
            local.get       $ar
            local.get       $br
            f32x4.add

            v128.store

            local.get       $iBufI
            ;; z0i = ai + bi
            ;; self.storeF32x4(self.bufferImag, iBufI, z0i)
            local.get       $ai
            local.get       $bi
            f32x4.add

            v128.store
            ;; iBufR += 16
            local.get       $iBufR
            i32.const       16
            i32.add
            local.set       $iBufR
            ;; iBufI += 16
            local.get       $iBufI
            i32.const       16
            i32.add
            local.set       $iBufI
 
            ;; iiR0 += 4*nb
            local.get       $iiR0
            local.get       $nb
            i32.const       2
            i32.shl
            i32.add
            local.set       $iiR0
            ;; iiI0 += 4*nb
            local.get       $iiI0
            local.get       $nb
            i32.const       2
            i32.shl
            i32.add
            local.set       $iiI0

            ;; pti += nb
            local.get       $pti
            local.get       $nb
            i32.add
            local.tee       $pti
            ;; if pti >= points:
            ;;     break
            global.get      $points
            i32.lt_u
            br_if           $outer_loop
        )
    )

    (func $layerRadix2 (param $layer i32)
        (local $n       i32)
        (local $nb      i32)
        (local $i       i32)
        (local $bufR    i32)
        (local $bufI    i32)
        (local $twR     i32)
        (local $twI     i32)

        (local $ar  v128)
        (local $ai  v128)
        (local $br  v128)
        (local $bi  v128)
        (local $sr  v128)
        (local $si  v128)
        (local $tr  v128)
        (local $ti  v128)

        global.get      $twiddleFactorsOffsetsR
        local.set       $twR
        global.get      $twiddleFactorsOffsetsI
        local.set       $twI

        i32.const       1
        local.get       $layer
        i32.shl
        local.set       $n

        ;; nb = n * 2
        local.get       $n
        i32.const       2
        i32.mul
        local.set       $nb

        ;; bufR = self.base(self.bufferReal)
        global.get      $workBufferR
        local.set       $bufR
        ;; bufI = self.base(self.bufferImag)
        global.get      $workBufferI
        local.set       $bufI

        ;; i = 0
        i32.const       0
        local.set       $i
        (loop $inner_loop
            ;; ar = self.loadF32x4(self.bufferReal, bufR)
            local.get       $bufR
            v128.load
            local.set       $ar
            ;; ai = self.loadF32x4(self.bufferImag, bufI)
            local.get       $bufI
            v128.load
            local.set       $ai

            ;; br = self.loadF32x4(self.bufferReal, bufR + nb)
            local.get       $bufR
            local.get       $nb
            i32.add
            v128.load
            local.set       $br
            ;; bi = self.loadF32x4(self.bufferImag, bufI + nb)
            local.get       $bufI
            local.get       $nb
            i32.add
            v128.load
            local.set       $bi

            ;; tr = self.loadF32x4(self.lastTwiddlesReal, twR)
            local.get       $twR
            v128.load
            local.set       $tr
            ;; ti = self.loadF32x4(self.lastTwiddlesImag, twI)
            local.get       $twI
            v128.load
            local.set       $ti

            ;; sr = tr*br - ti*bi
            local.get       $tr
            local.get       $br
            f32x4.mul
            local.get       $ti
            local.get       $bi
            f32x4.mul
            f32x4.sub
            local.set       $sr
            ;; si = tr*bi + ti*br
            local.get       $tr
            local.get       $bi
            f32x4.mul
            local.get       $ti
            local.get       $br
            f32x4.mul
            f32x4.add
            local.set       $si

            ;; self.storeF32x4(self.bufferReal, bufR     , ar+sr)
            local.get       $bufR
            local.get       $ar
            local.get       $sr
            f32x4.add
            v128.store
            ;; self.storeF32x4(self.bufferImag, bufI     , ai+si)
            local.get       $bufI
            local.get       $ai
            local.get       $si
            f32x4.add
            v128.store
            ;; self.storeF32x4(self.bufferReal, bufR + nb, ar-sr)
            local.get       $bufR
            local.get       $nb
            i32.add
            local.get       $ar
            local.get       $sr
            f32x4.sub
            v128.store
            ;; self.storeF32x4(self.bufferImag, bufI + nb, ai-si)
            local.get       $bufI
            local.get       $nb
            i32.add
            local.get       $ai
            local.get       $si
            f32x4.sub
            v128.store

            ;; twR += 16
            local.get       $twR
            i32.const       16
            i32.add
            local.set       $twR
            ;; twI += 16
            local.get       $twI
            i32.const       16
            i32.add
            local.set       $twI
            ;; bufR += 16
            local.get       $bufR
            i32.const       16
            i32.add
            local.set       $bufR
            ;; bufI += 16
            local.get       $bufI
            i32.const       16
            i32.add
            local.set       $bufI

            ;; i += 8
            local.get       $i
            i32.const       8
            i32.add
            local.tee       $i
            ;; if i >= n:
            ;;     break
            local.get       $n
            i32.lt_u
            br_if           $inner_loop
        )
    )

    (table $funcTable 6 funcref)

    (elem (i32.const 0) $layerRadix2
                        $layerRadix4SIMD
                        $magSqrSIMD
                        $inputLayer0And1SIMD
                        $layer3Radix4SIMD
                        $inputLayer0And1RealSIMD)

    (func (export "run")

        (local $i               i32)
        (local $count           i32)
        (local $scheduleOffset  i32)
        (local $tmp             i32)

        global.get      $schedule
        local.set       $scheduleOffset

        global.get      $scheduleCount
        local.set       $count

        i32.const       0
        local.set       $i

        (loop $scheduleLoop
            ;; Load arg
            local.get       $scheduleOffset
            local.get       $i
            i32.const       8
            i32.mul
            i32.add
            local.tee       $tmp
            i32.load        offset=4
            
            ;; Load index
            local.get       $tmp
            i32.load

            call_indirect (type $layerFunc)

            local.get       $i
            i32.const       1
            i32.add
            local.tee       $i
            local.get       $count
            i32.lt_u
            br_if           $scheduleLoop
        )
    )

    (func $twiddle (param $i i32) (param $N i32) (result f32 f32)

        (local $tmp f32)

        f32.const       -6.28318530717958647692
        local.get       $i
        f32.convert_i32_u
        f32.mul
        local.get       $N
        f32.convert_i32_u
        f32.div
        local.tee       $tmp
        call $sin

        local.get       $tmp
        call $cos

    )

    (func $bitreverse (param $index i32) (param $bits i32) (result i32)

        (local $i       i32)
        (local $result  i32)

        i32.const       0
        local.set       $result

        i32.const       0
        local.set       $i

        (loop $inner_loop
            local.get       $index
            local.get       $i
            i32.shr_u
            i32.const       1
            i32.and
            
            local.get       $bits
            local.get       $i
            i32.sub
            i32.const       1
            i32.sub
            i32.shl

            local.get       $result
            i32.or
            local.set       $result

            local.get       $i
            i32.const       1
            i32.add
            local.tee       $i
            local.get       $bits
            i32.lt_u
            br_if           $inner_loop
        )

        local.get       $result

    )

    (func $precalcBitReverseOffsets

        (local $i i32)
        (local $inStride i32)

        i32.const       0
        local.set       $i

        global.get      $inputType
        i32.const       0
        i32.eq

        (if
            (then
                i32.const       8
                local.set       $inStride)
            (else
                i32.const       4
                local.set       $inStride)
        )

        (loop $inner_loop

            global.get      $briOffset
            local.get       $i
            i32.add

            local.get       $i
            global.get      $fftBits
            call            $bitreverse
            local.get       $inStride
            i32.mul
            global.get      $inBuffer
            i32.add
            
            i32.store
        
            local.get       $i
            i32.const       4
            i32.add
            local.tee       $i
            global.get      $points
            i32.lt_u
            br_if           $inner_loop
        )

    )

    (func $precalcTwiddleFactors

        (local $i       i32)
        (local $cnt     i32)
        (local $points  i32)
        (local $tmpC    f32)
        (local $tmpS    f32)

        global.get      $points
        local.tee       $points

        i32.const       1
        i32.shr_u
        local.set       $cnt

        i32.const       0
        local.set       $i

        (loop $inner_loop

            local.get       $i
            local.get       $points
            call            $twiddle
            local.set       $tmpC
            local.set       $tmpS

            global.get      $twiddleFactorsOffsetsR
            local.get       $i
            i32.const       4
            i32.mul
            i32.add

            local.get       $tmpC

            f32.store

            global.get      $twiddleFactorsOffsetsI
            local.get       $i
            i32.const       4
            i32.mul
            i32.add

            local.get       $tmpS

            f32.store

            local.get       $i
            i32.const       1
            i32.add
            local.tee       $i
            local.get       $cnt
            i32.lt_u
            br_if           $inner_loop
        )
    )

    (func $precalcTwiddlebanks

        (local $kk      i32)
        (local $n       i32)
        (local $nb      i32)
        (local $i       i32)
        (local $j       i32)
        (local $k       i32)
        (local $bankR   i32)
        (local $addr    i32)

        (local $tmpR    f32)
        (local $tmpI    f32)

        i32.const       3
        local.set       $kk

        (loop $loop0

            i32.const       1
            local.get       $kk
            i32.shl
            local.tee       $n

            i32.const       2
            i32.div_u
            local.set       $nb

            local.get       $n
            i32.const       16
            i32.mul
            i32.const       16
            call            $allocateBuffer
            local.set       $bankR

            i32.const       0
            local.set       $i

            (loop $loopI
                i32.const       0
                local.set       $k

                (loop $loopK

                    i32.const       0
                    local.set       $j

                    (loop $loopJ

                        local.get       $k
                        local.get       $i
                        local.get       $j
                        i32.add
                        i32.mul
                        local.get       $n
                        call            $twiddle
                        local.set       $tmpR
                        local.set       $tmpI

                        local.get       $bankR
                        local.get       $i
                        local.get       $k
                        i32.add
                        i32.const       8
                        i32.mul
                        local.get       $j
                        i32.add
                        i32.const       4
                        i32.mul
                        i32.add
                        local.tee       $addr
                        ;; this.#floatMemory.setFloat32(bankR + 4 * (8 * (i + k) + j) + 0, wkr, true);
                        local.get       $tmpR
                        f32.store

                        ;; this.#floatMemory.setFloat32(bankR + 4 * (8 * (i + k) + j) + 16, wki, true);
                        local.get       $addr
                        local.get       $tmpI
                        f32.store       offset=16

                        local.get       $j
                        i32.const       1
                        i32.add
                        local.tee       $j
                        i32.const       4
                        i32.lt_u
                        br_if           $loopJ
                    )


                    local.get       $k
                    i32.const       1
                    i32.add
                    local.tee       $k
                    i32.const       4
                    i32.lt_u
                    br_if           $loopK
                )
                          
                local.get       $i
                i32.const       4
                i32.add
                local.tee       $i
                local.get       $nb
                i32.lt_u
                br_if           $loopI
            )

            ;; let layerIndex = 2;
            global.get      $twiddleBanks
            local.get       $kk
            i32.const       1
            i32.sub
            i32.const       3
            i32.shl
            i32.add

            local.get       $bankR

            i32.store

            local.get       $kk
            i32.const       1
            i32.add
            local.tee       $kk
            global.get      $fftBits
            i32.le_u
            br_if           $loop0
        )
    )

    (func $emitStep (param $func i32) (param $arg i32)
        (local $offset i32)

        global.get      $scheduleCount
        i32.const       8
        i32.mul
        global.get      $schedule
        i32.add
        local.tee       $offset

        local.get       $func
        i32.store

        local.get       $offset
        local.get       $arg
        i32.store       offset=4

        global.get      $scheduleCount
        i32.const       1
        i32.add
        global.set      $scheduleCount
    )

    (func $prepareSchedule

        (local $layer i32)
        (local $n     i32)

        ;; Input layer
        global.get      $inputType
        i32.const       0
        i32.eq

        (if
            (then
                i32.const       3
                i32.const       0
                call            $emitStep)
            (else
                i32.const       5
                i32.const       0
                call            $emitStep)
        )

        ;; If points>=32 do a pass with 4x butterfly rounds (twiddle factors are constant and fit in single v128)
        global.get      $points
        i32.const       32
        i32.ge_u

        (if
            (then
                i32.const       4
                i32.const       3
                call            $emitStep

                ;; Start layer
                i32.const       5
                local.set       $layer
            )
            (else
                ;; Start layer
                i32.const       3
                local.set       $layer
            )
        )

        ;; Do remaining layers
        i32.const       1
        local.get       $layer
        i32.shl
        local.set       $n

        (loop $inner_loop

            local.get       $n
            i32.const       2
            i32.mul
            global.get      $points
            i32.le_u

            local.get       $n
            i32.const       8
            i32.ge_u

            i32.and

            (if
                (then
                    i32.const       1
                    local.get       $layer
                    call            $emitStep

                    local.get       $layer
                    i32.const       2
                    i32.add
                    local.set       $layer

                    local.get       $n
                    i32.const       4
                    i32.mul
                    local.set       $n
                )
                (else
                    i32.const       0
                    local.get       $layer
                    call            $emitStep

                    local.get       $layer
                    i32.const       1
                    i32.add
                    local.set       $layer

                    local.get       $n
                    i32.const       2
                    i32.mul
                    local.set       $n
                )
            )
            
            local.get       $n
            global.get      $points
            i32.le_u
            br_if           $inner_loop
        )

        global.get      $outputType
        i32.const       0
        i32.eq

        (if
            (then
                i32.const       2
                i32.const       0
                call            $emitStep
            )
        )
    )

    (func $initialize

        ;; Calculate fft bits
        global.get      $points
        f32.convert_i32_u
        call            $log2
        call            $ceil
        global.set      $fftBits

        global.get      $points
        i32.const       4
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $workBufferR


        global.get      $points
        i32.const       4
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $workBufferI

        global.get      $shift
        (if
            (then
                global.get      $points
                i32.const       4
                i32.mul
                i32.const       16
                call            $allocateBuffer
                global.set      $outBufferR
            )
            (else
                global.get      $workBufferR
                global.set      $outBufferR
            )
        )

        global.get      $points
        i32.const       4
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $briOffset


        global.get      $points
        i32.const       8
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $inBuffer


        global.get      $fftBits
        i32.const       16
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $schedule


        global.get      $points
        i32.const       2
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $twiddleFactorsOffsetsR


        global.get      $points
        i32.const       2
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $twiddleFactorsOffsetsI


        global.get      $fftBits
        i32.const       16
        i32.mul
        i32.const       16
        call            $allocateBuffer
        global.set      $twiddleBanks

        call            $precalcBitReverseOffsets
        call            $precalcTwiddleFactors
        call            $precalcTwiddlebanks

        call            $prepareSchedule
    )

    (func (export "getOutputBuffers") (result i32 i32)
        global.get      $outBufferR
        global.get      $workBufferI
    )

    (func (export "getInputBuffer") (result i32)
        global.get      $inBuffer
    )

    (start $initialize)
)