// Manifest-only entries for the Apple Silicon GPU (MPS) course. Full module
// content (sections.content, quiz, exercise) is dynamic-imported on demand
// via loadModule(id) so each module ships in its own chunk.

export const modules = [
  {
    id: 'mps-apple-gpu-architecture',
    title: 'Apple GPU Architecture & MPS Basics',
    description: 'Master GPU acceleration on Apple Silicon with Metal Performance Shaders. Learn unified memory, device-agnostic patterns, the fp64 trap, and why MPS differs from CUDA at the hardware level.',
    sections: [
      { title: 'Why GPU Acceleration' },
      { title: 'MPS vs CUDA' },
      { title: 'Device-Agnostic Patterns' },
      { title: 'MPS Pitfalls & Synchronization' },
    ],
    loader: () => import('./mps-modules/mps01-apple-gpu-architecture.json'),
  },
  {
    id: 'mps-tensor-fundamentals',
    title: 'Tensor Fundamentals on MPS',
    description: 'Tensors, dtypes, and the precision-speed tradeoff — through the lens of Apple Silicon. Why bfloat16 wins on MPS, where the fp64 trap really comes from, and how to avoid silent dtype promotion bugs.',
    sections: [
      { title: 'What is a Tensor?' },
      { title: 'Tensor Operations: Creation, Indexing, Broadcasting' },
      { title: 'Floating-Point Dtypes' },
      { title: 'bfloat16 vs float16 on Apple Silicon' },
      { title: 'The fp64 Trap & Solutions' },
    ],
    loader: () => import('./mps-modules/mps02-tensor-fundamentals-on-mps.json'),
  },
  {
    id: 'mps-metal-shaders',
    title: 'Custom Metal Shaders via torch.mps.compile_shader',
    description: 'Write custom Metal Shading Language (MSL) kernels and dispatch them from PyTorch. Learn the Apple GPU\'s threadgroup model, simdgroup intrinsics, and how torch.mps.compile_shader bridges Python and Metal.',
    sections: [
      { title: 'Why Custom Kernels?' },
      { title: 'Metal Shading Language Basics' },
    ],
    loader: () => import('./mps-modules/mps03-metal-shaders.json'),
  },
  {
    id: 'mps-mlx-framework',
    title: 'MLX: Apple\'s Native ML Framework',
    description: 'MLX is Apple\'s NumPy-flavoured array framework built natively on unified memory with lazy evaluation. Learn when MLX beats PyTorch+MPS, how mx.eval() works, and the mlx-lm ecosystem for running Llama and Mistral on a Mac.',
    sections: [
      { title: 'Why MLX?' },
      { title: 'Lazy Evaluation & mx.eval()' },
    ],
    loader: () => import('./mps-modules/mps04-mlx-framework.json'),
  },
  {
    id: 'mps-ane-coreml-profiling',
    title: 'Apple Neural Engine, CoreML & Profiling on Apple Silicon',
    description: 'The Apple Neural Engine (ANE) is invisible to PyTorch and MLX — to reach it you go through CoreML. Learn the conversion path, heterogeneous CPU/GPU/ANE execution, and how to profile with Instruments and torch.mps.profiler.',
    sections: [
      { title: 'What is the Apple Neural Engine?' },
      { title: 'PyTorch -> CoreML -> ANE' },
    ],
    loader: () => import('./mps-modules/mps05-ane-coreml-profiling.json'),
  },
]

// Cache for full module content keyed by module id.
const moduleCache = new Map()

export async function loadModule(id) {
  if (moduleCache.has(id)) return moduleCache.get(id)
  const entry = modules.find(m => m.id === id)
  if (!entry) return null
  const mod = await entry.loader()
  const data = mod.default || mod
  moduleCache.set(id, data)
  return data
}

// Curated PRs related to the MPS backend. Moved here from modules.js as part
// of the 2 -> 3 course split.
export const curatedPRs = [
  {
    number: 77344,
    title: "Add MPS support for torch.linalg operations",
    description: "Adds Metal Performance Shaders kernels for core linear algebra operations. Good example of how MPS ops are implemented by wrapping Metal compute shaders.",
    tags: ['mps', 'linalg', 'kernel'],
    learningPoints: [
      "How MPS kernels are registered in PyTorch's dispatch system",
      "The pattern for implementing new MPS operations",
      "Testing strategy for MPS ops (comparison with CPU results)"
    ]
  },
  {
    number: 98495,
    title: "Improve MPS memory allocator efficiency",
    description: "Optimizes the Metal buffer allocation strategy to reduce memory fragmentation and improve reuse of allocated buffers.",
    tags: ['mps', 'memory', 'performance'],
    learningPoints: [
      "How PyTorch manages GPU memory on MPS",
      "Buffer pooling and caching strategies",
      "Unified memory considerations on Apple Silicon"
    ]
  },
  {
    number: 105372,
    title: "Enable torch.compile for MPS backend",
    description: "Adds initial torch.compile support for MPS, allowing graph-level optimizations for Metal GPU operations.",
    tags: ['mps', 'compile', 'optimization'],
    learningPoints: [
      "How torch.compile interacts with different backends",
      "Graph capture and optimization on MPS",
      "Limitations of current MPS compile support"
    ]
  },
  {
    number: 89231,
    title: "MPS: Add support for custom Metal shaders",
    description: "Enables users to write custom Metal Shading Language kernels and integrate them with PyTorch's MPS backend.",
    tags: ['mps', 'custom-ops', 'metal'],
    learningPoints: [
      "Metal Shading Language basics",
      "PyTorch custom op registration for MPS",
      "Performance comparison: custom vs built-in kernels"
    ]
  },
  {
    number: 112456,
    title: "Implement Flash Attention for MPS",
    description: "Ports the Flash Attention algorithm to Metal, significantly improving attention performance and memory usage on Apple Silicon.",
    tags: ['mps', 'attention', 'performance'],
    learningPoints: [
      "Flash Attention algorithm and tiling strategy",
      "Metal threadgroup memory management",
      "Benchmark methodology for attention implementations"
    ]
  }
]
