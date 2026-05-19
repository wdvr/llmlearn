// Manifest-only entries. Full module content (sections.content, quiz, exercise)
// is dynamic-imported on demand via loadModule(id) so it's split into a
// per-module chunk and not bundled into the main app chunk.

export const modules = [
  {
    id: 'tensors-devices',
    title: 'Tensors, Dtypes & Devices',
    description: 'The PyTorch starting line. What a tensor actually is, the dtypes you\'ll meet on day one, how devices (cpu / cuda / mps) and .to() work, and the copy-vs-view trap that causes a third of all PyTorch bugs.',
    sections: [
      { title: 'What Is a Tensor?' },
      { title: 'Creating Tensors' },
      { title: 'Dtypes: The Cheat Sheet' },
      { title: 'Devices: cpu, cuda, mps' },
      { title: 'Indexing, Slicing, and Broadcasting' },
      { title: 'Copy vs View: The Bug You\'ll Make Twice' },
    ],
    loader: () => import('./modules/module1-tensors-devices.json'),
    relatedModules: [
      { id: 'cuda-intro-gpu', note: 'Why GPU? The hardware reasons CPUs hit a wall.' },
      { id: 'mps-tensor-fundamentals', note: 'Same topic on Apple Silicon — fp64 trap and bf16.' },
    ],
  },
  {
    id: 'autograd-backprop',
    title: 'Autograd & Backpropagation',
    description: 'Understand how PyTorch builds computation graphs and computes gradients automatically. Master the chain rule and why gradient accumulation is not a bug—it\'s a feature.',
    sections: [
      { title: 'Automatic Differentiation, the Graph, and requires_grad' },
      { title: 'Manual Forward & Backward—The Chain Rule, by Hand' },
    ],
    loader: () => import('./modules/module2-autograd.json'),
  },
  {
    id: 'nn-module-training',
    title: 'nn.Module & Training Loop',
    description: 'Build your first neural network with nn.Module, understand how to organize model code, and write the canonical training loop that works with any PyTorch model.',
    sections: [
      { title: 'Your First nn.Module' },
      { title: 'The Canonical Training Loop' },
    ],
    loader: () => import('./modules/module3-nn-module.json'),
  },
  {
    id: 'llm-building-blocks',
    title: 'LLM Building Blocks',
    description: 'Master embeddings, positional encoding, and the self-attention mechanism that forms the heart of transformer models. Understand token representation, why attention is permutation-invariant, and the mathematical foundations of modern LLMs.',
    sections: [
      { title: 'Embeddings & Positional Encoding' },
      { title: 'Self-Attention Mechanism' },
    ],
    loader: () => import('./modules/module4-building-blocks.json'),
  },
  {
    id: 'qkv-deep-dive',
    title: 'Q, K, V from First Principles',
    description: 'The deep dive on Query, Key, Value — the three matrices at the heart of every transformer. What each one actually is, why three projections instead of one, the dot-product-as-similarity geometry, the √d_k trick, softmax temperature, and a hand-traced example you can verify against PyTorch.',
    sections: [
      { title: 'The One Question Q/K/V Answers' },
      { title: 'The Database Query Metaphor (Done Right)' },
      { title: 'Why Three Different Projections' },
      { title: 'Building Q, K, V Step by Step' },
      { title: 'The Dot Product as Similarity' },
      { title: 'Why Divide by √d_k' },
      { title: 'Worked Example by Hand' },
      { title: 'Common Bugs & Gotchas' },
      { title: 'From Single-Head to Multi-Head, Briefly' },
    ],
    loader: () => import('./modules/module4b-qkv-deep-dive.json'),
    relatedModules: [
      { id: 'attention-deeper', note: 'Multi-head, masking, and KV cache — built on the Q/K/V you just learned.' },
      { id: 'cuda-tiling-matmul', note: 'How the dot-product matmul actually runs on the GPU.' },
      { id: 'cuda-tensor-cores', note: 'Why FP16 attention is 5-10x faster: the QK^T matmul lands on Tensor Cores.' },
    ],
  },
  {
    id: 'attention-deeper',
    title: 'Attention, Deeper',
    description: 'Explore multi-head attention, cross-attention mechanisms, and KV caching for efficient inference. Understand how transformers achieve both representational power and computational efficiency.',
    sections: [
      { title: 'Multi-Head Attention' },
      { title: 'Cross-Attention & KV Cache' },
    ],
    loader: () => import('./modules/module5-attention.json'),
    relatedModules: [
      { id: 'cuda-tiling-matmul', note: 'How the matmul inside Q@K^T actually runs on the GPU.' },
      { id: 'cuda-tensor-cores', note: 'Why FP16/BF16 attention is 5-10x faster than FP32.' },
    ],
  },
  {
    id: 'tiny-transformer',
    title: 'Build a Tiny Transformer',
    description: 'Implement a complete transformer model from scratch. Build a nanoGPT-style architecture, understand the full forward pass from tokenization through training to text generation. This brings together all previous concepts into a working language model.',
    sections: [
      { title: 'Full Transformer Architecture' },
    ],
    loader: () => import('./modules/module6-transformer.json'),
    relatedModules: [
      { id: 'cuda-tiling-matmul', note: 'The kernel underneath every Linear layer.' },
      { id: 'mps-mlx-framework', note: 'A high-level transformer in MLX on Apple Silicon.' },
    ],
  },
  {
    id: 'training-inference-details',
    title: 'Training & Inference Details',
    description: 'Master the numerical foundations of LLM training: loss functions, optimizers, normalization, precision, and sampling strategies. Understand why certain architectural choices matter for performance and stability.',
    sections: [
      { title: 'Cross-entropy Loss for Language Models' },
      { title: 'Optimizers: SGD, Adam, AdamW' },
      { title: 'LayerNorm, Residuals, GELU' },
      { title: 'Mixed Precision on MPS' },
      { title: 'Sampling: Temperature, Top-k, Top-p' },
    ],
    loader: () => import('./modules/module7-training.json'),
    relatedModules: [
      { id: 'cuda-mixed-precision', note: 'The precision layer beneath autocast — why BF16 wins on Ampere+.' },
      { id: 'cuda-streams-graphs', note: 'How CUDA Graphs make your training and inference loops faster.' },
    ],
  },
  {
    id: 'modern-llm-arch',
    title: 'Modern LLM Architecture',
    description: 'Explore the architectural innovations that define state-of-the-art LLMs: rotary position embeddings, efficient normalization, gated linear units, and multi-query attention. Understand the "why" behind each design choice.',
    sections: [
      { title: 'RoPE: Rotary Position Embeddings' },
      { title: 'RMSNorm' },
      { title: 'SwiGLU FFN' },
      { title: 'GQA: Grouped Query Attention' },
    ],
    loader: () => import('./modules/module8-modern-arch.json'),
  },
  {
    id: 'moe-mla',
    title: 'Sparse & Efficient: MoE + MLA',
    description: 'Advanced efficiency techniques for trillion-parameter models. Learn how Mixture of Experts routes computation sparsely, and how Multi-head Latent Attention compresses KV tensors. Deep dive into DeepSeek V3 and Mixtral architectures.',
    sections: [
      { title: 'Mixture of Experts (MoE)' },
      { title: 'Multi-head Latent Attention (MLA)' },
    ],
    loader: () => import('./modules/module9-moe-mla.json'),
    relatedModules: [
      { id: 'cuda-tensor-cores', note: 'Tensor Cores at the FFN core of every MoE expert.' },
    ],
  },
  {
    id: 'inference-batching-vllm',
    title: 'LLM Inference: Batching, KV Cache, vLLM vs SGLang',
    description: 'How LLM inference actually scales. KV cache memory math, prefill vs decode, continuous batching, PagedAttention, vLLM vs SGLang vs TGI vs TensorRT-LLM, speculative decoding, FP8 quantization, and the full 2026 inference stack.',
    sections: [
      { title: 'Why Inference Is the Bottleneck' },
      { title: 'The KV Cache — Why It Exists and What It Costs' },
      { title: 'Static Batching and Why It Falls Apart' },
      { title: 'Continuous Batching — The Orca Insight' },
      { title: 'PagedAttention — The Real Contribution of vLLM' },
      { title: 'vLLM vs SGLang vs TGI vs TensorRT-LLM' },
      { title: 'Hands-On: Deploy vLLM in Docker' },
      { title: 'Speculative Decoding — Cheating the Memory Wall' },
      { title: 'Quantization — The Other Multiplier' },
      { title: 'The Full 2026 Inference Stack' },
    ],
    loader: () => import('./modules/module10-inference.json'),
    relatedModules: [
      { id: 'cuda-streams-graphs', note: 'CUDA Graphs — the per-token launch-overhead killer used by every serving engine.' },
      { id: 'cuda-mixed-precision', note: 'FP8 / INT4 quantization fundamentals, applied to inference.' },
      { id: 'attention-deeper', note: 'The KV cache mechanics in PyTorch — the layer beneath PagedAttention.' },
    ],
  },
  {
    id: 'capstone-e2e-llm',
    title: 'Capstone: End-to-End — Train, Compile, Serve a Tiny LLM',
    description: 'The flagship module. Train a ~10M-param Llama-style transformer on TinyStories (CUDA or MPS, your pick), write a custom Triton/torch.compile kernel, convert to HuggingFace format, then serve it with both vLLM and SGLang in Docker. Real endpoints you can curl. Step-debug every layer.',
    sections: [
      { title: "Welcome — What We're Going to Build, and Why" },
      { title: 'Get and Prep the Dataset (TinyStories → packed token bins)' },
      { title: 'The Model — A Llama-Style Transformer in ~150 Lines' },
      { title: 'Training Loop — Device Picker, AdamW, Cosine Schedule, torch.compile, MFU' },
      { title: 'Custom Kernel — Triton (CUDA) or torch.compile (MPS)' },
      { title: 'Convert to HuggingFace Format (so vLLM and SGLang can load it)' },
      { title: 'Serve with vLLM in Docker (PagedAttention + OpenAI API in 5 minutes)' },
      { title: 'Serve with SGLang in Docker (RadixAttention + structured generation)' },
      { title: 'Debugging the Full Stack (training → kernel → server → endpoint)' },
      { title: "What You Just Built — and What's Next" },
    ],
    loader: () => import('./modules/capstone-e2e-llm.json'),
    relatedModules: [
      { id: 'tiny-transformer', note: 'The smaller hand-built transformer this capstone scales up.' },
      { id: 'modern-llm-arch', note: 'RoPE, RMSNorm, SwiGLU — the modern bits used in the capstone model.' },
      { id: 'inference-batching-vllm', note: 'PagedAttention / continuous batching theory; the capstone is the practice.' },
      { id: 'cuda-tensor-cores', note: 'The hardware your training and inference are riding on.' },
      { id: 'mps-mlx-framework', note: 'The Apple Silicon equivalent if you picked the MPS path.' },
    ],
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
