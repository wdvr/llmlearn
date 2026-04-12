import module1 from './modules/module1-pytorch-mps.json';
import module2 from './modules/module2-autograd.json';
import module3 from './modules/module3-nn-module.json';
import module4 from './modules/module4-building-blocks.json';
import module5 from './modules/module5-attention.json';
import module6 from './modules/module6-transformer.json';
import module7 from './modules/module7-training.json';
import module8 from './modules/module8-modern-arch.json';
import module9 from './modules/module9-moe-mla.json';

export const modules = [module1, module2, module3, module4, module5, module6, module7, module8, module9];

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
];
