// Manifest-only entries. Full module content (sections.content, quiz, exercise)
// is dynamic-imported on demand via loadModule(id) so it's split into a
// per-module chunk and not bundled into the main app chunk.

export const modules = [
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
    id: 'attention-deeper',
    title: 'Attention, Deeper',
    description: 'Explore multi-head attention, cross-attention mechanisms, and KV caching for efficient inference. Understand how transformers achieve both representational power and computational efficiency.',
    sections: [
      { title: 'Multi-Head Attention' },
      { title: 'Cross-Attention & KV Cache' },
    ],
    loader: () => import('./modules/module5-attention.json'),
  },
  {
    id: 'tiny-transformer',
    title: 'Build a Tiny Transformer',
    description: 'Implement a complete transformer model from scratch. Build a nanoGPT-style architecture, understand the full forward pass from tokenization through training to text generation. This brings together all previous concepts into a working language model.',
    sections: [
      { title: 'Full Transformer Architecture' },
    ],
    loader: () => import('./modules/module6-transformer.json'),
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
