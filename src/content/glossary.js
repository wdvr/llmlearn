// Curated glossary of technical terms used across all four courses
// (CUDA, PyTorch/LLMs, Apple MPS, Reinforcement Learning).
//
// Each entry has:
//   - term:         Display name (canonical spelling).
//   - slug:         URL-safe id used in `/glossary#<slug>` anchors. Must be
//                   unique. The linkifier in ModulePage.jsx looks terms up by
//                   slug via a Map.
//   - category:     One of: 'CUDA', 'GPU foundations', 'Numeric formats',
//                   'PyTorch', 'LLM architecture', 'Training', 'Inference',
//                   'Attention', 'Apple MPS', 'Reinforcement Learning',
//                   'Optimization'.
//   - definition:   1-2 sentences. Plain-text (no markdown).
//   - links:        External references — Wikipedia, vendor docs, original
//                   paper. Aim for 1-3 per entry.
//   - introducedIn: Optional module id where the term first appears in the
//                   curriculum (used to link back to the module page).
//   - aliases:      Optional list of alternate spellings/abbreviations the
//                   linkifier should also match.

export const glossary = [
  // ---------------------------------------------------------------------------
  // GPU foundations
  // ---------------------------------------------------------------------------
  {
    term: 'CUDA',
    slug: 'cuda',
    category: 'GPU foundations',
    definition: 'NVIDIA\'s parallel-computing platform and C++-like programming model for general-purpose GPU computation. Originally "Compute Unified Device Architecture".',
    links: [
      { title: 'NVIDIA CUDA Toolkit', url: 'https://developer.nvidia.com/cuda-toolkit' },
      { title: 'Wikipedia: CUDA', url: 'https://en.wikipedia.org/wiki/CUDA' },
    ],
    introducedIn: 'cuda-intro-gpu',
  },
  {
    term: 'SIMT',
    slug: 'simt',
    category: 'GPU foundations',
    definition: 'Single Instruction, Multiple Threads — NVIDIA\'s execution model where 32 threads in a warp execute the same instruction in lockstep on different data.',
    links: [
      { title: 'Wikipedia: SIMT', url: 'https://en.wikipedia.org/wiki/Single_instruction,_multiple_threads' },
      { title: 'NVIDIA: SIMT Architecture', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture' },
    ],
    introducedIn: 'cuda-intro-gpu',
  },
  {
    term: 'Streaming Multiprocessor',
    slug: 'streaming-multiprocessor',
    category: 'GPU foundations',
    definition: 'The core execution unit of an NVIDIA GPU. Each SM contains CUDA cores, warp schedulers, register file, shared memory, and (since Volta) Tensor Cores.',
    aliases: ['SM', 'Streaming Multiprocessor (SM)'],
    links: [
      { title: 'NVIDIA: Hardware Implementation', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-implementation' },
    ],
    introducedIn: 'cuda-intro-gpu',
  },
  {
    term: 'HBM',
    slug: 'hbm',
    category: 'GPU foundations',
    definition: 'High Bandwidth Memory — stacked DRAM packaged on the same interposer as the GPU. Modern data-centre GPUs use HBM2e/HBM3 for ~2-3 TB/s of bandwidth.',
    links: [
      { title: 'Wikipedia: High Bandwidth Memory', url: 'https://en.wikipedia.org/wiki/High_Bandwidth_Memory' },
    ],
    introducedIn: 'cuda-intro-gpu',
  },
  {
    term: 'PCIe',
    slug: 'pcie',
    category: 'GPU foundations',
    definition: 'Peripheral Component Interconnect Express — the host-to-device bus used to move data between CPU memory and GPU memory. PCIe 5.0 x16 is ~64 GB/s; far slower than on-GPU HBM.',
    aliases: ['PCI Express'],
    links: [
      { title: 'Wikipedia: PCI Express', url: 'https://en.wikipedia.org/wiki/PCI_Express' },
    ],
    introducedIn: 'cuda-intro-gpu',
  },
  {
    term: 'Tensor Core',
    slug: 'tensor-core',
    category: 'GPU foundations',
    definition: 'A specialized hardware unit inside each SM (Volta and later) that performs a small matrix multiply-accumulate in one cycle. Where the FLOPs come from for modern deep learning.',
    aliases: ['Tensor Cores'],
    links: [
      { title: 'NVIDIA Tensor Cores', url: 'https://www.nvidia.com/en-us/data-center/tensor-cores/' },
      { title: 'Volta Whitepaper', url: 'https://images.nvidia.com/content/volta-architecture/pdf/volta-architecture-whitepaper.pdf' },
    ],
    introducedIn: 'cuda-tensor-cores',
  },
  {
    term: 'roofline model',
    slug: 'roofline-model',
    category: 'GPU foundations',
    definition: 'A visual performance model that plots achievable throughput against arithmetic intensity. The "roof" is bandwidth-bound on the left and compute-bound on the right.',
    aliases: ['Roofline Model', 'roofline'],
    links: [
      { title: 'Williams et al. 2009 (CACM)', url: 'https://dl.acm.org/doi/10.1145/1498765.1498785' },
      { title: 'Wikipedia: Roofline Model', url: 'https://en.wikipedia.org/wiki/Roofline_model' },
    ],
    introducedIn: 'cuda-performance',
  },
  {
    term: 'arithmetic intensity',
    slug: 'arithmetic-intensity',
    category: 'GPU foundations',
    definition: 'Floating-point operations performed per byte of memory traffic (FLOPs / byte). Determines whether a kernel is compute- or memory-bound on the roofline.',
    aliases: ['AI (arithmetic intensity)'],
    links: [
      { title: 'NVIDIA: Arithmetic Intensity', url: 'https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html#math-mem' },
    ],
    introducedIn: 'cuda-performance',
  },

  // ---------------------------------------------------------------------------
  // CUDA programming model
  // ---------------------------------------------------------------------------
  {
    term: 'CUDA kernel',
    slug: 'cuda-kernel',
    category: 'CUDA',
    definition: 'A function that runs on the GPU, executed in parallel by many threads. Launched from host code with a grid/block configuration.',
    aliases: ['kernel'],
    links: [
      { title: 'NVIDIA: Kernels', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#kernels' },
    ],
    introducedIn: 'cuda-programming-model',
  },
  {
    term: 'thread',
    slug: 'thread',
    category: 'CUDA',
    definition: 'The smallest unit of execution on the GPU. Each thread has its own registers and program counter and is identified by threadIdx within its block.',
    links: [
      { title: 'NVIDIA: Thread Hierarchy', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#thread-hierarchy' },
    ],
    introducedIn: 'cuda-programming-model',
  },
  {
    term: 'warp',
    slug: 'warp',
    category: 'CUDA',
    definition: 'A group of 32 threads on an NVIDIA GPU that always execute the same instruction together. The fundamental scheduling unit of SIMT.',
    links: [
      { title: 'NVIDIA: Warps', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture' },
      { title: 'Wikipedia: Warp', url: 'https://en.wikipedia.org/wiki/Thread_block_(CUDA_programming)#Warps' },
    ],
    introducedIn: 'cuda-thread-execution',
  },
  {
    term: 'thread block',
    slug: 'thread-block',
    category: 'CUDA',
    definition: 'A group of up to 1024 threads that run on the same SM and can cooperate via shared memory and __syncthreads(). Identified by blockIdx within the grid.',
    aliases: ['block', 'Block (Thread Block)'],
    links: [
      { title: 'Wikipedia: Thread block (CUDA)', url: 'https://en.wikipedia.org/wiki/Thread_block_(CUDA_programming)' },
    ],
    introducedIn: 'cuda-programming-model',
  },
  {
    term: 'grid',
    slug: 'grid',
    category: 'CUDA',
    definition: 'The full collection of thread blocks launched for one kernel invocation. Grids are 1D, 2D, or 3D and are indexed by gridDim and blockIdx.',
    links: [
      { title: 'NVIDIA: Thread Hierarchy', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#thread-hierarchy' },
    ],
    introducedIn: 'cuda-programming-model',
  },
  {
    term: 'shared memory',
    slug: 'shared-memory',
    category: 'CUDA',
    definition: 'On-chip scratchpad memory (~100 KB per SM) shared by all threads in a block. Roughly 100x faster than global memory; the key to high-performance CUDA kernels.',
    links: [
      { title: 'NVIDIA: Shared Memory', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#shared-memory' },
    ],
    introducedIn: 'cuda-memory-model',
  },
  {
    term: 'global memory',
    slug: 'global-memory',
    category: 'CUDA',
    definition: 'The GPU\'s main DRAM (HBM/GDDR), visible to all threads. Huge but slow — accessing it dominates the cost of most kernels.',
    links: [
      { title: 'NVIDIA: Device Memory', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#device-memory' },
    ],
    introducedIn: 'cuda-memory-model',
  },
  {
    term: 'register',
    slug: 'register',
    category: 'CUDA',
    definition: 'Per-thread storage in the SM register file. The fastest memory available; register pressure caps occupancy because the file is partitioned across resident threads.',
    aliases: ['registers'],
    links: [
      { title: 'NVIDIA: Register Usage', url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#register-pressure' },
    ],
    introducedIn: 'cuda-memory-model',
  },
  {
    term: 'constant memory',
    slug: 'constant-memory',
    category: 'CUDA',
    definition: 'A small (~64 KB) read-only memory space that\'s broadcast to all threads in a warp in one cycle when they access the same address. Ideal for filter weights and lookup tables.',
    aliases: ['Constant memory'],
    links: [
      { title: 'NVIDIA: Constant Memory', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#constant-memory' },
    ],
    introducedIn: 'cuda-memory-model',
  },
  {
    term: 'occupancy',
    slug: 'occupancy',
    category: 'CUDA',
    definition: 'The ratio of active warps per SM to the hardware maximum. Higher occupancy gives the scheduler more options to hide memory latency, but isn\'t always the best objective.',
    links: [
      { title: 'NVIDIA: Achieved Occupancy', url: 'https://docs.nvidia.com/gameworks/content/developertools/desktop/analysis/report/cudaexperiments/kernellevel/achievedoccupancy.htm' },
    ],
    introducedIn: 'cuda-thread-execution',
  },
  {
    term: 'memory coalescing',
    slug: 'coalescing',
    category: 'CUDA',
    definition: 'When all 32 threads in a warp read consecutive memory addresses, the hardware merges them into a single 128-byte transaction. Uncoalesced access is the #1 perf killer.',
    aliases: ['coalescing', 'Memory coalescing', 'coalesced'],
    links: [
      { title: 'NVIDIA: Coalesced Access to Global Memory', url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#coalesced-access-to-global-memory' },
    ],
    introducedIn: 'cuda-memory-model',
  },
  {
    term: 'bank conflict',
    slug: 'bank-conflict',
    category: 'CUDA',
    definition: 'When multiple threads in a warp access different addresses in the same shared-memory bank, the accesses serialize. Padding the array by 1 column is the usual fix.',
    aliases: ['Bank conflict', 'bank conflicts'],
    links: [
      { title: 'NVIDIA: Shared Memory Bank Conflicts', url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#shared-memory' },
    ],
    introducedIn: 'cuda-memory-model',
  },
  {
    term: 'branch divergence',
    slug: 'branch-divergence',
    category: 'CUDA',
    definition: 'When threads in the same warp take different branches of an if/else, both paths execute serially with masking. Divergence only matters within a warp.',
    aliases: ['divergence', 'warp divergence'],
    links: [
      { title: 'NVIDIA: Branch Predication', url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#branching-and-divergence' },
    ],
    introducedIn: 'cuda-thread-execution',
  },
  {
    term: '__syncthreads',
    slug: 'syncthreads',
    category: 'CUDA',
    definition: 'A block-level barrier: every thread in the block must reach this call before any thread proceeds. Required after writing to shared memory before others read it.',
    aliases: ['syncthreads', '__syncthreads()'],
    links: [
      { title: 'NVIDIA: Synchronization Functions', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#synchronization-functions' },
    ],
    introducedIn: 'cuda-memory-model',
  },
  {
    term: 'atomic operation',
    slug: 'atomic',
    category: 'CUDA',
    definition: 'A read-modify-write to global or shared memory that is guaranteed to be performed without interference from other threads. atomicAdd is the workhorse for histograms and reductions.',
    aliases: ['atomic', 'atomics', 'Atomics'],
    links: [
      { title: 'NVIDIA: Atomic Functions', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#atomic-functions' },
    ],
    introducedIn: 'cuda-histogram-sort',
  },
  {
    term: 'tiling',
    slug: 'tiling',
    category: 'CUDA',
    definition: 'A loop transformation that loads a tile of input into fast on-chip memory, computes on it many times, then moves on. The single most important optimization for matmul.',
    aliases: ['Tiling'],
    links: [
      { title: 'PMPP: Tiled Matrix Multiplication', url: 'https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0' },
    ],
    introducedIn: 'cuda-tiling-matmul',
  },
  {
    term: 'register tiling',
    slug: 'register-tiling',
    category: 'CUDA',
    definition: 'A second level of tiling where each thread accumulates a small sub-tile entirely in its registers, eliminating shared-memory traffic for the innermost loop.',
    links: [
      { title: 'CUTLASS: Hierarchical Tiling', url: 'https://github.com/NVIDIA/cutlass/blob/main/media/docs/efficient_gemm.md' },
    ],
    introducedIn: 'cuda-optimization-capstone',
  },
  {
    term: 'double buffering',
    slug: 'double-buffering',
    category: 'CUDA',
    definition: 'Allocating two shared-memory tiles so the kernel can compute on tile N while DMA-loading tile N+1. Hides global-memory latency behind compute.',
    aliases: ['Double buffering'],
    links: [
      { title: 'NVIDIA: cp.async and Double Buffering', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-data-copies' },
    ],
    introducedIn: 'cuda-streams-graphs',
  },
  {
    term: 'cp.async',
    slug: 'cp-async',
    category: 'CUDA',
    definition: 'Ampere+ instruction that copies from global to shared memory asynchronously, bypassing registers. Enables hardware-managed double buffering.',
    links: [
      { title: 'NVIDIA: Asynchronous Data Copies', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-data-copies' },
    ],
    introducedIn: 'cuda-streams-graphs',
  },
  {
    term: 'mma.sync',
    slug: 'mma-sync',
    category: 'CUDA',
    definition: 'The low-level PTX instruction that drives a single Tensor Core matrix multiply-accumulate. WMMA, CUTLASS, and Triton all ultimately emit mma.sync.',
    links: [
      { title: 'PTX ISA: mma', url: 'https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#warp-level-matrix-instructions' },
    ],
    introducedIn: 'cuda-tensor-cores',
  },
  {
    term: 'WMMA',
    slug: 'wmma',
    category: 'CUDA',
    definition: 'Warp Matrix Multiply-Accumulate — the C++ API in <mma.h> for programming Tensor Cores at the warp level. Operates on fragments of 16x16 matrices.',
    links: [
      { title: 'NVIDIA: WMMA API', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#wmma' },
    ],
    introducedIn: 'cuda-tensor-cores',
  },
  {
    term: 'CUTLASS',
    slug: 'cutlass',
    category: 'CUDA',
    definition: 'NVIDIA\'s open-source CUDA C++ template library for high-performance GEMM and convolution. Used as a building block by Triton, PyTorch, and many serving engines.',
    links: [
      { title: 'CUTLASS on GitHub', url: 'https://github.com/NVIDIA/cutlass' },
    ],
    introducedIn: 'cuda-tensor-cores',
  },
  {
    term: 'Triton',
    slug: 'triton',
    category: 'CUDA',
    definition: 'OpenAI\'s Python-embedded DSL for writing fast GPU kernels. Compiles to PTX with automatic shared-memory tiling and Tensor Core mapping.',
    links: [
      { title: 'Triton Documentation', url: 'https://triton-lang.org' },
      { title: 'Triton on GitHub', url: 'https://github.com/triton-lang/triton' },
    ],
    introducedIn: 'cuda-tensor-cores',
  },
  {
    term: 'cuBLAS',
    slug: 'cublas',
    category: 'CUDA',
    definition: 'NVIDIA\'s closed-source BLAS implementation tuned for every NVIDIA GPU generation. The reference for "as fast as it gets" on standard matmul.',
    links: [
      { title: 'cuBLAS Docs', url: 'https://docs.nvidia.com/cuda/cublas/index.html' },
    ],
    introducedIn: 'cuda-tiling-matmul',
  },
  {
    term: 'cuDNN',
    slug: 'cudnn',
    category: 'CUDA',
    definition: 'NVIDIA\'s GPU-accelerated library of primitives for deep neural networks — convolution, pooling, normalization, attention. PyTorch and TensorFlow use it under the hood.',
    links: [
      { title: 'cuDNN Docs', url: 'https://docs.nvidia.com/deeplearning/cudnn/' },
    ],
    introducedIn: 'cuda-tiling-matmul',
  },
  {
    term: 'CUDA stream',
    slug: 'cuda-stream',
    category: 'CUDA',
    definition: 'An independent queue of GPU work. Operations within a stream are serialized; operations across streams may overlap, enabling compute/copy overlap.',
    aliases: ['stream', 'CUDA streams', 'streams'],
    links: [
      { title: 'NVIDIA: Streams', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#streams' },
    ],
    introducedIn: 'cuda-streams-graphs',
  },
  {
    term: 'CUDA Graph',
    slug: 'cuda-graph',
    category: 'CUDA',
    definition: 'A captured DAG of kernel launches that can be replayed with one CPU call, amortizing launch overhead. Critical for LLM decode where each token is a few microseconds of work.',
    aliases: ['CUDA Graphs'],
    links: [
      { title: 'NVIDIA: CUDA Graphs', url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#cuda-graphs' },
    ],
    introducedIn: 'cuda-streams-graphs',
  },
  {
    term: 'GEMM',
    slug: 'gemm',
    category: 'CUDA',
    definition: 'GEneral Matrix Multiply — the BLAS operation C = α·A·B + β·C. ~95% of LLM training and inference FLOPs are GEMMs.',
    links: [
      { title: 'Wikipedia: BLAS', url: 'https://en.wikipedia.org/wiki/Basic_Linear_Algebra_Subprograms#Level_3' },
    ],
    introducedIn: 'cuda-tiling-matmul',
  },
  {
    term: 'GEMV',
    slug: 'gemv',
    category: 'CUDA',
    definition: 'GEneral Matrix-Vector multiply — y = α·A·x + β·y. Memory-bound (no data reuse), which is why LLM decode is bandwidth-limited rather than compute-limited.',
    links: [
      { title: 'BLAS Level 2', url: 'https://en.wikipedia.org/wiki/Basic_Linear_Algebra_Subprograms#Level_2' },
    ],
    introducedIn: 'cuda-tiling-matmul',
  },
  {
    term: 'im2col',
    slug: 'im2col',
    category: 'CUDA',
    definition: 'A data layout transform that turns a convolution into a matrix multiplication by unfolding image patches into columns. Lets a conv use the highly tuned GEMM path.',
    links: [
      { title: 'Caffe: im2col explained', url: 'https://github.com/BVLC/caffe/blob/master/src/caffe/util/im2col.cpp' },
    ],
    introducedIn: 'cuda-convolution',
  },
  {
    term: 'parallel reduction',
    slug: 'reduction',
    category: 'CUDA',
    definition: 'Combining N values into one (sum, max, etc.) in O(log N) parallel steps using a tree. The base case for most fused-op kernels.',
    aliases: ['reduction'],
    links: [
      { title: 'Mark Harris: Optimizing Parallel Reduction', url: 'https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf' },
    ],
    introducedIn: 'cuda-reduction',
  },
  {
    term: 'parallel scan',
    slug: 'scan',
    category: 'CUDA',
    definition: 'Prefix-sum primitive: from x, compute y where y[i] = x[0]+x[1]+...+x[i]. Backbone of stream compaction, radix sort, and histogram equalization.',
    aliases: ['scan', 'prefix sum', 'prefix-sum'],
    links: [
      { title: 'GPU Gems 3: Parallel Prefix Sum', url: 'https://developer.nvidia.com/gpugems/gpugems3/part-vi-gpu-computing/chapter-39-parallel-prefix-sum-scan-cuda' },
    ],
    introducedIn: 'cuda-scan',
  },
  {
    term: 'histogram',
    slug: 'histogram',
    category: 'CUDA',
    definition: 'A bin-counting reduction. On GPUs, "privatize" by giving each block its own per-thread or shared-memory histogram and merge with atomics at the end.',
    links: [
      { title: 'NVIDIA: Histogram Kernels', url: 'https://docs.nvidia.com/cuda/cuda-samples/index.html#histogram' },
    ],
    introducedIn: 'cuda-histogram-sort',
  },
  {
    term: 'Nsight Compute',
    slug: 'nsight-compute',
    category: 'CUDA',
    definition: 'NVIDIA\'s kernel-level profiler. Reports occupancy, memory throughput, warp stall reasons, and the achieved fraction of peak FLOPs/bandwidth.',
    links: [
      { title: 'Nsight Compute', url: 'https://developer.nvidia.com/nsight-compute' },
    ],
    introducedIn: 'cuda-performance',
  },

  // ---------------------------------------------------------------------------
  // Numeric formats
  // ---------------------------------------------------------------------------
  {
    term: 'FP32',
    slug: 'fp32',
    category: 'Numeric formats',
    definition: 'IEEE-754 single-precision float: 1 sign bit, 8 exponent bits, 23 mantissa bits. The default in PyTorch and the historical training precision.',
    aliases: ['float32', 'fp32'],
    links: [
      { title: 'Wikipedia: Single-precision floating-point', url: 'https://en.wikipedia.org/wiki/Single-precision_floating-point_format' },
    ],
    introducedIn: 'cuda-mixed-precision',
  },
  {
    term: 'FP16',
    slug: 'fp16',
    category: 'Numeric formats',
    definition: 'IEEE-754 half-precision: 1/5/10 sign/exp/mantissa. Half the memory and ~2x faster on Tensor Cores, but narrow exponent range — needs loss scaling for training.',
    aliases: ['float16', 'half', 'fp16'],
    links: [
      { title: 'Wikipedia: Half-precision floating-point', url: 'https://en.wikipedia.org/wiki/Half-precision_floating-point_format' },
    ],
    introducedIn: 'cuda-mixed-precision',
  },
  {
    term: 'BF16',
    slug: 'bf16',
    category: 'Numeric formats',
    definition: 'Brain Floating Point: 1/8/7 sign/exp/mantissa — same exponent range as FP32 with half the precision. The modern default for LLM training; no loss scaling needed.',
    aliases: ['bfloat16', 'bf16', 'BFloat16'],
    links: [
      { title: 'Wikipedia: bfloat16', url: 'https://en.wikipedia.org/wiki/Bfloat16_floating-point_format' },
    ],
    introducedIn: 'cuda-mixed-precision',
  },
  {
    term: 'TF32',
    slug: 'tf32',
    category: 'Numeric formats',
    definition: 'NVIDIA TensorFloat-32: 1/8/10 — FP32 range with FP16-like mantissa, processed by Tensor Cores. A drop-in 8x speedup for FP32 matmul code on Ampere+.',
    aliases: ['tf32', 'TensorFloat-32'],
    links: [
      { title: 'NVIDIA TF32 explainer', url: 'https://blogs.nvidia.com/blog/tensorfloat-32-precision-format/' },
    ],
    introducedIn: 'cuda-mixed-precision',
  },
  {
    term: 'FP8',
    slug: 'fp8',
    category: 'Numeric formats',
    definition: '8-bit float formats introduced on Hopper. Two variants: E4M3 (more precision, for activations) and E5M2 (more range, for gradients). Requires per-tensor scaling.',
    aliases: ['fp8', 'FP8 (e4m3, e5m2)'],
    links: [
      { title: 'Micikevicius et al. 2022 — FP8 Formats', url: 'https://arxiv.org/abs/2209.05433' },
    ],
    introducedIn: 'cuda-mixed-precision',
  },
  {
    term: 'FP4',
    slug: 'fp4',
    category: 'Numeric formats',
    definition: '4-bit float formats (E2M1, MXFP4) introduced on Blackwell. Doubles throughput again at the cost of much tighter scaling and calibration requirements.',
    aliases: ['fp4', 'MXFP4'],
    links: [
      { title: 'Blackwell Architecture (NVIDIA)', url: 'https://resources.nvidia.com/en-us-blackwell-architecture' },
    ],
    introducedIn: 'cuda-mixed-precision',
  },
  {
    term: 'INT8',
    slug: 'int8',
    category: 'Numeric formats',
    definition: '8-bit signed integer — the bread and butter of post-training quantization. Used by SmoothQuant, AWQ-int8, and ONNX Runtime mobile.',
    aliases: ['int8'],
    links: [
      { title: 'NVIDIA INT8 inference guide', url: 'https://docs.nvidia.com/deeplearning/tensorrt/developer-guide/index.html#int8-quantization' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'INT4',
    slug: 'int4',
    category: 'Numeric formats',
    definition: '4-bit signed integer quantization. The most common LLM quantization (AWQ, GPTQ) — 4x memory reduction with usually <1% quality loss.',
    aliases: ['int4'],
    links: [
      { title: 'AWQ paper (Lin et al.)', url: 'https://arxiv.org/abs/2306.00978' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'mantissa',
    slug: 'mantissa',
    category: 'Numeric formats',
    definition: 'The significand bits of a floating-point number. Width determines the relative precision (epsilon) of the format.',
    links: [
      { title: 'Wikipedia: Floating-point arithmetic', url: 'https://en.wikipedia.org/wiki/Floating-point_arithmetic' },
    ],
  },
  {
    term: 'exponent',
    slug: 'exponent',
    category: 'Numeric formats',
    definition: 'The power-of-two exponent bits of a floating-point number. Width determines the dynamic range (the largest representable value before overflow).',
    links: [
      { title: 'Wikipedia: IEEE 754', url: 'https://en.wikipedia.org/wiki/IEEE_754' },
    ],
  },
  {
    term: 'quantization',
    slug: 'quantization',
    category: 'Numeric formats',
    definition: 'Mapping continuous weights/activations to a discrete (often integer) grid. Reduces memory and bandwidth at the cost of some accuracy.',
    aliases: ['Quantization'],
    links: [
      { title: 'Wikipedia: Quantization (signal processing)', url: 'https://en.wikipedia.org/wiki/Quantization_(signal_processing)' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'calibration',
    slug: 'calibration',
    category: 'Numeric formats',
    definition: 'Running a sample of inputs through a model to record activation distributions, then picking quantization scales/clip points that minimize error.',
    links: [
      { title: 'NVIDIA TensorRT Calibration', url: 'https://docs.nvidia.com/deeplearning/tensorrt/developer-guide/index.html#enable_int8_c' },
    ],
  },
  {
    term: 'AWQ',
    slug: 'awq',
    category: 'Numeric formats',
    definition: 'Activation-aware Weight Quantization — preserves the most "salient" weights (those multiplied by large activations) at higher precision. Common 4-bit format.',
    aliases: ['INT4 AWQ'],
    links: [
      { title: 'AWQ paper (Lin et al. 2023)', url: 'https://arxiv.org/abs/2306.00978' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'GPTQ',
    slug: 'gptq',
    category: 'Numeric formats',
    definition: 'A one-shot weight-quantization method based on approximate second-order info (OBS/OBQ). Produces 3-4 bit weights with low accuracy loss.',
    aliases: ['INT4 GPTQ'],
    links: [
      { title: 'GPTQ paper (Frantar et al. 2022)', url: 'https://arxiv.org/abs/2210.17323' },
    ],
    introducedIn: 'inference-batching-vllm',
  },

  // ---------------------------------------------------------------------------
  // PyTorch
  // ---------------------------------------------------------------------------
  {
    term: 'tensor',
    slug: 'tensor',
    category: 'PyTorch',
    definition: 'An n-dimensional array with a dtype, shape, and device. The basic data type in PyTorch; also carries grad metadata when requires_grad=True.',
    aliases: ['Tensor'],
    links: [
      { title: 'PyTorch Tensor API', url: 'https://pytorch.org/docs/stable/tensors.html' },
    ],
    introducedIn: 'tensors-devices',
  },
  {
    term: 'dtype',
    slug: 'dtype',
    category: 'PyTorch',
    definition: 'The element type of a tensor (torch.float32, torch.bfloat16, torch.int64, etc.). Determines precision, memory cost, and which Tensor Core paths apply.',
    links: [
      { title: 'PyTorch Dtypes', url: 'https://pytorch.org/docs/stable/tensor_attributes.html#torch.dtype' },
    ],
    introducedIn: 'tensors-devices',
  },
  {
    term: 'autograd',
    slug: 'autograd',
    category: 'PyTorch',
    definition: 'PyTorch\'s automatic differentiation engine. Records a dynamic graph of ops on tensors with requires_grad=True and computes gradients via the chain rule on backward().',
    links: [
      { title: 'PyTorch Autograd Tutorial', url: 'https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html' },
    ],
    introducedIn: 'autograd-backprop',
  },
  {
    term: 'computation graph',
    slug: 'computation-graph',
    category: 'PyTorch',
    definition: 'A DAG of tensor operations recorded by autograd. PyTorch builds it dynamically per forward pass (define-by-run); TF1 built it statically (define-then-run).',
    links: [
      { title: 'PyTorch: Autograd mechanics', url: 'https://pytorch.org/docs/stable/notes/autograd.html' },
    ],
    introducedIn: 'autograd-backprop',
  },
  {
    term: 'gradient',
    slug: 'gradient',
    category: 'PyTorch',
    definition: 'The partial derivative of the loss with respect to a parameter — the direction (and magnitude) the optimizer should step in to reduce loss.',
    aliases: ['Gradient', 'gradients'],
    links: [
      { title: 'Wikipedia: Gradient', url: 'https://en.wikipedia.org/wiki/Gradient' },
    ],
    introducedIn: 'autograd-backprop',
  },
  {
    term: 'backward pass',
    slug: 'backward',
    category: 'PyTorch',
    definition: 'The second phase of training: starting from the loss, propagate gradients backwards through the graph (chain rule) to every parameter that contributed to it.',
    aliases: ['backward', 'Backward pass'],
    links: [
      { title: 'PyTorch: backward()', url: 'https://pytorch.org/docs/stable/generated/torch.Tensor.backward.html' },
    ],
    introducedIn: 'autograd-backprop',
  },
  {
    term: 'nn.Module',
    slug: 'nn-module',
    category: 'PyTorch',
    definition: 'The base class for all PyTorch models and layers. Holds parameters, sub-modules, and the forward() method that defines computation.',
    links: [
      { title: 'PyTorch: nn.Module', url: 'https://pytorch.org/docs/stable/generated/torch.nn.Module.html' },
    ],
    introducedIn: 'nn-module-training',
  },
  {
    term: 'torch.compile',
    slug: 'torch-compile',
    category: 'PyTorch',
    definition: 'PyTorch 2\'s JIT compiler. Captures a graph via TorchDynamo, lowers it with TorchInductor to fused Triton/C++ kernels, often delivering 1.3-2x training speedups.',
    links: [
      { title: 'PyTorch 2.0 Get Started', url: 'https://pytorch.org/get-started/pytorch-2.0/' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'DDP',
    slug: 'ddp',
    category: 'PyTorch',
    definition: 'DistributedDataParallel — replicates the model on every GPU, all-reduces gradients each step. The default multi-GPU strategy when the model fits on one GPU.',
    aliases: ['DistributedDataParallel'],
    links: [
      { title: 'PyTorch: DDP', url: 'https://pytorch.org/tutorials/intermediate/ddp_tutorial.html' },
    ],
  },
  {
    term: 'FSDP',
    slug: 'fsdp',
    category: 'PyTorch',
    definition: 'Fully Sharded Data Parallel — shards parameters, gradients and optimizer states across ranks. Required when a single model copy no longer fits on one GPU.',
    links: [
      { title: 'PyTorch FSDP Tutorial', url: 'https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Training
  // ---------------------------------------------------------------------------
  {
    term: 'loss function',
    slug: 'loss-function',
    category: 'Training',
    definition: 'A scalar function that measures how wrong the model is on a batch. Training minimizes it via gradient descent.',
    aliases: ['Loss function'],
    links: [
      { title: 'Wikipedia: Loss function', url: 'https://en.wikipedia.org/wiki/Loss_function' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'cross-entropy loss',
    slug: 'cross-entropy',
    category: 'Training',
    definition: 'The standard classification loss: -log P(correct class). For LLMs this is the per-token next-word-prediction loss; minimizing it is equivalent to maximum likelihood.',
    aliases: ['cross-entropy', 'cross-entropy loss', 'Cross-entropy'],
    links: [
      { title: 'PyTorch: nn.CrossEntropyLoss', url: 'https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html' },
      { title: 'Wikipedia: Cross-entropy', url: 'https://en.wikipedia.org/wiki/Cross-entropy' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'softmax',
    slug: 'softmax',
    category: 'Training',
    definition: 'Turns a vector of real-valued logits into a probability distribution: p_i = exp(x_i) / Σ exp(x_j). Used at the head of every classifier and inside attention.',
    aliases: ['Softmax'],
    links: [
      { title: 'Wikipedia: Softmax function', url: 'https://en.wikipedia.org/wiki/Softmax_function' },
    ],
    introducedIn: 'qkv-deep-dive',
  },
  {
    term: 'optimizer',
    slug: 'optimizer',
    category: 'Training',
    definition: 'The algorithm that updates parameters using gradients (SGD, Adam, AdamW, Lion, Shampoo). Lives outside the model in PyTorch and steps after backward().',
    aliases: ['Optimizer'],
    links: [
      { title: 'PyTorch: torch.optim', url: 'https://pytorch.org/docs/stable/optim.html' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'SGD',
    slug: 'sgd',
    category: 'Training',
    definition: 'Stochastic Gradient Descent — the simplest optimizer: w ← w − η · g. With momentum and weight decay it remains competitive for vision models.',
    aliases: ['Stochastic Gradient Descent'],
    links: [
      { title: 'PyTorch: SGD', url: 'https://pytorch.org/docs/stable/generated/torch.optim.SGD.html' },
      { title: 'Wikipedia: SGD', url: 'https://en.wikipedia.org/wiki/Stochastic_gradient_descent' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'Adam',
    slug: 'adam',
    category: 'Training',
    definition: 'Adaptive Moment Estimation — keeps EMAs of the gradient and its square per parameter, scaling the step by 1/√v. Robust default for many problems.',
    links: [
      { title: 'Adam paper (Kingma & Ba 2014)', url: 'https://arxiv.org/abs/1412.6980' },
      { title: 'PyTorch: Adam', url: 'https://pytorch.org/docs/stable/generated/torch.optim.Adam.html' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'AdamW',
    slug: 'adamw',
    category: 'Training',
    definition: 'Adam with decoupled weight decay (Loshchilov & Hutter 2017). Applies weight decay separately from the gradient update — the de-facto default for LLM training.',
    links: [
      { title: 'AdamW paper', url: 'https://arxiv.org/abs/1711.05101' },
      { title: 'PyTorch: AdamW', url: 'https://pytorch.org/docs/stable/generated/torch.optim.AdamW.html' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'learning rate',
    slug: 'learning-rate',
    category: 'Training',
    definition: 'The step size η multiplying the gradient in a parameter update. The single most-tuned hyperparameter; usually scheduled (warmup + cosine decay).',
    aliases: ['lr'],
    links: [
      { title: 'Wikipedia: Learning rate', url: 'https://en.wikipedia.org/wiki/Learning_rate' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'mixed precision',
    slug: 'mixed-precision',
    category: 'Training',
    definition: 'Training with FP16 or BF16 weights/activations and FP32 master weights and reductions. Halves memory, ~2x speedup on Tensor Cores.',
    aliases: ['Mixed Precision', 'mixed-precision'],
    links: [
      { title: 'Mixed Precision Training paper', url: 'https://arxiv.org/abs/1710.03740' },
    ],
    introducedIn: 'cuda-mixed-precision',
  },
  {
    term: 'autocast',
    slug: 'autocast',
    category: 'Training',
    definition: 'PyTorch context manager that automatically chooses FP16/BF16 for each op based on a safe-cast list. The user-facing API for mixed precision.',
    links: [
      { title: 'PyTorch: torch.cuda.amp.autocast', url: 'https://pytorch.org/docs/stable/amp.html' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'GradScaler',
    slug: 'gradscaler',
    category: 'Training',
    definition: 'Companion to autocast for FP16 training: multiplies the loss by a large factor before backward to keep small gradients out of the underflow zone, then unscales before the step.',
    links: [
      { title: 'PyTorch: torch.cuda.amp.GradScaler', url: 'https://pytorch.org/docs/stable/amp.html#torch.cuda.amp.GradScaler' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'gradient checkpointing',
    slug: 'gradient-checkpointing',
    category: 'Training',
    definition: 'Trade compute for memory: drop activations during the forward pass and recompute them during backward. Cuts activation memory ~sqrt(N) for N layers.',
    links: [
      { title: 'Chen et al. 2016', url: 'https://arxiv.org/abs/1604.06174' },
      { title: 'PyTorch: torch.utils.checkpoint', url: 'https://pytorch.org/docs/stable/checkpoint.html' },
    ],
  },
  {
    term: 'LayerNorm',
    slug: 'layernorm',
    category: 'Training',
    definition: 'Layer Normalization (Ba et al. 2016): normalize each token vector to mean 0, variance 1, then scale/shift by learned γ, β. Standard inside transformer blocks.',
    aliases: ['Layer Normalization', 'layer normalization', 'Layer Norm'],
    links: [
      { title: 'Ba et al. 2016', url: 'https://arxiv.org/abs/1607.06450' },
      { title: 'PyTorch: LayerNorm', url: 'https://pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'RMSNorm',
    slug: 'rmsnorm',
    category: 'Training',
    definition: 'Root Mean Square Norm — LayerNorm without the mean subtraction. Cheaper, equally effective for transformers; used by Llama, Mistral, DeepSeek.',
    links: [
      { title: 'Zhang & Sennrich 2019', url: 'https://arxiv.org/abs/1910.07467' },
    ],
    introducedIn: 'modern-llm-arch',
  },
  {
    term: 'GELU',
    slug: 'gelu',
    category: 'Training',
    definition: 'Gaussian Error Linear Unit: x · Φ(x). Smooth, slightly-curved alternative to ReLU; used in BERT and GPT-2/3.',
    links: [
      { title: 'Hendrycks & Gimpel 2016', url: 'https://arxiv.org/abs/1606.08415' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'SwiGLU',
    slug: 'swiglu',
    category: 'Training',
    definition: 'Swish-Gated Linear Unit: (Swish(xW) ⊙ xV)W₂. The FFN variant used in Llama, PaLM, and most 2023+ models — 1-2% perplexity improvement for free.',
    aliases: ['SwiGLU FFN'],
    links: [
      { title: 'Shazeer 2020 — GLU Variants', url: 'https://arxiv.org/abs/2002.05202' },
    ],
    introducedIn: 'modern-llm-arch',
  },

  // ---------------------------------------------------------------------------
  // LLM architecture
  // ---------------------------------------------------------------------------
  {
    term: 'transformer',
    slug: 'transformer',
    category: 'LLM architecture',
    definition: 'The neural-net architecture (Vaswani et al. 2017) that replaced RNNs for sequence modeling. Stacks of self-attention + FFN with residual connections.',
    aliases: ['Transformer'],
    links: [
      { title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762' },
      { title: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
    ],
    introducedIn: 'tiny-transformer',
  },
  {
    term: 'embedding',
    slug: 'embedding',
    category: 'LLM architecture',
    definition: 'A learned lookup table that maps each token id to a dense vector. The transformer\'s vocabulary projected into model space.',
    aliases: ['embeddings', 'Embed', 'embedding layer'],
    links: [
      { title: 'PyTorch: nn.Embedding', url: 'https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html' },
    ],
    introducedIn: 'llm-building-blocks',
  },
  {
    term: 'positional encoding',
    slug: 'positional-encoding',
    category: 'LLM architecture',
    definition: 'Information added to token embeddings so the (permutation-invariant) attention mechanism knows their order. Sinusoidal, learned, ALiBi, or RoPE.',
    links: [
      { title: 'Attention Is All You Need (§3.5)', url: 'https://arxiv.org/abs/1706.03762' },
    ],
    introducedIn: 'llm-building-blocks',
  },
  {
    term: 'RoPE',
    slug: 'rope',
    category: 'LLM architecture',
    definition: 'Rotary Position Embedding — rotates Q and K vectors by an angle proportional to position. Encodes relative position natively; the standard in modern LLMs.',
    aliases: ['Rotary Position Embeddings', 'rotary embeddings'],
    links: [
      { title: 'RoFormer (Su et al. 2021)', url: 'https://arxiv.org/abs/2104.09864' },
    ],
    introducedIn: 'modern-llm-arch',
  },
  {
    term: 'MoE',
    slug: 'moe',
    category: 'LLM architecture',
    definition: 'Mixture of Experts — replace each FFN with N experts and route each token to top-k of them via a learned gate. Decouples parameter count from per-token FLOPs.',
    aliases: ['Mixture of Experts'],
    links: [
      { title: 'Switch Transformer (Fedus et al. 2021)', url: 'https://arxiv.org/abs/2101.03961' },
      { title: 'Mixtral 8x7B', url: 'https://arxiv.org/abs/2401.04088' },
    ],
    introducedIn: 'moe-mla',
  },
  {
    term: 'MLA',
    slug: 'mla',
    category: 'LLM architecture',
    definition: 'Multi-head Latent Attention — DeepSeek-V2/V3\'s trick: project K and V down to a small shared latent, cache only the latent. ~6x smaller KV cache.',
    aliases: ['Multi-head Latent Attention'],
    links: [
      { title: 'DeepSeek-V2 paper', url: 'https://arxiv.org/abs/2405.04434' },
    ],
    introducedIn: 'moe-mla',
  },

  // ---------------------------------------------------------------------------
  // Attention
  // ---------------------------------------------------------------------------
  {
    term: 'attention',
    slug: 'attention',
    category: 'Attention',
    definition: 'A mechanism that lets each token aggregate information from other tokens, weighted by learned similarity. The defining op of the transformer.',
    aliases: ['Attention', 'self-attention', 'Self-Attention'],
    links: [
      { title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762' },
    ],
    introducedIn: 'llm-building-blocks',
  },
  {
    term: 'query',
    slug: 'query',
    category: 'Attention',
    definition: 'In attention, the projection that asks "what am I looking for?". One Q vector per token; matched against every K to produce scores.',
    aliases: ['Query', 'Q (Query)'],
    links: [
      { title: 'Illustrated Transformer: Self-Attention', url: 'https://jalammar.github.io/illustrated-transformer/' },
    ],
    introducedIn: 'qkv-deep-dive',
  },
  {
    term: 'key',
    slug: 'key',
    category: 'Attention',
    definition: 'In attention, the projection that says "this is what I contain". Compared against the query via dot product; the result is the attention score.',
    aliases: ['Key', 'K (Key)'],
    links: [
      { title: 'Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
    ],
    introducedIn: 'qkv-deep-dive',
  },
  {
    term: 'value',
    slug: 'value',
    category: 'Attention',
    definition: 'In attention, the projection that says "what to return if attended to". The output is the softmax-weighted sum of V vectors.',
    aliases: ['Value', 'V (Value)'],
    links: [
      { title: 'Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
    ],
    introducedIn: 'qkv-deep-dive',
  },
  {
    term: 'multi-head attention',
    slug: 'multi-head-attention',
    category: 'Attention',
    definition: 'Run attention H times in parallel with different learned Q/K/V projections, then concatenate. Lets each head specialize (syntax, position, semantics, ...).',
    aliases: ['Multi-Head Attention', 'MHA'],
    links: [
      { title: 'Attention Is All You Need (§3.2.2)', url: 'https://arxiv.org/abs/1706.03762' },
    ],
    introducedIn: 'attention-deeper',
  },
  {
    term: 'GQA',
    slug: 'gqa',
    category: 'Attention',
    definition: 'Grouped Query Attention — H query heads share G < H key/value heads. Closer to MHA quality than MQA, with a 4-8x smaller KV cache. Used by Llama 2/3.',
    aliases: ['Grouped Query Attention'],
    links: [
      { title: 'Ainslie et al. 2023', url: 'https://arxiv.org/abs/2305.13245' },
    ],
    introducedIn: 'modern-llm-arch',
  },
  {
    term: 'KV cache',
    slug: 'kv-cache',
    category: 'Attention',
    definition: 'During autoregressive decoding, cache K and V tensors from previous tokens so each new token only needs one Q projection and one O(L) attention step.',
    aliases: ['KV Cache'],
    links: [
      { title: 'Hugging Face: KV Cache', url: 'https://huggingface.co/docs/transformers/main/en/llm_tutorial_optimization#21-key-value-cache' },
    ],
    introducedIn: 'attention-deeper',
  },
  {
    term: 'cross-attention',
    slug: 'cross-attention',
    category: 'Attention',
    definition: 'Attention where Q comes from one sequence and K, V from another. The decoder-to-encoder bridge in seq2seq transformers and the basis of many multimodal models.',
    aliases: ['Cross-attention'],
    links: [
      { title: 'Attention Is All You Need (§3.2.3)', url: 'https://arxiv.org/abs/1706.03762' },
    ],
    introducedIn: 'attention-deeper',
  },
  {
    term: 'Flash Attention',
    slug: 'flash-attention',
    category: 'Attention',
    definition: 'A tiled, fused attention kernel by Tri Dao that keeps the softmax intermediates in SRAM. 2-4x faster than naive attention with O(N) instead of O(N²) memory.',
    aliases: ['FlashAttention', 'Flash Attention 2/3', 'FlashAttention-2'],
    links: [
      { title: 'Dao et al. 2022 — FlashAttention', url: 'https://arxiv.org/abs/2205.14135' },
      { title: 'FlashAttention-2', url: 'https://arxiv.org/abs/2307.08691' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Inference
  // ---------------------------------------------------------------------------
  {
    term: 'prefill',
    slug: 'prefill',
    category: 'Inference',
    definition: 'The first phase of LLM serving: process the entire prompt in one big matmul to populate the KV cache. Compute-bound; dominated by GEMM throughput.',
    aliases: ['Prefill'],
    links: [
      { title: 'PagedAttention paper (§2.1)', url: 'https://arxiv.org/abs/2309.06180' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'decode',
    slug: 'decode',
    category: 'Inference',
    definition: 'The per-token generation phase. One Q-vector against the cached K/V — memory-bound (GEMV); the reason LLM inference is bandwidth- not flops-limited.',
    aliases: ['Decode', 'decoding'],
    links: [
      { title: 'Pope et al. 2022 — Efficient Inference', url: 'https://arxiv.org/abs/2211.05102' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'continuous batching',
    slug: 'continuous-batching',
    category: 'Inference',
    definition: 'Insert and evict requests at every iteration instead of waiting for a whole batch to finish. Originated in the Orca paper; the foundation of vLLM-style throughput.',
    aliases: ['Continuous batching'],
    links: [
      { title: 'Orca (OSDI 2022)', url: 'https://www.usenix.org/conference/osdi22/presentation/yu' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'static batching',
    slug: 'static-batching',
    category: 'Inference',
    definition: 'Old-school batching: gather N requests, run them together, return when the slowest finishes. Catastrophic for LLMs where lengths vary 10x.',
    aliases: ['Static batching'],
    links: [
      { title: 'Orca paper §2 (motivation)', url: 'https://www.usenix.org/conference/osdi22/presentation/yu' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'PagedAttention',
    slug: 'pagedattention',
    category: 'Inference',
    definition: 'The vLLM trick: allocate the KV cache in fixed-size blocks (like OS pages) and look up the per-request page table inside the attention kernel. Near-zero memory waste.',
    aliases: ['Paged attention'],
    links: [
      { title: 'Kwon et al. 2023 — PagedAttention', url: 'https://arxiv.org/abs/2309.06180' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'speculative decoding',
    slug: 'speculative-decoding',
    category: 'Inference',
    definition: 'Use a small "draft" model to propose K tokens, then verify them in parallel with one forward of the big model. Accepts the longest matching prefix.',
    aliases: ['Speculative decoding'],
    links: [
      { title: 'Leviathan et al. 2022', url: 'https://arxiv.org/abs/2211.17192' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'draft model',
    slug: 'draft-model',
    category: 'Inference',
    definition: 'The small companion model in speculative decoding that proposes tokens cheaply. Usually a 1B model paired with a 70B target.',
    aliases: ['Vanilla draft model'],
    links: [
      { title: 'Speculative Sampling (Chen et al. 2023)', url: 'https://arxiv.org/abs/2302.01318' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'Medusa',
    slug: 'medusa',
    category: 'Inference',
    definition: 'A speculative-decoding scheme that adds parallel prediction heads to the target model itself, eliminating the need for a separate draft model.',
    links: [
      { title: 'Medusa (Cai et al. 2024)', url: 'https://arxiv.org/abs/2401.10774' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'EAGLE',
    slug: 'eagle',
    category: 'Inference',
    definition: 'A more accurate self-speculation method that uses one extra layer to predict the next embedding, then trees out candidates. 2-3x throughput uplift over greedy.',
    links: [
      { title: 'EAGLE paper', url: 'https://arxiv.org/abs/2401.15077' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'vLLM',
    slug: 'vllm',
    category: 'Inference',
    definition: 'A high-throughput LLM serving engine built around PagedAttention and continuous batching. The most-deployed open-source inference stack.',
    links: [
      { title: 'vLLM', url: 'https://github.com/vllm-project/vllm' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'SGLang',
    slug: 'sglang',
    category: 'Inference',
    definition: 'A serving engine that adds RadixAttention (prefix sharing across requests) and a structured-output DSL. Often outperforms vLLM on agent/RAG workloads.',
    links: [
      { title: 'SGLang', url: 'https://github.com/sgl-project/sglang' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'TGI',
    slug: 'tgi',
    category: 'Inference',
    definition: 'Hugging Face Text Generation Inference — a Rust-based serving stack. Optimized for the HF ecosystem and HF model formats.',
    aliases: ['Text Generation Inference'],
    links: [
      { title: 'TGI', url: 'https://github.com/huggingface/text-generation-inference' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'TensorRT-LLM',
    slug: 'tensorrt-llm',
    category: 'Inference',
    definition: 'NVIDIA\'s closed-source LLM serving stack on top of TensorRT. Compiles models to fused kernels and gives the best per-GPU latency on Hopper/Blackwell.',
    links: [
      { title: 'TensorRT-LLM', url: 'https://github.com/NVIDIA/TensorRT-LLM' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'RadixAttention',
    slug: 'radixattention',
    category: 'Inference',
    definition: 'SGLang\'s technique of storing KV-cache pages in a radix tree so multiple requests with a shared prompt prefix automatically share the prefix\'s KV blocks.',
    links: [
      { title: 'SGLang paper', url: 'https://arxiv.org/abs/2312.07104' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'temperature',
    slug: 'temperature',
    category: 'Inference',
    definition: 'A scalar divisor on logits before softmax. Higher T flattens the distribution (more random); T → 0 approaches argmax (greedy).',
    aliases: ['Temperature'],
    links: [
      { title: 'Hugging Face: Generation Strategies', url: 'https://huggingface.co/docs/transformers/main/en/generation_strategies' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'top-k sampling',
    slug: 'top-k',
    category: 'Inference',
    definition: 'Truncate the softmax to the top K most-likely tokens, renormalize, then sample. Bounds the worst-case sampling cost; commonly K=40 or 50.',
    aliases: ['top-k', 'Top-k'],
    links: [
      { title: 'HF: top-k sampling', url: 'https://huggingface.co/blog/how-to-generate' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'top-p sampling',
    slug: 'top-p',
    category: 'Inference',
    definition: 'Nucleus sampling — keep the smallest set of tokens whose cumulative probability ≥ p (e.g. 0.9), renormalize, sample. Adapts the truncation to the distribution.',
    aliases: ['top-p', 'Top-p', 'nucleus sampling'],
    links: [
      { title: 'Holtzman et al. 2019', url: 'https://arxiv.org/abs/1904.09751' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'beam search',
    slug: 'beam-search',
    category: 'Inference',
    definition: 'Keep the top-B partial hypotheses at each step instead of just the best one. Standard for translation and summarization; rarely used for chat.',
    links: [
      { title: 'Wikipedia: Beam search', url: 'https://en.wikipedia.org/wiki/Beam_search' },
    ],
    introducedIn: 'training-inference-details',
  },
  {
    term: 'TTFT',
    slug: 'ttft',
    category: 'Inference',
    definition: 'Time To First Token — latency from request arrival to the first generated token. Dominated by prefill cost; user-perceived "responsiveness".',
    aliases: ['Time To First Token', 'TTFT (Time To First Token)'],
    links: [
      { title: 'vLLM Performance Metrics', url: 'https://docs.vllm.ai/en/latest/dev/profiling/profiling_index.html' },
    ],
    introducedIn: 'inference-batching-vllm',
  },
  {
    term: 'TPOT',
    slug: 'tpot',
    category: 'Inference',
    definition: 'Time Per Output Token — steady-state ms/token in the decode phase. Bandwidth-bound; the main lever is KV-cache bandwidth and batch size.',
    aliases: ['TPOT (Time Per Output Token)'],
    links: [
      { title: 'Anthropic on streaming throughput', url: 'https://docs.anthropic.com/en/docs/build-with-claude/streaming' },
    ],
    introducedIn: 'inference-batching-vllm',
  },

  // ---------------------------------------------------------------------------
  // Apple MPS
  // ---------------------------------------------------------------------------
  {
    term: 'MPS',
    slug: 'mps',
    category: 'Apple MPS',
    definition: 'Metal Performance Shaders — Apple\'s GPU-compute framework on Metal. PyTorch ships an MPS backend that maps tensor ops to Metal kernels.',
    aliases: ['Metal Performance Shaders'],
    links: [
      { title: 'Apple: Metal Performance Shaders', url: 'https://developer.apple.com/documentation/metalperformanceshaders' },
      { title: 'PyTorch MPS backend', url: 'https://pytorch.org/docs/stable/notes/mps.html' },
    ],
    introducedIn: 'mps-apple-gpu-architecture',
  },
  {
    term: 'Metal',
    slug: 'metal',
    category: 'Apple MPS',
    definition: 'Apple\'s low-level GPU API (graphics + compute). The Apple equivalent of Vulkan/DirectX12 + CUDA combined into one framework.',
    links: [
      { title: 'Apple: Metal', url: 'https://developer.apple.com/metal/' },
    ],
    introducedIn: 'mps-apple-gpu-architecture',
  },
  {
    term: 'Metal Shading Language',
    slug: 'msl',
    category: 'Apple MPS',
    definition: 'The C++14-based language for writing Metal shaders/kernels. Compiled to Apple\'s GPU ISA at build time or via torch.mps.compile_shader at runtime.',
    aliases: ['MSL', 'Metal Shading Language (MSL)'],
    links: [
      { title: 'Metal Shading Language Spec', url: 'https://developer.apple.com/metal/Metal-Shading-Language-Specification.pdf' },
    ],
    introducedIn: 'mps-metal-shaders',
  },
  {
    term: 'MLX',
    slug: 'mlx',
    category: 'Apple MPS',
    definition: 'Apple\'s NumPy-flavoured array framework built natively for unified memory with lazy evaluation. Excellent for inference and fine-tuning on Apple Silicon.',
    links: [
      { title: 'MLX on GitHub', url: 'https://github.com/ml-explore/mlx' },
      { title: 'MLX Documentation', url: 'https://ml-explore.github.io/mlx/' },
    ],
    introducedIn: 'mps-mlx-framework',
  },
  {
    term: 'Apple Neural Engine',
    slug: 'ane',
    category: 'Apple MPS',
    definition: 'A dedicated neural-network accelerator on every Apple Silicon SoC. Invisible to PyTorch/MLX — reach it only via CoreML conversion.',
    aliases: ['ANE', 'Apple Neural Engine (ANE)'],
    links: [
      { title: 'Apple: Neural Engine', url: 'https://machinelearning.apple.com/research/neural-engine-transformers' },
    ],
    introducedIn: 'mps-ane-coreml-profiling',
  },
  {
    term: 'CoreML',
    slug: 'coreml',
    category: 'Apple MPS',
    definition: 'Apple\'s on-device inference framework. The only path to the ANE; converts PyTorch and TF models via coremltools.',
    links: [
      { title: 'Apple: Core ML', url: 'https://developer.apple.com/documentation/coreml' },
    ],
    introducedIn: 'mps-ane-coreml-profiling',
  },
  {
    term: 'threadgroup',
    slug: 'threadgroup',
    category: 'Apple MPS',
    definition: 'The Metal equivalent of a CUDA thread block — a group of threads that share threadgroup memory and can synchronize. Threadgroup memory ≈ CUDA shared memory.',
    links: [
      { title: 'Metal: Threadgroups', url: 'https://developer.apple.com/documentation/metal/calculating_threadgroup_and_grid_sizes' },
    ],
    introducedIn: 'mps-metal-shaders',
  },
  {
    term: 'simdgroup',
    slug: 'simdgroup',
    category: 'Apple MPS',
    definition: 'The Metal equivalent of a CUDA warp — a SIMD execution group (32 threads on Apple GPUs) with primitives like simd_shuffle and simd_sum.',
    links: [
      { title: 'Metal Shading Language: SIMD-Group Functions', url: 'https://developer.apple.com/documentation/metal/compute_passes/improving_compute_performance_with_simd_groups' },
    ],
    introducedIn: 'mps-metal-shaders',
  },
  {
    term: 'unified memory',
    slug: 'unified-memory',
    category: 'Apple MPS',
    definition: 'On Apple Silicon, CPU and GPU share the same physical DRAM with no copy required to "transfer" tensors between devices. Massive simplification vs discrete GPUs.',
    links: [
      { title: 'Apple: M1 Architecture', url: 'https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/' },
    ],
    introducedIn: 'mps-apple-gpu-architecture',
  },

  // ---------------------------------------------------------------------------
  // Reinforcement Learning
  // ---------------------------------------------------------------------------
  {
    term: 'state',
    slug: 'state',
    category: 'Reinforcement Learning',
    definition: 'The agent\'s observation of the environment at a given time-step. In Snake, a vector summarizing snake position, food direction, and danger flags.',
    links: [
      { title: 'Sutton & Barto, Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'action',
    slug: 'action',
    category: 'Reinforcement Learning',
    definition: 'A choice the agent makes from a (typically discrete or continuous) action space. The output of the policy.',
    links: [
      { title: 'Sutton & Barto, Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'reward',
    slug: 'reward',
    category: 'Reinforcement Learning',
    definition: 'The scalar feedback signal from the environment after an action. The agent\'s only learning signal — design it carefully.',
    aliases: ['Reward'],
    links: [
      { title: 'Sutton & Barto, Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'policy',
    slug: 'policy',
    category: 'Reinforcement Learning',
    definition: 'The mapping π(a|s) from states to action probabilities. The thing RL is ultimately trying to learn.',
    aliases: ['Policy'],
    links: [
      { title: 'Sutton & Barto, Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'value function',
    slug: 'value-function',
    category: 'Reinforcement Learning',
    definition: 'V(s) — the expected discounted return starting from state s under the current policy. The thing TD-learning estimates.',
    aliases: ['Value function'],
    links: [
      { title: 'Sutton & Barto, Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'Q-function',
    slug: 'q-function',
    category: 'Reinforcement Learning',
    definition: 'Q(s, a) — the expected return after taking action a in state s and following the policy afterwards. DQN learns this directly.',
    aliases: ['Action-value (Q) function', 'Q function'],
    links: [
      { title: 'Sutton & Barto, Ch. 6', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'discount factor',
    slug: 'discount-factor',
    category: 'Reinforcement Learning',
    definition: 'γ ∈ [0, 1] — how much the agent prefers near rewards over far ones. γ=0.99 is the typical "long-horizon but bounded" choice.',
    links: [
      { title: 'Sutton & Barto, Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'episode',
    slug: 'episode',
    category: 'Reinforcement Learning',
    definition: 'One full trajectory from start state to terminal state. In Snake: one game from spawn to death.',
    aliases: ['Episode'],
    links: [
      { title: 'Sutton & Barto, Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'Bellman equation',
    slug: 'bellman-equation',
    category: 'Reinforcement Learning',
    definition: 'Q(s, a) = r + γ · max_a\' Q(s\', a\'). The recursive consistency that every value-based RL algorithm minimizes the residual of.',
    aliases: ['Bellman optimality equation'],
    links: [
      { title: 'Wikipedia: Bellman equation', url: 'https://en.wikipedia.org/wiki/Bellman_equation' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'Q-learning',
    slug: 'q-learning',
    category: 'Reinforcement Learning',
    definition: 'The off-policy TD-control algorithm: update Q toward r + γ · max_a\' Q(s\', a\'). Converges to the optimal Q with enough exploration.',
    aliases: ['Q learning'],
    links: [
      { title: 'Watkins 1989 (original)', url: 'https://en.wikipedia.org/wiki/Q-learning' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'DQN',
    slug: 'dqn',
    category: 'Reinforcement Learning',
    definition: 'Deep Q-Network — Q-learning with a neural net Q-approximator, a replay buffer, and a periodically-updated target network. The 2015 Atari paper.',
    aliases: ['Deep Q-Network', 'Double DQN', 'Dueling DQN'],
    links: [
      { title: 'Mnih et al. 2015 (Nature)', url: 'https://www.nature.com/articles/nature14236' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'replay buffer',
    slug: 'replay-buffer',
    category: 'Reinforcement Learning',
    definition: 'A FIFO of past (s, a, r, s\') transitions. Breaking temporal correlation by sampling uniformly is what makes off-policy deep RL stable.',
    aliases: ['experience replay'],
    links: [
      { title: 'Mnih et al. 2015', url: 'https://www.nature.com/articles/nature14236' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'target network',
    slug: 'target-network',
    category: 'Reinforcement Learning',
    definition: 'A lagged copy of the Q-network used to compute the TD target. Stops the "chasing your own tail" instability of bootstrapping off a moving estimate.',
    links: [
      { title: 'Mnih et al. 2015', url: 'https://www.nature.com/articles/nature14236' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'ε-greedy',
    slug: 'epsilon-greedy',
    category: 'Reinforcement Learning',
    definition: 'With probability ε, take a random action; otherwise take argmax_a Q(s, a). The simplest exploration strategy.',
    aliases: ['epsilon-greedy', 'epsilon greedy'],
    links: [
      { title: 'Sutton & Barto, Ch. 2', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'on-policy',
    slug: 'on-policy',
    category: 'Reinforcement Learning',
    definition: 'Learning from data generated by the current policy (REINFORCE, PPO). Easier to make stable; lower sample efficiency.',
    links: [
      { title: 'Sutton & Barto, Ch. 5', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'off-policy',
    slug: 'off-policy',
    category: 'Reinforcement Learning',
    definition: 'Learning from data generated by a different (older or exploratory) policy (Q-learning, DQN, SAC). Higher sample efficiency; more failure modes.',
    links: [
      { title: 'Sutton & Barto, Ch. 5', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
    introducedIn: 'rl-snake',
  },
  {
    term: 'REINFORCE',
    slug: 'reinforce',
    category: 'Reinforcement Learning',
    definition: 'The original policy-gradient algorithm (Williams 1992). Updates θ ← θ + α · ∇log π(a|s) · G. The conceptual ancestor of PPO and TRPO.',
    links: [
      { title: 'Williams 1992', url: 'https://link.springer.com/article/10.1007/BF00992696' },
    ],
  },
  {
    term: 'policy gradient',
    slug: 'policy-gradient',
    category: 'Reinforcement Learning',
    definition: 'A family of algorithms that directly optimize the policy via ∇ E[return]. Natural fit for continuous action spaces; basis of PPO and SAC.',
    links: [
      { title: 'Sutton & Barto, Ch. 13', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    ],
  },
  {
    term: 'PPO',
    slug: 'ppo',
    category: 'Reinforcement Learning',
    definition: 'Proximal Policy Optimization — clip the policy ratio to keep updates small. The default RL algorithm in most domains, including RLHF.',
    aliases: ['Proximal Policy Optimization'],
    links: [
      { title: 'Schulman et al. 2017', url: 'https://arxiv.org/abs/1707.06347' },
    ],
  },
  {
    term: 'RLHF',
    slug: 'rlhf',
    category: 'Reinforcement Learning',
    definition: 'Reinforcement Learning from Human Feedback. Fit a reward model on human preferences, then fine-tune the LLM with PPO against it. The technique behind ChatGPT.',
    aliases: ['Reinforcement Learning from Human Feedback'],
    links: [
      { title: 'Ouyang et al. 2022 (InstructGPT)', url: 'https://arxiv.org/abs/2203.02155' },
    ],
  },
  {
    term: 'DPO',
    slug: 'dpo',
    category: 'Reinforcement Learning',
    definition: 'Direct Preference Optimization — closed-form alternative to RLHF that skips the reward model and PPO loop. Stable, simple, often matches PPO.',
    aliases: ['Direct Preference Optimization'],
    links: [
      { title: 'Rafailov et al. 2023', url: 'https://arxiv.org/abs/2305.18290' },
    ],
  },
  {
    term: 'reward model',
    slug: 'reward-model',
    category: 'Reinforcement Learning',
    definition: 'A model trained on (preferred, rejected) pairs of LLM outputs that predicts a scalar "human preference" score. The reward function used by RLHF.',
    links: [
      { title: 'InstructGPT paper §3', url: 'https://arxiv.org/abs/2203.02155' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Optimization (perf-related, cross-cutting)
  // ---------------------------------------------------------------------------
  {
    term: 'kernel fusion',
    slug: 'kernel-fusion',
    category: 'Optimization',
    definition: 'Combining several elementwise ops into one kernel so intermediates stay in registers and are never round-tripped through DRAM. torch.compile does this automatically.',
    links: [
      { title: 'TorchInductor explanation', url: 'https://pytorch.org/blog/inside-the-matrix/' },
    ],
  },
  {
    term: 'memory bound',
    slug: 'memory-bound',
    category: 'Optimization',
    definition: 'A kernel whose runtime is limited by memory bandwidth, not arithmetic. Below the diagonal slope of the roofline; speedups come from reducing bytes moved, not flops.',
    aliases: ['memory-bound', 'bandwidth-bound'],
    links: [
      { title: 'Roofline Model overview', url: 'https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html#math-mem' },
    ],
    introducedIn: 'cuda-performance',
  },
  {
    term: 'compute bound',
    slug: 'compute-bound',
    category: 'Optimization',
    definition: 'A kernel whose runtime is limited by FLOPs, not memory. To the right of the roofline ridge; speedups come from faster math (e.g. Tensor Cores, lower precision).',
    aliases: ['compute-bound', 'Compute-bound kernels'],
    links: [
      { title: 'NVIDIA Performance Background', url: 'https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html' },
    ],
    introducedIn: 'cuda-performance',
  },
  {
    term: 'launch overhead',
    slug: 'launch-overhead',
    category: 'Optimization',
    definition: 'The fixed CPU cost (~5-10 µs) of launching a CUDA kernel. Dominates LLM decode where each kernel does only a few µs of work — the reason CUDA Graphs exist.',
    aliases: ['kernel launch overhead'],
    links: [
      { title: 'NVIDIA: Launch Latency', url: 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#kernel-launch-overhead' },
    ],
    introducedIn: 'cuda-streams-graphs',
  },
]

// ----------------------------------------------------------------------------
// Build a lookup map keyed by lowercased term/alias → entry.
// Used by ModulePage.jsx to auto-linkify **bold** matches.
// ----------------------------------------------------------------------------
export const glossaryByTerm = (() => {
  const map = new Map()
  for (const entry of glossary) {
    const keys = [entry.term, ...(entry.aliases || [])]
    for (const k of keys) {
      // Normalize: lowercase, strip surrounding whitespace, drop a trailing
      // colon/period the way ModulePage's linkifier will when probing matches.
      const key = String(k).toLowerCase().trim().replace(/[:.]+$/, '')
      if (!map.has(key)) map.set(key, entry)
    }
  }
  return map
})()

// Distinct ordered category list — Glossary.jsx renders sections in this order.
export const glossaryCategories = [
  'GPU foundations',
  'CUDA',
  'Numeric formats',
  'PyTorch',
  'Training',
  'LLM architecture',
  'Attention',
  'Inference',
  'Apple MPS',
  'Reinforcement Learning',
  'Optimization',
]
