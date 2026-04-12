import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MessageCircle, X, Send, Menu, Cpu, Book, Zap, Layers, Sparkles, Loader2, ExternalLink, Network } from 'lucide-react';

const LESSONS = [
  {
    module: "1. PyTorch on Apple MPS",
    icon: Cpu,
    items: [
      {
        title: "Device setup & MPS basics",
        theory: `PyTorch is a tensor library — at its core, it's NumPy with two superpowers: it can run on the GPU, and it can compute gradients automatically (Module 2).

**Why GPUs at all?** Deep learning is mostly **large matrix multiplications**. CPUs do these one element at a time; GPUs have thousands of small cores that work in parallel. A matmul that takes a CPU 10 seconds might take a GPU 50 milliseconds. That speedup is the entire reason modern AI is feasible at scale.

On NVIDIA hardware you go through CUDA. On Apple Silicon (M1 and up), you go through **MPS** — [Metal Performance Shaders](https://en.wikipedia.org/wiki/Metal_(API)), Apple's GPU compute API. PyTorch's MPS backend translates tensor ops into Metal kernels under the hood.

**Check what you've got:**
- \`torch.backends.mps.is_available()\` — does this machine support MPS?
- \`torch.backends.mps.is_built()\` — was your PyTorch compiled with MPS support?

**Operator coverage:** as of **PyTorch 2.11** (March 2026), MPS got a major [operator-coverage expansion](https://pytorch.org/blog/pytorch-2-11-release-blog/) — most things "just work" now. For older PyTorch versions or rare ops, set \`PYTORCH_ENABLE_MPS_FALLBACK=1\` and missing ops silently fall back to CPU instead of crashing. PyTorch 2.11 also added **async error reporting** on MPS, so out-of-bounds indexing actually raises (after \`torch.mps.synchronize()\`) instead of producing silent garbage.

**Differences from CUDA worth knowing:**
- No \`.cuda()\` — use \`.to("mps")\`, or write device-agnostic code (below)
- **fp64 (double) is not supported** on MPS — stick to fp32 or bf16
- Memory is **unified** with the CPU — host↔device copies are cheap, unlike a discrete GPU's PCIe round-trip
- One logical MPS device — no multi-GPU on a single Mac`,
        code: `import torch

# Pick the best available device
if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

print(f"Using: {device}")

# Create a tensor directly on MPS
x = torch.randn(1000, 1000, device=device)
y = torch.randn(1000, 1000, device=device)
z = x @ y  # matmul runs on the GPU
print(z.shape, z.device)`,
        references: [
          { title: "PyTorch MPS backend documentation", url: "https://pytorch.org/docs/stable/notes/mps.html" },
          { title: "PyTorch 2.11 release blog", url: "https://pytorch.org/blog/pytorch-2-11-release-blog/" },
          { title: "Wikipedia: GPGPU", url: "https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units" },
        ],
      },
      {
        title: "Tensors, dtypes, and the fp64 trap",
        theory: `A **tensor** is an n-dimensional array. A scalar is 0-d, a vector is 1-d, a matrix is 2-d, a batch of color images is 4-d (\`batch × channels × height × width\`). Every tensor has:

- a **shape** — how many elements per dimension
- a **dtype** — how each element is stored in bits
- a **device** — where it lives (cpu, mps, cuda)
- optionally a **gradient graph** (Module 2)

**Floating point dtypes** matter because the bit layout determines what numbers you can represent. From [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) and [bfloat16](https://en.wikipedia.org/wiki/Bfloat16_floating-point_format):

| dtype | bits | exponent | mantissa | use |
|---|---|---|---|---|
| fp32 | 32 | 8 | 23 | default; master weights |
| fp16 | 16 | 5 | 10 | inference; needs grad scaling for training |
| bf16 | 16 | 8 | 7 | modern training default |

**bf16 and fp16 both use 16 bits but allocate them differently.** bf16 matches fp32's exponent (huge range — gradients can't underflow) but has fewer mantissa bits. fp16 has more precision in its narrow range but tiny gradients become exact zero, which is why fp16 training needs gradient scaling. For training, **bf16 wins** — and it's supported on M2+.

**MPS gotcha:** \`torch.tensor([1.0, 2.0])\` defaults to fp32 on CPU. Move to MPS *before* heavy work, and never accidentally create fp64 — MPS will reject it.

\`\`\`
x.dtype         # torch.float32
x.device        # mps:0
x.shape         # torch.Size([...])
x.requires_grad # False by default
\`\`\``,
        code: `import torch

device = "mps"

# Good
a = torch.randn(4, 4, dtype=torch.float32, device=device)

# BAD on MPS — will error or fall back
# b = torch.randn(4, 4, dtype=torch.float64, device=device)

# Moving between devices
cpu_t = torch.arange(10)           # cpu, int64
gpu_t = cpu_t.float().to(device)   # mps, float32

# Back to CPU for inspection
print(gpu_t.cpu().numpy())

# Inspect bit layout
print(torch.finfo(torch.float32))  # range, eps, etc.
print(torch.finfo(torch.bfloat16))`,
        references: [
          { title: "Wikipedia: IEEE 754 floating point", url: "https://en.wikipedia.org/wiki/IEEE_754" },
          { title: "Wikipedia: bfloat16", url: "https://en.wikipedia.org/wiki/Bfloat16_floating-point_format" },
          { title: "PyTorch tensor docs", url: "https://pytorch.org/docs/stable/tensors.html" },
        ],
      },
    ],
  },
  {
    module: "2. Autograd & Backprop",
    icon: Zap,
    items: [
      {
        title: "Automatic differentiation, the graph, and requires_grad",
        theory: `Training a neural network means: given a loss function, **find the gradients of the loss with respect to every parameter**, then nudge the parameters in the direction that reduces the loss. The gradient calculation is the hard part — for a model with billions of parameters, you can't compute it by hand or symbolically.

**Automatic differentiation** ([wiki](https://en.wikipedia.org/wiki/Automatic_differentiation)) is the trick that makes this tractable. There are two flavors:
- **Forward mode**: compute derivatives alongside values, one input at a time. Cheap when you have few inputs and many outputs.
- **Reverse mode** (a.k.a. backpropagation): run the computation forward, *then* walk it backward using the [chain rule](https://en.wikipedia.org/wiki/Chain_rule). Cheap when you have many inputs and one output (loss). **This is what deep learning uses.**

**How PyTorch does it:** as you compute, autograd builds a **directed acyclic graph** (DAG) of every op. Tensors with \`requires_grad=True\` are leaves; ops are internal nodes. Each op records a small function that knows how to compute its local derivative. When you call \`.backward()\` on a scalar, autograd walks the DAG in reverse topological order, multiplying local derivatives via the chain rule, and **accumulates** the result into \`.grad\` on every leaf.

**Three things to know:**
1. \`.backward()\` only works on a **scalar** by default — because gradient direction is only well-defined when there's a single number to minimize. (You *can* pass an upstream gradient tensor for non-scalar outputs.)
2. **Gradients accumulate** in \`.grad\`. This isn't a bug — it lets you implement gradient accumulation across mini-batches. But it means you must \`zero_grad()\` between training steps, or your gradients will be the sum of every step you've taken.
3. The graph is **freed after backward** unless you pass \`retain_graph=True\`. PyTorch reclaims memory aggressively.

**Mental model for engineers:** think of it like a build system (Bazel, Make). The forward pass declares dependencies. Backward walks the dependency graph in reverse, applying a known transformation (the local derivative) at each node. PyTorch's autograd is a JIT differentiator over a dynamic graph.`,
        code: `import torch

x = torch.tensor(2.0, requires_grad=True)
y = torch.tensor(3.0, requires_grad=True)

# f(x, y) = x² * y + y
f = x**2 * y + y

f.backward()

# df/dx = 2xy     = 2*2*3 = 12
# df/dy = x² + 1  = 5
print(x.grad)  # tensor(12.)
print(y.grad)  # tensor(5.)

# Gradients accumulate — call again and watch them double
f2 = x**2 * y + y
f2.backward()
print(x.grad)  # tensor(24.)  -- accumulated!

# This is why training loops need opt.zero_grad()`,
        references: [
          { title: "Wikipedia: Automatic differentiation", url: "https://en.wikipedia.org/wiki/Automatic_differentiation" },
          { title: "Wikipedia: Backpropagation", url: "https://en.wikipedia.org/wiki/Backpropagation" },
          { title: "PyTorch autograd mechanics", url: "https://pytorch.org/docs/stable/notes/autograd.html" },
        ],
      },
      {
        title: "Manual forward & backward — the chain rule, by hand",
        theory: `To really *grok* backprop, do it by hand once. Consider a tiny one-layer neural network:

**Forward pass:**
\`\`\`
z  = x @ W + b      # linear projection
ŷ  = σ(z)           # sigmoid activation
L  = (ŷ - y)²       # squared error loss
\`\`\`

**Why these choices?**
- The linear layer \`x @ W + b\` is just an affine transform — a learned rotation/scaling/shift of the input.
- The [sigmoid](https://en.wikipedia.org/wiki/Sigmoid_function) \`σ(z) = 1/(1 + e^(-z))\` squashes any real number into (0, 1). Used historically for binary classification because it looks like a "soft step function." (Modern networks use ReLU/GELU/SwiGLU instead, but sigmoid is still useful for explanations.)
- Squared error is geometric: it's the squared distance between prediction and target. Differentiable, convex in ŷ, gradient is well-behaved.

**Backward pass — the chain rule.** The [chain rule](https://en.wikipedia.org/wiki/Chain_rule) says: if \`L = f(g(h(x)))\`, then \`dL/dx = f'(g(h(x))) · g'(h(x)) · h'(x)\`. Decompose L:

\`\`\`
dL/dŷ = 2(ŷ - y)              # derivative of squared error
dŷ/dz = σ(z)(1 - σ(z))         # derivative of sigmoid (a known result)
dz/dW = xᵀ                     # derivative of affine wrt weights
dz/db = 1                      # derivative of affine wrt bias
\`\`\`

Multiply them in the right order:

\`\`\`
dL/dW = dL/dŷ · dŷ/dz · dz/dW
dL/db = dL/dŷ · dŷ/dz · dz/db
\`\`\`

That's all backprop is — repeated chain rule, applied automatically by autograd to *arbitrary* graphs of millions of operations. The "magic" of training a billion-parameter LLM is exactly this, scaled up.

**Compare your hand derivation to autograd:** the code below shows that PyTorch's \`.backward()\` produces the same numbers you'd get manually. That's the contract — autograd gives you the chain rule for free.`,
        code: `import torch

torch.manual_seed(0)
device = "mps"

x = torch.randn(1, 3, device=device)
y = torch.tensor([[1.0]], device=device)

W = torch.randn(3, 1, device=device, requires_grad=True)
b = torch.zeros(1, device=device, requires_grad=True)

# Forward
z = x @ W + b
y_hat = torch.sigmoid(z)
loss = ((y_hat - y) ** 2).sum()

# Backward — autograd computes dL/dW and dL/db
loss.backward()

print("loss:", loss.item())
print("dL/dW:", W.grad)
print("dL/db:", b.grad)

# Verify by hand:
# dL/dy_hat   = 2 * (y_hat - y)
# dy_hat/dz   = y_hat * (1 - y_hat)
# dz/dW       = x.T
# dL/dW       = (dL/dy_hat * dy_hat/dz) * x.T
manual_dL_dz = 2 * (y_hat - y) * y_hat * (1 - y_hat)
manual_dL_dW = x.T @ manual_dL_dz
print("manual dL/dW:", manual_dL_dW)`,
        references: [
          { title: "Wikipedia: Chain rule", url: "https://en.wikipedia.org/wiki/Chain_rule" },
          { title: "Wikipedia: Sigmoid function", url: "https://en.wikipedia.org/wiki/Sigmoid_function" },
          { title: "3Blue1Brown: Backpropagation calculus", url: "https://www.3blue1brown.com/lessons/backpropagation-calculus" },
        ],
      },
    ],
  },
  {
    module: "3. nn.Module & Training",
    icon: Layers,
    items: [
      {
        title: "Your first nn.Module",
        theory: `\`nn.Module\` is the base class for every layer and every model. You inherit from it; PyTorch handles the bookkeeping.

**What it gives you:**
- **Parameter tracking**: anything you assign as \`self.layer = nn.Linear(...)\` or \`self.weight = nn.Parameter(...)\` is auto-registered. \`.parameters()\` then returns an iterator of every learnable tensor — exactly what the optimizer needs.
- **Device transfer**: \`.to(device)\` moves *all* parameters and registered buffers in one call.
- **Mode switching**: \`.train()\` and \`.eval()\` toggle behavior of layers like Dropout and BatchNorm (which behave differently during training vs inference).
- **State serialization**: \`.state_dict()\` returns a dict you can save with \`torch.save\` and reload elsewhere.

**Parameters vs buffers — important distinction:**
- \`nn.Parameter\`: a tensor that gets gradients and is updated by the optimizer (weights, biases).
- \`register_buffer(...)\`: a tensor that's part of the model state (saved/loaded, moved to device) but **does not** get gradients. Use this for things like attention masks, running BatchNorm statistics, or precomputed RoPE tables — anything the model needs but doesn't learn.

**Convention:** define layers in \`__init__\`, define the math in \`forward()\`. Never call \`.forward()\` directly — call the module itself (\`model(x)\`, not \`model.forward(x)\`). Calling the module triggers PyTorch hooks (used for debugging, profiling, distributed training, etc.).

**Why this abstraction?** Modules compose. A bigger model is just a Module that holds smaller Modules. The \`forward()\` of the parent calls the \`forward()\` of children. \`.parameters()\` recursively collects from all children. This is how you can write \`TinyGPT\` in 80 lines and still have it train end-to-end.`,
        code: `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, in_dim, hidden, out_dim):
        super().__init__()
        self.fc1 = nn.Linear(in_dim, hidden)
        self.fc2 = nn.Linear(hidden, out_dim)
        # Example of a buffer: not learned, but moves with .to(device)
        self.register_buffer("scale", torch.tensor(1.0))

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(x) * self.scale

model = MLP(10, 32, 2).to("mps")
print(model)
print("params:", sum(p.numel() for p in model.parameters()))

# Inspect what's learnable
for name, p in model.named_parameters():
    print(name, p.shape, "requires_grad =", p.requires_grad)`,
        references: [
          { title: "PyTorch nn.Module docs", url: "https://pytorch.org/docs/stable/generated/torch.nn.Module.html" },
          { title: "PyTorch tutorial: Build the neural network", url: "https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html" },
        ],
      },
      {
        title: "The canonical training loop",
        theory: `Every PyTorch training loop is the same five lines. Burn them into memory:

\`\`\`
optimizer.zero_grad()   # 1. clear old grads (they accumulate by default)
out  = model(x)         # 2. forward
loss = loss_fn(out, y)  # 3. compute scalar loss
loss.backward()         # 4. backward — fills .grad on every parameter
optimizer.step()        # 5. apply update: w -= lr * w.grad (or fancier)
\`\`\`

Miss \`zero_grad\` and gradients pile up across batches (you'll see loss explode). Miss \`backward\` and nothing updates. Miss \`step\` and weights never change. Miss any of them and you'll spend an hour debugging.

**Why batches at all?** Two reasons:
1. **Statistics**: a single example gives a noisy estimate of the true gradient. A batch averages out the noise. Larger batches → smoother gradients → can take larger steps.
2. **Hardware**: GPUs are wide. Processing 1 example uses ~1% of the GPU. Processing 64 in parallel uses ~64% with the same wall clock. Batching is *free* up to the point where you fill the GPU.

**The "stochastic" in [SGD](https://en.wikipedia.org/wiki/Stochastic_gradient_descent)** refers to the fact that we estimate the gradient from a small random batch rather than the entire dataset. The randomness is helpful — it can knock the optimizer out of bad local minima and into better ones.

**Implicit assumption: data is i.i.d.** (independent and identically distributed). If your batches are correlated — e.g., all examples are from the same class, or sequentially ordered in time — your gradient estimates are biased and training will be unstable. Always shuffle.

**Common bugs to check:**
- Forgot \`model.train()\` after evaluation → Dropout still active
- Forgot \`model.eval()\` during evaluation → noisy metrics
- Calling \`.item()\` inside the loop on a GPU tensor every step → forces a CPU sync, kills throughput
- Comparing \`loss\` (a tensor) to a float without \`.item()\` → builds an unintended autograd graph`,
        code: `import torch
import torch.nn as nn

device = "mps"
model  = nn.Linear(4, 1).to(device)
opt    = torch.optim.SGD(model.parameters(), lr=0.1)
loss_fn = nn.MSELoss()

# Fake data: y = 1 if sum(x) > 0 else 0
X = torch.randn(100, 4, device=device)
y = (X.sum(dim=1, keepdim=True) > 0).float()

model.train()
for step in range(200):
    opt.zero_grad()
    pred = model(X)
    loss = loss_fn(pred, y)
    loss.backward()
    opt.step()
    if step % 50 == 0:
        # .item() pulls a single scalar to CPU — cheap when used sparingly
        print(f"step {step}: loss={loss.item():.4f}")

model.eval()
with torch.no_grad():
    accuracy = ((model(X) > 0.5).float() == y).float().mean()
    print(f"accuracy: {accuracy.item():.2%}")`,
        references: [
          { title: "Wikipedia: Stochastic gradient descent", url: "https://en.wikipedia.org/wiki/Stochastic_gradient_descent" },
          { title: "PyTorch optimization tutorial", url: "https://pytorch.org/tutorials/beginner/basics/optimization_tutorial.html" },
        ],
      },
    ],
  },
  {
    module: "4. LLM Building Blocks",
    icon: Book,
    items: [
      {
        title: "Embeddings & positions",
        theory: `A language model never sees text — it sees integer **token IDs**. A tokenizer (BPE, SentencePiece, etc.) turns "hello world" into something like \`[15496, 995]\`. Inside the model, these IDs are useless on their own — they're arbitrary integers, not numbers with meaningful order.

**Embeddings convert integer IDs to vectors.** \`nn.Embedding(vocab_size, d_model)\` is just a giant lookup table: row \`i\` is the \`d_model\`-dimensional vector for token \`i\`. The vectors start as random noise and are **learned** during training, by gradient descent on the lookup table itself. After training, similar tokens end up close in vector space — this is the [distributional hypothesis](https://en.wikipedia.org/wiki/Distributional_semantics) made concrete: "you shall know a word by the company it keeps."

**Why this works:** the linear and attention layers downstream all consume vectors, and gradients flow back through the lookup. So the embedding layer learns whatever vector representation makes the rest of the model's job easiest.

**But tokens alone are orderless.** Self-attention (next lesson) is *permutation invariant* — without positional info, the model would treat "dog bites man" and "man bites dog" identically. We have to add information about *where* each token sits in the sequence.

**Simplest approach (GPT-2 era):** another embedding indexed by position (0, 1, 2, ...). Add it to the token embedding. Done. This is what TinyGPT in Module 5 uses.

**Final input to the transformer:** \`token_emb(ids) + pos_emb(positions)\`. Two lookups, one elementwise addition.

**Modern approach (Llama era):** **RoPE** — Rotary Position Embeddings. Doesn't add at the input; instead it rotates the Q and K vectors *inside* attention based on position. Better extrapolation, better long-context behavior. Covered in Module 7.`,
        code: `import torch
import torch.nn as nn

vocab_size = 65     # e.g. 65 unique chars
d_model    = 32
block_size = 8      # max sequence length

tok_emb = nn.Embedding(vocab_size, d_model)
pos_emb = nn.Embedding(block_size, d_model)

ids = torch.randint(0, vocab_size, (2, block_size))  # (B, T)
pos = torch.arange(block_size)                       # (T,)

x = tok_emb(ids) + pos_emb(pos)   # broadcasts to (B, T, d_model)
print(x.shape)                     # torch.Size([2, 8, 32])

# An embedding layer is literally just a lookup into a learnable matrix:
print(tok_emb.weight.shape)        # (vocab_size, d_model)
print(torch.allclose(tok_emb(torch.tensor(5)), tok_emb.weight[5]))  # True`,
        references: [
          { title: "Wikipedia: Word embedding", url: "https://en.wikipedia.org/wiki/Word_embedding" },
          { title: "Wikipedia: Distributional semantics", url: "https://en.wikipedia.org/wiki/Distributional_semantics" },
          { title: "word2vec paper (Mikolov et al., 2013)", url: "https://arxiv.org/abs/1301.3781" },
        ],
      },
      {
        title: "Self-attention, by hand",
        theory: `Self-attention is the heart of the transformer. Once you understand it, every other piece is mechanical.

**The problem it solves:** in a sequence of tokens, each token needs to look at the others to figure out what it means in context. The word "bank" means one thing near "river" and another near "money." How does each position pull in information from the right *other* positions?

**The answer:** for each token, compute a weighted average of all the other tokens, where the weights are *learned* and depend on the content of the tokens themselves. The word "bank" learns to put high weight on nearby financial vocabulary.

**The mechanism: three projections (Q, K, V).** From each input token vector \`x\`, compute three new vectors via three learned linear layers:
- **Query** (\`q = x @ W_q\`): "what am I looking for?"
- **Key** (\`k = x @ W_k\`): "what do I offer to others?"
- **Value** (\`v = x @ W_v\`): "what information will I contribute if attended to?"

**The database analogy:** think of a key-value store. Each token's K is the index, each token's V is the data. To query, you compare your Q against all the K's and pull a weighted blend of the V's. The blend weights are how well your Q matched each K.

**The math:**
\`\`\`
attn = softmax(Q @ Kᵀ / √d_k)   # (T, T) affinity matrix
out  = attn @ V                  # weighted sum of values
\`\`\`

- \`Q @ Kᵀ\` is the **dot product** between every Q and every K. Dot product is a similarity measure: it's large when two vectors point the same way. Geometrically it's \`|Q| · |K| · cos(angle)\`.
- \`/ √d_k\` is the **scaling** that gives attention its "scaled" name. Without it, dot products grow proportionally to \`d_k\` (variance of a sum of d_k random products), pushing the [softmax](https://en.wikipedia.org/wiki/Softmax_function) into the saturated region where gradients vanish. Dividing by \`√d_k\` keeps the variance at 1.
- \`softmax\` along the last dim turns the raw scores into a probability distribution that sums to 1. Differentiable, smooth, provides a "soft" selection over tokens.
- \`attn @ V\` is a weighted average — for each query position, blend the V's by the attention weights.

**The causal mask** is the one line that turns attention into an *autoregressive* language model. Mask the upper triangle of the attention matrix to \`-inf\` before softmax so each position can only attend to itself and earlier positions, never the future. Without this, the model could cheat and "see" the answer at training time.

**Why Q, K, and V are separate projections:** in principle you could compute attention with just \`x\` — but learning three independent transformations of \`x\` (with separate weight matrices) gives the model far more flexibility. Q learns *what to ask*, K learns *how to advertise*, V learns *what content to share*. They're decoupled on purpose.`,
        code: `import torch
import torch.nn.functional as F

B, T, C = 2, 8, 32        # batch, time, channels
x = torch.randn(B, T, C)

head_size = 16
key   = torch.nn.Linear(C, head_size, bias=False)
query = torch.nn.Linear(C, head_size, bias=False)
value = torch.nn.Linear(C, head_size, bias=False)

k = key(x)     # (B, T, 16)
q = query(x)
v = value(x)

# Affinity: how much does each query match each key?
wei = q @ k.transpose(-2, -1) * head_size**-0.5   # (B, T, T)

# Causal mask — each position only attends to itself and the past
mask = torch.tril(torch.ones(T, T))
wei = wei.masked_fill(mask == 0, float('-inf'))
wei = F.softmax(wei, dim=-1)

# Weighted sum of values
out = wei @ v   # (B, T, 16)
print(out.shape)

# Inspect: each row of wei is a probability distribution
print("attention row 0:", wei[0, 0])  # only position 0 has weight (causal!)
print("attention row 7:", wei[0, 7])  # all 8 positions have weight`,
        references: [
          { title: "Attention Is All You Need (Vaswani et al., 2017)", url: "https://arxiv.org/abs/1706.03762" },
          { title: "Wikipedia: Attention (machine learning)", url: "https://en.wikipedia.org/wiki/Attention_(machine_learning)" },
          { title: "Wikipedia: Softmax function", url: "https://en.wikipedia.org/wiki/Softmax_function" },
          { title: "The Illustrated Transformer (Jay Alammar)", url: "https://jalammar.github.io/illustrated-transformer/" },
        ],
      },
    ],
  },
  {
    module: "4.5 Attention, deeper",
    icon: Layers,
    items: [
      {
        title: "Multi-head attention",
        theory: `A single attention head learns one type of relationship. **Multi-head attention** runs several heads in parallel — each can specialize. Empirically, in a trained model, you'll find one head tracking syntactic dependencies, another tracking long-range coreference, another tracking local n-grams, and so on. (See [the original transformer paper's analysis](https://arxiv.org/abs/1706.03762) and follow-ups like ["What Does BERT Look At?"](https://arxiv.org/abs/1906.04341)).

**The intuition:** instead of one giant head with \`d_model\` channels, you get \`n_heads\` smaller heads with \`d_model / n_heads\` channels each. Total parameter count is similar. The heads are completely independent inside attention, then their outputs are concatenated and projected through a final \`W_o\`.

**The trick — one big projection, then reshape:** instead of \`n_heads\` separate Q/K/V projections, do **one big projection** to \`d_model\` (or \`3 * d_model\` for QKV combined), then *reshape* into \`n_heads\` chunks of \`head_size = d_model / n_heads\`. Run attention on all heads at once with a single batched matmul. This is just clever indexing — no actual data movement, no extra compute compared to the conceptual "n separate heads" version.

**Shape walkthrough** (B=batch, T=seq, C=d_model, H=n_heads, D=head_size):
- input: \`(B, T, C)\`
- after qkv projection + reshape: \`(B, H, T, D)\` per Q, K, V
- attention weights: \`(B, H, T, T)\` — one TxT matrix per head
- weighted values: \`(B, H, T, D)\` → reshape → \`(B, T, C)\` → \`W_o\`

**Why the output projection \`W_o\`?** It mixes information across the heads after concat. Without it, the heads would be completely isolated channels in the output. \`W_o\` lets the model recombine head outputs into integrated features.`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads, block_size):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.head_size = d_model // n_heads

        # One big projection for Q, K, V together
        self.qkv  = nn.Linear(d_model, 3 * d_model, bias=False)
        self.proj = nn.Linear(d_model, d_model)
        self.register_buffer("mask",
            torch.tril(torch.ones(block_size, block_size)))

    def forward(self, x):
        B, T, C = x.shape
        H, D = self.n_heads, self.head_size

        qkv = self.qkv(x)                       # (B, T, 3C)
        q, k, v = qkv.split(C, dim=-1)          # each (B, T, C)

        # Reshape to (B, H, T, D) — split channels into heads
        q = q.view(B, T, H, D).transpose(1, 2)
        k = k.view(B, T, H, D).transpose(1, 2)
        v = v.view(B, T, H, D).transpose(1, 2)

        att = (q @ k.transpose(-2, -1)) * D**-0.5   # (B, H, T, T)
        att = att.masked_fill(self.mask[:T, :T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)

        out = att @ v                            # (B, H, T, D)
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.proj(out)`,
        references: [
          { title: "Attention Is All You Need (Vaswani et al., 2017)", url: "https://arxiv.org/abs/1706.03762" },
          { title: "What Does BERT Look At? An Analysis of BERT's Attention", url: "https://arxiv.org/abs/1906.04341" },
        ],
      },
      {
        title: "Cross-attention",
        theory: `Cross-attention is **the same math** as self-attention with one twist: \`Q\` comes from one sequence, but \`K\` and \`V\` come from a *different* sequence.

**Self-attention** answers: "for each token in this sequence, what *other tokens in the same sequence* should I attend to?"

**Cross-attention** answers: "for each token in sequence A, what tokens in *sequence B* should I attend to?"

**Where it shows up:**
- **Encoder-decoder transformers** (the original ["Attention is All You Need"](https://arxiv.org/abs/1706.03762) architecture used for translation): the encoder processes the source sentence into a sequence of vectors; the decoder generates the target sentence one token at a time, and at each decoder layer, cross-attention lets the decoder pull information from the encoded source.
- **Diffusion image models** (Stable Diffusion, etc.): image patches use cross-attention to attend to text embeddings, which is how a text prompt steers image generation.
- **Perceiver** ([paper](https://arxiv.org/abs/2103.03206)): a small set of latents cross-attends to a giant input (image, audio, point cloud), avoiding O(N²) cost.

**No causal mask, usually.** Cross-attention is between two complete sequences, so there's nothing to hide. The query length \`T_q\` and key/value length \`T_kv\` can differ; the resulting attention matrix is \`(T_q, T_kv)\`, not square.

**Modern decoder-only LLMs (GPT, Llama, etc.) don't use cross-attention** — they're decoder-only, processing one stream. Cross-attention shows up when you have two distinct streams that need to talk to each other.`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class CrossAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads   = n_heads
        self.head_size = d_model // n_heads
        self.q_proj  = nn.Linear(d_model, d_model, bias=False)
        self.kv_proj = nn.Linear(d_model, 2 * d_model, bias=False)
        self.proj    = nn.Linear(d_model, d_model)

    def forward(self, x_q, x_kv):
        B, Tq, C  = x_q.shape
        _, Tkv, _ = x_kv.shape
        H, D = self.n_heads, self.head_size

        q = self.q_proj(x_q).view(B, Tq, H, D).transpose(1, 2)
        kv = self.kv_proj(x_kv)
        k, v = kv.split(C, dim=-1)
        k = k.view(B, Tkv, H, D).transpose(1, 2)
        v = v.view(B, Tkv, H, D).transpose(1, 2)

        att = (q @ k.transpose(-2, -1)) * D**-0.5   # (B, H, Tq, Tkv)
        att = F.softmax(att, dim=-1)
        out = att @ v                                # (B, H, Tq, D)
        out = out.transpose(1, 2).contiguous().view(B, Tq, C)
        return self.proj(out)

# Usage: decoder attends to encoder output
# decoder_hidden = (B, Tq=10, C)
# encoder_out    = (B, Tkv=25, C)
# out            = (B, Tq=10, C)`,
        references: [
          { title: "Attention Is All You Need (encoder-decoder)", url: "https://arxiv.org/abs/1706.03762" },
          { title: "Perceiver: General Perception with Iterative Attention", url: "https://arxiv.org/abs/2103.03206" },
          { title: "High-Resolution Image Synthesis with Latent Diffusion Models", url: "https://arxiv.org/abs/2112.10752" },
        ],
      },
      {
        title: "Flex attention",
        theory: `\`torch.nn.attention.flex_attention\` (PyTorch 2.5+) lets you define **arbitrary attention patterns** through Python callbacks and compiles them to fused kernels — instead of building a giant mask tensor by hand and burning memory.

**Why this matters:** patterns like sliding window, document masking, prefix-LM, and ALiBi used to either eat memory (full \`T×T\` mask tensor) or require hand-written CUDA kernels. Flex attention lets you write the pattern in Python and \`torch.compile\` generates the right kernel automatically.

**Two callback types:**
- \`score_mod(score, b, h, q_idx, kv_idx)\` — modify the raw attention score (e.g., add an [ALiBi](https://arxiv.org/abs/2108.12409) bias, apply temperature)
- \`mask_mod(b, h, q_idx, kv_idx) -> bool\` — return whether this position is allowed (sparse masks)

**Patterns you can build in 3 lines:**
- Causal: \`q_idx >= kv_idx\`
- Sliding window of 128: \`(q_idx >= kv_idx) & (q_idx - kv_idx <= 128)\`
- Document mask: \`doc_id[q_idx] == doc_id[kv_idx]\` (tokens only attend within their own doc in a packed batch)

**Backends and MPS:** flex_attention is most mature on CUDA — **PyTorch 2.11** added a [FlashAttention-4 backend](https://pytorch.org/blog/pytorch-2-11-release-blog/) for Hopper and Blackwell GPUs (H100/B100/B200), which is a major perf jump. On MPS the API works but performance lags CUDA significantly (it usually falls back to a reference kernel). For now, use it on Apple Silicon for *correctness and prototyping*, not for max throughput.`,
        code: `import torch
from torch.nn.attention.flex_attention import (
    flex_attention, create_block_mask
)

B, H, T, D = 2, 4, 1024, 64
device = "cuda" if torch.cuda.is_available() else "cpu"

q = torch.randn(B, H, T, D, device=device)
k = torch.randn(B, H, T, D, device=device)
v = torch.randn(B, H, T, D, device=device)

# --- 1. Causal mask ---
def causal(b, h, q_idx, kv_idx):
    return q_idx >= kv_idx

block_mask = create_block_mask(
    causal, B=None, H=None, Q_LEN=T, KV_LEN=T)
out = flex_attention(q, k, v, block_mask=block_mask)

# --- 2. Sliding window of size 128 (causal) ---
WINDOW = 128
def sliding(b, h, q_idx, kv_idx):
    return (q_idx >= kv_idx) & (q_idx - kv_idx <= WINDOW)

sw_mask = create_block_mask(
    sliding, B=None, H=None, Q_LEN=T, KV_LEN=T)
out = flex_attention(q, k, v, block_mask=sw_mask)

# --- 3. ALiBi bias (modifies scores instead of masking) ---
def alibi(score, b, h, q_idx, kv_idx):
    bias = -0.1 * (q_idx - kv_idx).abs()  # linear penalty by distance
    return score + bias

out = flex_attention(q, k, v, score_mod=alibi)`,
        references: [
          { title: "FlexAttention blog post", url: "https://pytorch.org/blog/flexattention/" },
          { title: "ALiBi: Train Short, Test Long", url: "https://arxiv.org/abs/2108.12409" },
          { title: "PyTorch 2.11 release notes (FlashAttention-4)", url: "https://pytorch.org/blog/pytorch-2-11-release-blog/" },
        ],
      },
      {
        title: "KV cache for fast inference",
        theory: `At inference, you generate one token at a time. **Without caching**, each step re-runs attention over the entire prefix — recomputing K and V for tokens that haven't changed. That's \`O(T²)\` work per token, \`O(T³)\` for the whole sequence. Wasteful.

**The KV cache** stores K and V from each step. At step \`t\`, you only compute K and V for the *new* token, append them to the cache, and run attention with \`Q\` of length 1 against \`K, V\` of length \`t\`. That's \`O(T)\` per token, \`O(T²)\` total — and in practice often a 5–20× speedup.

**Memory cost:** \`2 × n_layers × n_heads × T × head_dim × dtype_bytes\` per sequence in the batch. For Llama-7B at 4096 context in fp16, that's \`2 × 32 × 32 × 4096 × 128 × 2 = 2.1 GB\` per sequence. **That's why long-context LLM inference is memory-bound, not compute-bound** — and why GQA, MQA, and MLA (Module 8) exist: they all attack the KV cache size.

**Implementation gotchas:**
- The cache has shape \`(B, H, max_T, D)\`, allocated up front. You write into it at the current position.
- During normal decoding, Q has length 1 (or N for [speculative decoding](https://arxiv.org/abs/2211.17192)).
- The mask is trivial — every cached token is in the past by construction, no triangular mask needed.
- Cache invalidation = "start a new conversation." Reset by reallocating or zeroing.`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class CachedAttention(nn.Module):
    def __init__(self, d_model, n_heads, max_T):
        super().__init__()
        self.n_heads   = n_heads
        self.head_size = d_model // n_heads
        self.qkv  = nn.Linear(d_model, 3 * d_model, bias=False)
        self.proj = nn.Linear(d_model, d_model)
        self.max_T = max_T
        self.k_cache = None
        self.v_cache = None

    def reset_cache(self, B, device):
        H, D = self.n_heads, self.head_size
        self.k_cache = torch.zeros(B, H, self.max_T, D, device=device)
        self.v_cache = torch.zeros(B, H, self.max_T, D, device=device)

    def forward(self, x, start_pos):
        B, T, C = x.shape       # T is usually 1 during decoding
        H, D = self.n_heads, self.head_size

        qkv = self.qkv(x)
        q, k, v = qkv.split(C, dim=-1)
        q = q.view(B, T, H, D).transpose(1, 2)
        k = k.view(B, T, H, D).transpose(1, 2)
        v = v.view(B, T, H, D).transpose(1, 2)

        # Write new K, V into cache at current position
        self.k_cache[:, :, start_pos:start_pos+T] = k
        self.v_cache[:, :, start_pos:start_pos+T] = v

        # Attend over everything written so far
        end = start_pos + T
        keys   = self.k_cache[:, :, :end]
        values = self.v_cache[:, :, :end]

        att = (q @ keys.transpose(-2, -1)) * D**-0.5
        att = F.softmax(att, dim=-1)
        out = att @ values                          # (B, H, T, D)
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.proj(out)`,
        references: [
          { title: "Efficiently Scaling Transformer Inference (PaLM inference paper)", url: "https://arxiv.org/abs/2211.05102" },
          { title: "Speculative Decoding (Leviathan et al., 2022)", url: "https://arxiv.org/abs/2211.17192" },
        ],
      },
    ],
  },
  {
    module: "5. A Tiny Transformer",
    icon: Sparkles,
    items: [
      {
        title: "Full nanoGPT-style model",
        theory: `Putting it together: token + position embeddings → a stack of transformer blocks → a final linear head projecting back to \`vocab_size\` logits.

Each **block** is:
\`\`\`
x = x + self_attention(layer_norm(x))
x = x + mlp(layer_norm(x))
\`\`\`

That's *pre-norm residual*, the modern standard. The \`x +\` is the **residual connection**: the gradient has a direct identity path through every block, so it can flow back through dozens of layers without vanishing. Without these, deep transformers wouldn't train. (More in lesson 6.3.)

At ~100k params with \`d_model=64\`, \`n_heads=4\`, \`n_layers=4\`, \`block_size=32\`, this trains on Shakespeare in minutes on an M-series GPU. The architecture below is essentially [Karpathy's nanoGPT](https://github.com/karpathy/nanoGPT) — the smallest pedagogical GPT that actually works.

**Note:** this is the **GPT-2 era** stack. Modern LLMs (Llama, Mistral, Qwen, Gemma, DeepSeek, gpt-oss) replace several pieces:
- Learned position embeddings → **RoPE** (Module 7.1)
- LayerNorm → **RMSNorm** (Module 7.2)
- GELU MLP → **SwiGLU** (Module 7.3)
- MHA → **GQA** (Module 7.4)
- Optionally: **MoE** instead of dense FFN, **MLA** instead of GQA (Module 8)

But this version is the right one to *understand first*. Every modern variant is a swap-one-component change from this baseline.`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class Head(nn.Module):
    def __init__(self, d_model, head_size, block_size):
        super().__init__()
        self.key   = nn.Linear(d_model, head_size, bias=False)
        self.query = nn.Linear(d_model, head_size, bias=False)
        self.value = nn.Linear(d_model, head_size, bias=False)
        self.register_buffer("mask",
            torch.tril(torch.ones(block_size, block_size)))

    def forward(self, x):
        B, T, C = x.shape
        k, q, v = self.key(x), self.query(x), self.value(x)
        w = q @ k.transpose(-2, -1) * k.shape[-1]**-0.5
        w = w.masked_fill(self.mask[:T, :T] == 0, float('-inf'))
        w = F.softmax(w, dim=-1)
        return w @ v

class MultiHead(nn.Module):
    def __init__(self, n_heads, d_model, block_size):
        super().__init__()
        head_size = d_model // n_heads
        self.heads = nn.ModuleList([
            Head(d_model, head_size, block_size) for _ in range(n_heads)
        ])
        self.proj = nn.Linear(d_model, d_model)

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        return self.proj(out)

class Block(nn.Module):
    def __init__(self, d_model, n_heads, block_size):
        super().__init__()
        self.sa  = MultiHead(n_heads, d_model, block_size)
        self.mlp = nn.Sequential(
            nn.Linear(d_model, 4*d_model),
            nn.GELU(),
            nn.Linear(4*d_model, d_model),
        )
        self.ln1 = nn.LayerNorm(d_model)
        self.ln2 = nn.LayerNorm(d_model)

    def forward(self, x):
        x = x + self.sa(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x

class TinyGPT(nn.Module):
    def __init__(self, vocab_size, d_model=64, n_heads=4,
                 n_layers=4, block_size=32):
        super().__init__()
        self.block_size = block_size
        self.tok_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(block_size, d_model)
        self.blocks  = nn.Sequential(*[
            Block(d_model, n_heads, block_size) for _ in range(n_layers)
        ])
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape
        tok = self.tok_emb(idx)
        pos = self.pos_emb(torch.arange(T, device=idx.device))
        x = tok + pos
        x = self.blocks(x)
        x = self.ln_f(x)
        logits = self.head(x)
        loss = None
        if targets is not None:
            loss = F.cross_entropy(
                logits.view(-1, logits.size(-1)),
                targets.view(-1))
        return logits, loss`,
        references: [
          { title: "Karpathy: nanoGPT", url: "https://github.com/karpathy/nanoGPT" },
          { title: "Karpathy: Let's build GPT (video)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY" },
          { title: "Language Models are Unsupervised Multitask Learners (GPT-2)", url: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf" },
        ],
      },
      {
        title: "Training & sampling",
        theory: `Training a tiny LM is boring in the best way — the same 5-line loop you already know, just with \`(xb, yb)\` being \`(context, next_tokens)\` shifted by one position.

**The data layout:** for char-level, you turn your training text into a single long tensor of token IDs. To make a batch, sample random starting positions, take \`block_size\` tokens as \`x\`, and the *same* tokens shifted right by one as \`y\`. So \`y[t] = x[t+1]\` — the model is trained to predict the next character at every position, in parallel. (This parallelism over positions is one reason transformers train so much faster than RNNs.)

**Sampling is the part people get wrong.** Feed the current context, take the logits for the **last position only**, softmax them, sample one token, append it, repeat. Crop context to \`block_size\` so positional embeddings stay valid. The for-loop is unavoidably sequential — you can't parallelize over time at inference because each new token depends on the previous one. (See [speculative decoding](https://arxiv.org/abs/2211.17192) for a clever workaround.)

On an M-series Mac this will do a few thousand iters per minute at this scale.`,
        code: `import torch

device = "mps"
# model = TinyGPT(vocab_size).to(device)
# get_batch("train") -> (x, y) of shape (B, block_size) on device

opt = torch.optim.AdamW(model.parameters(), lr=3e-4)

for step in range(3000):
    xb, yb = get_batch("train")
    _, loss = model(xb, yb)
    opt.zero_grad()
    loss.backward()
    opt.step()
    if step % 200 == 0:
        print(f"step {step}: loss {loss.item():.4f}")

# --- sampling ---
@torch.no_grad()
def generate(model, idx, max_new_tokens):
    for _ in range(max_new_tokens):
        idx_cond = idx[:, -model.block_size:]
        logits, _ = model(idx_cond)
        logits = logits[:, -1, :]            # last time step
        probs = torch.softmax(logits, dim=-1)
        next_id = torch.multinomial(probs, num_samples=1)
        idx = torch.cat((idx, next_id), dim=1)
    return idx

start = torch.zeros((1, 1), dtype=torch.long, device=device)
out = generate(model, start, 200)
print(decode(out[0].tolist()))`,
        references: [
          { title: "Karpathy: nanoGPT training code", url: "https://github.com/karpathy/nanoGPT/blob/master/train.py" },
          { title: "Tiny Shakespeare dataset", url: "https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt" },
        ],
      },
    ],
  },
  {
    module: "6. Training & Inference Details",
    icon: Zap,
    items: [
      {
        title: "Cross-entropy loss for language models",
        theory: `Language modeling is a classification problem at every position: given the context, predict the next token out of \`vocab_size\` possibilities. The loss is **[cross-entropy](https://en.wikipedia.org/wiki/Cross-entropy)**.

**Where it comes from — maximum likelihood.** Suppose your model assigns probability \`p_i\` to each token \`i\`, and the true next token is \`c\`. The probability the model assigned to the correct answer is \`p_c\`. We want to **maximize** the probability the model assigns to the data — this is [maximum likelihood estimation](https://en.wikipedia.org/wiki/Maximum_likelihood_estimation), the foundation of most of statistics.

Maximizing \`p_c\` is the same as maximizing \`log(p_c)\` (log is monotonic), which is the same as **minimizing \`-log(p_c)\`** — the **negative log-likelihood**. That's all cross-entropy is:

\`\`\`
L = -log( softmax(logits)[correct_class] )
\`\`\`

**Why log?** Three reasons:
1. **Numerical stability** — products of probabilities underflow fast; sums of logs don't.
2. **Information theory** — \`-log₂(p_c)\` is the [number of bits](https://en.wikipedia.org/wiki/Information_content) of "surprise" the true answer gives the model. Cross-entropy is the average surprise. A perfect model has 0 cross-entropy; a uniform-random model has \`log(vocab_size)\`.
3. **Gradient shape** — the gradient of \`-log(softmax(logits))_c\` with respect to logits is just \`(softmax(logits) - one_hot(c))\` — beautifully simple, doesn't vanish.

**Critical PyTorch detail:** \`F.cross_entropy\` expects **raw logits**, not probabilities. It applies log_softmax internally for numerical stability. If you softmax first and pass that in, you'll silently get a much weaker gradient and your model won't train properly. **This is the most common LM training bug.**

**Shape convention for LMs:**
- logits: \`(B, T, V)\` where V is vocab size
- targets: \`(B, T)\` of token IDs
- Flatten to \`(B*T, V)\` and \`(B*T,)\` before passing in

**Label smoothing:** instead of a one-hot target (the correct class gets probability 1, all others 0), give the true class \`1 - ε\` and spread \`ε\` across the rest. Mild regularizer; transformers often use \`ε=0.1\`. Empirically improves generalization slightly and prevents the model from getting overconfident.`,
        code: `import torch
import torch.nn.functional as F

B, T, V = 4, 16, 1000
logits  = torch.randn(B, T, V, requires_grad=True)
targets = torch.randint(0, V, (B, T))

# Standard LM loss
loss = F.cross_entropy(
    logits.view(B*T, V),     # (B*T, V)
    targets.view(B*T),       # (B*T,)
)
print("loss:", loss.item())

# A perfectly random model has loss ~ log(V)
print("uniform baseline:", torch.log(torch.tensor(float(V))).item())

# With label smoothing
loss_smooth = F.cross_entropy(
    logits.view(B*T, V),
    targets.view(B*T),
    label_smoothing=0.1,
)
print("smoothed:", loss_smooth.item())

# DO NOT do this — double softmax kills gradients:
# probs = F.softmax(logits, dim=-1)
# loss  = F.cross_entropy(probs.view(B*T, V), targets.view(B*T))  # WRONG`,
        references: [
          { title: "Wikipedia: Cross-entropy", url: "https://en.wikipedia.org/wiki/Cross-entropy" },
          { title: "Wikipedia: Maximum likelihood estimation", url: "https://en.wikipedia.org/wiki/Maximum_likelihood_estimation" },
          { title: "Wikipedia: KL divergence", url: "https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence" },
          { title: "PyTorch F.cross_entropy docs", url: "https://pytorch.org/docs/stable/generated/torch.nn.functional.cross_entropy.html" },
        ],
      },
      {
        title: "Optimizers: SGD, Adam, AdamW",
        theory: `**SGD:** \`w -= lr * grad\`. Simple, no state. Works fine for convex problems and well-tuned vision nets. The whole story of more complex optimizers is "SGD plus state to be smarter."

**Momentum** ([wiki](https://en.wikipedia.org/wiki/Stochastic_gradient_descent#Momentum)): keep a running average of recent gradients (\`v ← βv + grad\`), and update with \`v\` instead of the raw \`grad\`. Smooths out noise from mini-batches and helps the optimizer power through small bumps in the loss landscape. The physical analogy: a ball rolling downhill picks up speed and doesn't get stuck in tiny dips.

**[Adam](https://arxiv.org/abs/1412.6980):** keeps two running averages — one of the gradients (momentum, \`m\`) and one of the *squared* gradients (variance, \`v\`). Updates with:
\`\`\`
w -= lr * m / (sqrt(v) + ε)
\`\`\`
The \`sqrt(v)\` divisor adapts the effective learning rate **per parameter**: parameters with consistently large gradients get a smaller step, parameters with small or sparse gradients get a larger step. This is huge for transformers where different params see wildly different gradient scales (embedding matrices vs LayerNorm gains, etc.).

**[AdamW](https://arxiv.org/abs/1711.05101):** Adam, but **decoupled weight decay**. Original Adam mixed weight decay into the gradient, which is mathematically equivalent to L2 regularization only for SGD — *not* for adaptive optimizers like Adam. AdamW subtracts \`lr * wd * w\` directly from the weights, which is the "right" formulation. **Use AdamW for transformers, always.**

**Param groups — the no-decay-on-norms pattern.** You usually want weight decay on the big matmul weights (it's a regularizer, prevents them from blowing up) but **not** on biases or LayerNorm/RMSNorm parameters (those are 1-d, decay would just push them to zero and break the layer). Standard pattern below.

**LR schedules:** transformers love **warmup → cosine decay**. Linear warmup over the first ~1000 steps (or 1% of training) prevents the optimizer from taking huge steps with random initialization. Then cosine decay to ~10% of peak LR over the rest of training. The cosine shape has no theoretical justification — it just empirically works well and is smooth.`,
        code: `import torch
import torch.nn as nn
import math

model = nn.Sequential(
    nn.Linear(64, 256),
    nn.LayerNorm(256),
    nn.GELU(),
    nn.Linear(256, 64),
)

# Split params: decay on weights, no decay on biases / norms
decay, no_decay = [], []
for name, p in model.named_parameters():
    if p.dim() >= 2:        # matmul weights
        decay.append(p)
    else:                    # biases, LayerNorm gains/biases
        no_decay.append(p)

opt = torch.optim.AdamW(
    [
        {"params": decay,    "weight_decay": 0.1},
        {"params": no_decay, "weight_decay": 0.0},
    ],
    lr=3e-4,
    betas=(0.9, 0.95),
)

# Warmup + cosine schedule
def lr_lambda(step, warmup=1000, total=10000, min_ratio=0.1):
    if step < warmup:
        return step / warmup
    progress = (step - warmup) / (total - warmup)
    return min_ratio + (1 - min_ratio) * 0.5 * (1 + math.cos(math.pi * progress))

scheduler = torch.optim.lr_scheduler.LambdaLR(opt, lr_lambda)`,
        references: [
          { title: "Adam: A Method for Stochastic Optimization", url: "https://arxiv.org/abs/1412.6980" },
          { title: "Decoupled Weight Decay Regularization (AdamW)", url: "https://arxiv.org/abs/1711.05101" },
          { title: "Wikipedia: Stochastic gradient descent (momentum, Adam)", url: "https://en.wikipedia.org/wiki/Stochastic_gradient_descent" },
        ],
      },
      {
        title: "LayerNorm, residuals, GELU",
        theory: `Three small ingredients that make deep transformers actually trainable.

**Residual connections** \`x + f(x)\` ([He et al., 2015](https://arxiv.org/abs/1512.03385), originally for ResNets). The gradient has a *direct identity path* that bypasses \`f\` entirely, so it can flow back through hundreds of layers without vanishing or exploding. Without residuals, deep nets fall over — you can't train more than ~10 layers reliably. Transformers inherited this idea; every modern deep net has residuals.

The math: \`d(x + f(x))/dx = 1 + f'(x)\`. The \`1\` is the identity path. Even if \`f'(x)\` is tiny (saturated activation, vanishing), the gradient through \`x\` is still 1. Free gradient flow.

**[LayerNorm](https://arxiv.org/abs/1607.06450)**: normalizes a tensor across the **feature dimension** for each example independently. Not across the batch like [BatchNorm](https://arxiv.org/abs/1502.03167). Why this matters for transformers:

- BatchNorm depends on batch statistics (mean and variance computed across the batch). With variable sequence lengths and small batches (common in NLP), batch stats are noisy and unreliable.
- LayerNorm is **per-example** — completely independent of the batch — so it's stable regardless of batch size or sequence length.
- It keeps activations in a sane range as they pass through layers, which keeps the loss landscape well-conditioned and training stable.

**Pre-norm vs post-norm:** the original transformer applied LayerNorm *after* each sublayer (\`LN(x + f(x))\`). Modern practice is **pre-norm**: \`x + f(LN(x))\`. Pre-norm is much more stable to train, especially for deep models, and is what GPT-2 onward use. The reason: with post-norm, the residual stream itself gets normalized, which can interfere with the gradient highway. With pre-norm, the residual stream is untouched and only what \`f\` sees is normalized.

**[GELU](https://arxiv.org/abs/1606.08415)**: \`x · Φ(x)\` where Φ is the Gaussian cumulative distribution function. A smooth version of ReLU. Looks similar to ReLU for large \`|x|\` but is smooth and slightly negative for small negative inputs. Empirically slightly better than ReLU for transformers — no real theory, it just works. Modern LLMs (Llama, etc.) have moved on to **SwiGLU** (Module 7.3), but GELU is still common in the GPT-2 era stack and BERT.`,
        code: `import torch
import torch.nn as nn

class TransformerBlock(nn.Module):
    """Pre-norm residual block — the modern standard."""
    def __init__(self, d_model, n_heads, attn_cls):
        super().__init__()
        self.ln1  = nn.LayerNorm(d_model)
        self.attn = attn_cls(d_model, n_heads)
        self.ln2  = nn.LayerNorm(d_model)
        self.mlp = nn.Sequential(
            nn.Linear(d_model, 4 * d_model),
            nn.GELU(),                    # smooth ReLU
            nn.Linear(4 * d_model, d_model),
        )

    def forward(self, x):
        # Residual + pre-norm: x + sublayer(LN(x))
        x = x + self.attn(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x

# What LayerNorm vs BatchNorm normalize over
x = torch.randn(8, 16, 64)   # (batch, seq, features)

# LayerNorm: per (batch, seq) example, across the 64 features
ln = nn.LayerNorm(64)
print(ln(x).shape)           # (8, 16, 64)

# BatchNorm1d: across the batch dim, per feature
# (rarely used in transformers; included for contrast)
bn = nn.BatchNorm1d(64)
print(bn(x.transpose(1, 2)).transpose(1, 2).shape)`,
        references: [
          { title: "Layer Normalization (Ba et al., 2016)", url: "https://arxiv.org/abs/1607.06450" },
          { title: "Deep Residual Learning for Image Recognition (ResNet)", url: "https://arxiv.org/abs/1512.03385" },
          { title: "Gaussian Error Linear Units (GELU)", url: "https://arxiv.org/abs/1606.08415" },
          { title: "On Layer Normalization in the Transformer Architecture (pre-norm)", url: "https://arxiv.org/abs/2002.04745" },
        ],
      },
      {
        title: "Mixed precision on MPS",
        theory: `**fp32** is 4 bytes per parameter. Default and safe, but memory-hungry — a 7B parameter model in fp32 needs 28 GB just for the weights, plus more for gradients, optimizer state, and activations.

**fp16** is 2 bytes — half the memory, often faster matmuls — but its [exponent range](https://en.wikipedia.org/wiki/Half-precision_floating-point_format) is narrow (\`~6e-5\` to \`65504\`). Gradients can underflow to zero. Training in pure fp16 usually requires **gradient scaling** (\`torch.cuda.amp.GradScaler\`) to multiply the loss by a large constant before backward, then unscale before the optimizer step.

**bf16** ([bfloat16](https://en.wikipedia.org/wiki/Bfloat16_floating-point_format)) is also 2 bytes, but trades mantissa precision for fp32's *exponent range*. No underflow issues, no gradient scaling needed. **This is the modern default for training.** Apple Silicon supports bf16 from M2 onward.

**The key insight:** for gradients, **range matters more than precision**. A gradient of \`1e-7\` rounded to \`1.001e-7\` is fine; a gradient of \`1e-7\` rounded to \`0\` is catastrophic. bf16's huge range prevents the catastrophic case; the lower precision is absorbed by the noise of mini-batch SGD.

**On MPS:** use \`torch.autocast("mps", dtype=torch.bfloat16)\` to automatically run eligible ops in bf16 while keeping master weights in fp32. This is "mixed precision" — heavy matmuls run cheap, but the optimizer state and accumulations stay accurate. The general pattern, from the [original mixed precision training paper](https://arxiv.org/abs/1710.03740):
1. **Master weights** in fp32 (small)
2. **Forward + backward** in bf16 (memory-heavy ops, halved cost)
3. **Optimizer step** updates fp32 master copy

**Caveat:** MPS autocast support is newer than CUDA's. Some ops still don't have bf16 kernels and will fall back. Profile first; the speedup is real but smaller than on CUDA (where it can be 2-3×).`,
        code: `import torch
import torch.nn as nn

device = "mps"
model  = nn.Linear(512, 512).to(device)
opt    = torch.optim.AdamW(model.parameters(), lr=1e-3)

x = torch.randn(32, 512, device=device)
y = torch.randn(32, 512, device=device)

for step in range(10):
    opt.zero_grad()

    # Forward + loss in bf16; weights stay fp32
    with torch.autocast(device_type="mps", dtype=torch.bfloat16):
        pred = model(x)
        loss = ((pred - y) ** 2).mean()

    # Backward runs outside autocast; grads accumulate in fp32
    loss.backward()
    opt.step()

print("done — peak memory roughly halved on bf16-eligible ops")

# fp16 alternative requires gradient scaling on CUDA;
# on MPS bf16 is almost always the better choice.`,
        references: [
          { title: "Mixed Precision Training (Micikevicius et al., 2017)", url: "https://arxiv.org/abs/1710.03740" },
          { title: "Wikipedia: bfloat16 floating-point format", url: "https://en.wikipedia.org/wiki/Bfloat16_floating-point_format" },
          { title: "PyTorch torch.amp documentation", url: "https://pytorch.org/docs/stable/amp.html" },
        ],
      },
      {
        title: "Sampling: temperature, top-k, top-p",
        theory: `Once you have logits for the next token, you have to *pick* one. How you pick controls how interesting (and how coherent) the output is.

**Greedy / argmax**: always pick the highest-logit token. Deterministic. Tends to loop and be boring — once you pick the most likely token, the next most likely token is often "the same kind of thing again."

**Plain multinomial sampling**: \`softmax\` then sample. Uses the full distribution — including the long tail of garbage tokens. Too noisy — you'll get random words showing up because every token has *some* nonzero probability.

**Temperature**: divide logits by \`T\` before softmax. The math: \`softmax(z/T)_i = exp(z_i/T) / Σ exp(z_j/T)\`.
- \`T < 1\` sharpens the distribution → more confident, closer to greedy. \`T → 0\` is greedy.
- \`T > 1\` flattens it → more diverse, more random. \`T → ∞\` is uniform.
- \`T = 1\` is the raw distribution.

Temperature is the simplest and most-used sampling knob.

**Top-k**: keep only the \`k\` highest logits, set the rest to \`-inf\`. Cuts the long tail of garbage. \`k=40\` is a common choice. The downside: \`k\` is fixed regardless of how confident the model is, so sometimes you cut off legitimately likely tokens, and other times you keep tokens that should have been excluded.

**Top-p / nucleus** ([Holtzman et al., 2019](https://arxiv.org/abs/1904.09751)): keep the smallest set of tokens whose **cumulative probability ≥ \`p\`**. Adapts to the distribution shape — when the model is confident (one or two tokens dominate), you sample from few tokens; when it's uncertain (probability spread across many), you sample from more. Usually the best default. \`p=0.9\` or \`p=0.95\` is typical.

In practice people **combine them**: \`temperature=0.8, top_p=0.95\` is a common starting point that produces coherent but non-repetitive text.`,
        code: `import torch
import torch.nn.functional as F

@torch.no_grad()
def sample_next(logits, temperature=1.0, top_k=None, top_p=None):
    """logits: (B, V) -> next token ids: (B, 1)"""
    logits = logits / max(temperature, 1e-6)

    if top_k is not None:
        v, _ = torch.topk(logits, top_k)
        logits[logits < v[:, [-1]]] = float('-inf')

    if top_p is not None:
        sorted_logits, sorted_idx = torch.sort(logits, descending=True)
        probs = F.softmax(sorted_logits, dim=-1)
        cum = probs.cumsum(dim=-1)
        # Tokens beyond the nucleus
        remove = cum > top_p
        # Shift right to keep at least one token
        remove[..., 1:] = remove[..., :-1].clone()
        remove[..., 0] = False
        sorted_logits[remove] = float('-inf')
        logits = torch.zeros_like(logits).scatter(
            -1, sorted_idx, sorted_logits)

    probs = F.softmax(logits, dim=-1)
    return torch.multinomial(probs, num_samples=1)

@torch.no_grad()
def generate(model, idx, max_new, **kw):
    for _ in range(max_new):
        idx_cond = idx[:, -model.block_size:]
        logits, _ = model(idx_cond)
        next_id = sample_next(logits[:, -1, :], **kw)
        idx = torch.cat([idx, next_id], dim=1)
    return idx

# Examples:
# generate(model, ctx, 200)                                # plain
# generate(model, ctx, 200, temperature=0.8)               # slightly sharp
# generate(model, ctx, 200, temperature=0.8, top_k=40)     # top-k
# generate(model, ctx, 200, temperature=0.8, top_p=0.95)   # nucleus`,
        references: [
          { title: "The Curious Case of Neural Text Degeneration (nucleus sampling)", url: "https://arxiv.org/abs/1904.09751" },
          { title: "Wikipedia: Softmax (with temperature)", url: "https://en.wikipedia.org/wiki/Softmax_function#Reinforcement_learning" },
        ],
      },
    ],
  },
  {
    module: "7. Modern LLM Architecture (post-GPT-2)",
    icon: Sparkles,
    items: [
      {
        title: "RoPE — Rotary Position Embeddings",
        theory: `The TinyGPT in Module 5 uses **learned positional embeddings** (\`nn.Embedding(block_size, d_model)\`). That's the GPT-2 stack. Every modern open LLM has replaced it with **RoPE** ([Su et al., 2021](https://arxiv.org/abs/2104.09864)).

**Why we even need positional info:** self-attention is *permutation invariant*. If you shuffle the input tokens, the output set is the same set, just shuffled. The model literally cannot tell "dog bites man" from "man bites dog" without explicit positional information injected somewhere.

**The history:**
1. **Sinusoidal** (original transformer, 2017): hand-designed sin/cos waves of different frequencies, added to the input embedding. Doesn't learn anything, generalizes to longer sequences in theory.
2. **Learned absolute** (GPT-2, BERT): a learned \`nn.Embedding(max_len, d)\`. Simple, works well, but **doesn't extrapolate** beyond \`max_len\` because there's no learned vector for position 4097 if you trained on 4096.
3. **RoPE** (Llama era, 2021+): rotates Q and K based on position. Encodes *relative* position structurally. Extrapolates with tricks.

**The RoPE idea — rotate Q and K, don't add anything to the input.** For each pair of channels \`(2k, 2k+1)\` in the Q and K vectors, apply a 2D [rotation matrix](https://en.wikipedia.org/wiki/Rotation_matrix) by an angle that depends on the token's position:

\`\`\`
[q'_2k  ]   [cos(mθ_k)  -sin(mθ_k)] [q_2k  ]
[q'_2k+1] = [sin(mθ_k)   cos(mθ_k)] [q_2k+1]
\`\`\`

Where \`m\` is the position and \`θ_k = base^(-2k/d)\` (\`base\` is usually 10000, or 500000+ for long-context models like Llama 3 with 128k context).

**The key property** — and the reason this is brilliant: after rotation, the dot product \`q_m · k_n\` depends only on the *difference* \`m - n\`, not on the absolute positions \`m\` and \`n\` individually. So attention scores naturally encode **relative** positions, which is what you actually want — the relationship between "the cat" two tokens ago and "sat" right now should be the same regardless of where in the document this happens.

**Why pairs of channels?** A 2D rotation needs two coordinates. RoPE pairs up the channels and rotates each pair independently. Different pairs use different frequencies \`θ_k\` — high-frequency pairs (small \`k\`) encode local position, low-frequency pairs (large \`k\`) encode long-range position. This is the same idea as the original sinusoidal encoding, but applied as a *rotation on Q/K* rather than an *addition to the input*.

**Length extrapolation:** RoPE rotates by an angle, so in principle nothing prevents you from using it at positions beyond training length. In practice the very low frequencies don't generalize well, which is why post-hoc tricks like [YaRN](https://arxiv.org/abs/2309.00071) and NTK scaling exist — they tweak the frequencies to extend the trained context window without retraining from scratch.

**Used by:** Llama 2/3/4, Mistral, Qwen, Gemma, DeepSeek, gpt-oss. If you're building an LLM today, you use RoPE.`,
        code: `import torch
import torch.nn as nn

def precompute_rope(head_dim, max_seq_len, base=10000.0, device="mps"):
    """Precompute cos/sin tables for RoPE."""
    # theta_k = base^(-2k/d) for k in [0, d/2)
    inv_freq = 1.0 / (base ** (torch.arange(
        0, head_dim, 2, device=device).float() / head_dim))
    pos = torch.arange(max_seq_len, device=device).float()
    freqs = torch.outer(pos, inv_freq)         # (T, d/2)
    return freqs.cos(), freqs.sin()            # each (T, d/2)

def apply_rope(x, cos, sin):
    """Rotate pairs of channels in x.
    x: (..., T, d)   cos/sin: (T, d/2)"""
    x1, x2 = x[..., 0::2], x[..., 1::2]        # even, odd channels
    # 2D rotation:
    # [x1']   [cos -sin] [x1]
    # [x2'] = [sin  cos] [x2]
    rotated_x1 = x1 * cos - x2 * sin
    rotated_x2 = x1 * sin + x2 * cos
    out = torch.empty_like(x)
    out[..., 0::2] = rotated_x1
    out[..., 1::2] = rotated_x2
    return out

# Usage inside attention:
# B, H, T, D = q.shape
# cos, sin = precompute_rope(D, max_T)
# q = apply_rope(q, cos[:T], sin[:T])
# k = apply_rope(k, cos[:T], sin[:T])
# (V is NOT rotated — only Q and K)`,
        references: [
          { title: "RoFormer: Enhanced Transformer with Rotary Position Embedding", url: "https://arxiv.org/abs/2104.09864" },
          { title: "YaRN: Efficient Context Window Extension", url: "https://arxiv.org/abs/2309.00071" },
          { title: "Wikipedia: Rotation matrix", url: "https://en.wikipedia.org/wiki/Rotation_matrix" },
          { title: "EleutherAI: Rotary Embeddings explainer", url: "https://blog.eleuther.ai/rotary-embeddings/" },
        ],
      },
      {
        title: "RMSNorm — simpler, faster LayerNorm",
        theory: `LayerNorm subtracts the mean *and* divides by the standard deviation. **[RMSNorm](https://arxiv.org/abs/1910.07467)** skips the mean entirely — it just divides by the root-mean-square of the activations:

\`\`\`
LayerNorm:  (x - mean(x)) / std(x)        * γ + β
RMSNorm:     x / sqrt(mean(x²) + ε)       * γ
\`\`\`

No mean subtraction, no bias term \`β\`. Roughly **7–10% faster** in practice (one less reduction, one less broadcast, one less elementwise op), with **fewer trainable parameters** (just \`γ\`, no \`β\`).

**Empirically:** equal or slightly better than LayerNorm for transformers. Why does dropping the mean not hurt?
- The learnable scale \`γ\` plus the residual structure of transformers seems to absorb the difference.
- The residual stream has many components; centering one of them isn't critical when the next residual addition will shift the mean anyway.
- At scale, the loss of one degree of freedom is invisible.

**The original [RMSNorm paper](https://arxiv.org/abs/1910.07467)** showed equivalent quality at 64% of the compute. Llama 1 adopted it; everyone else followed.

**Used by:** Llama, Mistral, Qwen, Gemma, DeepSeek, gpt-oss — basically every open LLM since Llama 1. There's no real reason to use LayerNorm in a new LLM.

**A footnote — "QK-Norm":** some recent models (OLMo 2, gated attention variants) apply RMSNorm to Q and K *inside* the attention block, in addition to the pre-attention RMSNorm. This stabilizes training when scaling to very large models. Mentioned for completeness; not required to understand.`,
        code: `import torch
import torch.nn as nn

class RMSNorm(nn.Module):
    def __init__(self, d_model, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(d_model))   # γ only, no β

    def forward(self, x):
        # x: (..., d_model)
        rms = x.pow(2).mean(dim=-1, keepdim=True).add(self.eps).rsqrt()
        return x * rms * self.weight

# Compare to LayerNorm
x = torch.randn(2, 8, 64)
ln = nn.LayerNorm(64)
rn = RMSNorm(64)

print("LayerNorm out:", ln(x).shape,
      "params:", sum(p.numel() for p in ln.parameters()))
print("RMSNorm out:  ", rn(x).shape,
      "params:", sum(p.numel() for p in rn.parameters()))
# LayerNorm has 2*d params (γ and β); RMSNorm has only d (γ).`,
        references: [
          { title: "Root Mean Square Layer Normalization (Zhang & Sennrich, 2019)", url: "https://arxiv.org/abs/1910.07467" },
          { title: "LLaMA: Open and Efficient Foundation Language Models", url: "https://arxiv.org/abs/2302.13971" },
        ],
      },
      {
        title: "SwiGLU FFN",
        theory: `The original transformer FFN is two linear layers around a nonlinearity:
\`\`\`
FFN(x) = W_2 · GELU(W_1 · x)
\`\`\`

**[SwiGLU](https://arxiv.org/abs/2002.05202)** (Shazeer, 2020) adds a multiplicative *gate*:
\`\`\`
SwiGLU(x) = W_2 · ( Swish(W_g · x) ⊙ (W_u · x) )
\`\`\`

Where \`Swish(x) = x · sigmoid(x)\` (a.k.a. [SiLU](https://en.wikipedia.org/wiki/Swish_function)) and \`⊙\` is elementwise multiply. Three projections instead of two — \`W_g\` (gate), \`W_u\` (up), \`W_2\` (down).

**The intuition — gating.** A plain FFN computes one transformation and applies a nonlinearity. SwiGLU computes *two* transformations of the input — a "gate" branch and an "up" branch — and the gate selectively *masks* the up branch. Think of it like a learnable LSTM gate, but stateless and without recurrence. The gate learns to suppress features that aren't useful for this token, letting the up branch's information through more selectively.

**Why does it work?** Empirically, gated linear units consistently outperform ungated ones in transformers. Shazeer's paper showed about 1–2% loss improvement at the same compute. The "why" is hand-wavy — gating gives the model more expressive power per FLOP — but the empirical evidence is consistent enough that everyone just does it.

**The 8/3 hidden dim rule.** A vanilla GELU FFN with hidden dim \`4d\` has \`2 × d × 4d = 8d²\` parameters in its linear layers. SwiGLU has three projections: \`d × hidden\` (gate) + \`d × hidden\` (up) + \`hidden × d\` (down) = \`3 × d × hidden\` params. To match \`8d²\`, set \`hidden = 8d/3 ≈ 2.67d\`. In practice this gets rounded to a multiple of 64 or 256 for hardware efficiency.

**Used by:** Llama, Mistral, Qwen, Gemma, DeepSeek, gpt-oss. The new default. (For a fun read on activation functions, [Shazeer's "GLU Variants Improve Transformer"](https://arxiv.org/abs/2002.05202) ends with "We offer no explanation as to why these architectures seem to work; we attribute their success, as all else, to divine benevolence.")`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class SwiGLU(nn.Module):
    def __init__(self, d_model, hidden_mult=8/3):
        super().__init__()
        # Round hidden dim to a multiple of 64 for hardware efficiency
        hidden = int(hidden_mult * d_model)
        hidden = ((hidden + 63) // 64) * 64
        self.w_gate = nn.Linear(d_model, hidden, bias=False)
        self.w_up   = nn.Linear(d_model, hidden, bias=False)
        self.w_down = nn.Linear(hidden, d_model, bias=False)

    def forward(self, x):
        gate = F.silu(self.w_gate(x))   # Swish == SiLU
        up   = self.w_up(x)
        return self.w_down(gate * up)

# Compare param counts to a vanilla GELU FFN
d = 512
gelu_ffn = nn.Sequential(nn.Linear(d, 4*d), nn.GELU(), nn.Linear(4*d, d))
swiglu   = SwiGLU(d)

p_gelu   = sum(p.numel() for p in gelu_ffn.parameters())
p_swiglu = sum(p.numel() for p in swiglu.parameters())
print(f"GELU FFN:    {p_gelu:,}")
print(f"SwiGLU FFN:  {p_swiglu:,}")
# Roughly equal — that's the point of the 8/3 hidden multiplier.`,
        references: [
          { title: "GLU Variants Improve Transformer (Shazeer, 2020)", url: "https://arxiv.org/abs/2002.05202" },
          { title: "Wikipedia: Swish function", url: "https://en.wikipedia.org/wiki/Swish_function" },
        ],
      },
      {
        title: "GQA — Grouped-Query Attention",
        theory: `In standard MHA (Module 4.5), every query head has its own K and V projection. At inference, the **KV cache** stores all of them: \`2 × n_heads × T × head_dim\` per layer per sequence. For long contexts on big models this is the dominant memory cost — billions of bytes per request, often gigabytes per *user*.

**The observation behind [GQA](https://arxiv.org/abs/2305.13245):** queries benefit from having many distinct heads (more "ways of looking at the input"), but K and V show heavy redundancy across heads — many heads end up with very similar key/value patterns. So we can share K and V across groups of query heads with minimal quality loss.

**The mechanism:** \`n_heads\` query heads, but only \`n_kv_heads\` K/V heads, where \`n_kv_heads\` divides \`n_heads\`. Each group of \`n_heads / n_kv_heads\` query heads **shares** one K and one V.

**Concrete numbers:**
- Llama 2 70B: 64 Q heads, 8 KV heads → **8× KV cache reduction**
- Llama 3 8B: 32 Q heads, 8 KV heads → 4× reduction
- Mistral 7B: 32 Q heads, 8 KV heads
- gpt-oss 20B: 8 KV heads with sliding window

In every case, quality matches or nearly matches plain MHA. The savings are essentially free.

**The full spectrum:**
- \`n_kv_heads = n_heads\` → standard **MHA** (most memory, one KV per Q)
- \`1 < n_kv_heads < n_heads\` → **GQA** (the sweet spot)
- \`n_kv_heads = 1\` → **MQA** (multi-query attention; maximum savings, slight quality cost — used in PaLM)

**Going further:** DeepSeek's **MLA** (Module 8.2) takes a completely different approach — instead of *sharing* K/V across heads, it *compresses* them into a low-rank latent space, getting >90% cache reduction. Same goal, more aggressive compression, slightly more compute.

**Implementation trick:** project to \`n_kv_heads\` K/V heads, then use \`repeat_interleave\` along the head dim to broadcast them across the matching query groups. The rest is identical to MHA. Real implementations skip the explicit \`repeat_interleave\` and use SDPA's broadcasting support directly, but for understanding the explicit version is clearer.`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class GroupedQueryAttention(nn.Module):
    def __init__(self, d_model, n_heads, n_kv_heads):
        super().__init__()
        assert n_heads % n_kv_heads == 0
        assert d_model % n_heads == 0
        self.n_heads    = n_heads
        self.n_kv_heads = n_kv_heads
        self.head_dim   = d_model // n_heads
        self.n_rep      = n_heads // n_kv_heads   # how many Qs share one K/V

        self.q_proj = nn.Linear(d_model, n_heads    * self.head_dim, bias=False)
        self.k_proj = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)
        self.v_proj = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)
        self.o_proj = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x, mask=None):
        B, T, C = x.shape
        H, Hkv, D = self.n_heads, self.n_kv_heads, self.head_dim

        q = self.q_proj(x).view(B, T, H,   D).transpose(1, 2)   # (B, H,   T, D)
        k = self.k_proj(x).view(B, T, Hkv, D).transpose(1, 2)   # (B, Hkv, T, D)
        v = self.v_proj(x).view(B, T, Hkv, D).transpose(1, 2)

        # Broadcast K, V from Hkv heads up to H heads
        k = k.repeat_interleave(self.n_rep, dim=1)              # (B, H, T, D)
        v = v.repeat_interleave(self.n_rep, dim=1)

        # Standard attention from here on
        att = (q @ k.transpose(-2, -1)) * D**-0.5
        if mask is not None:
            att = att.masked_fill(mask == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        out = att @ v                                           # (B, H, T, D)
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.o_proj(out)

# Llama 3 8B style: 32 Q heads, 8 KV heads -> 4x KV cache reduction
attn = GroupedQueryAttention(d_model=4096, n_heads=32, n_kv_heads=8)
x = torch.randn(1, 16, 4096)
print(attn(x).shape)`,
        references: [
          { title: "GQA: Training Generalized Multi-Query Transformer Models", url: "https://arxiv.org/abs/2305.13245" },
          { title: "Fast Transformer Decoding (MQA, Shazeer 2019)", url: "https://arxiv.org/abs/1911.02150" },
          { title: "The Llama 3 Herd of Models", url: "https://arxiv.org/abs/2407.21783" },
        ],
      },
    ],
  },
  {
    module: "8. Sparse & efficient (MoE + MLA)",
    icon: Network,
    items: [
      {
        title: "Mixture of Experts (MoE)",
        theory: `**The problem MoE solves:** scaling LLMs is expensive. Bigger models are smarter, but training and inference compute scales linearly with parameter count. What if we could have a model with *more parameters* but the *same compute per token*?

**The answer:** for each token, only use a *fraction* of the parameters. Specifically, replace the dense FFN with a **set of smaller expert FFNs**, plus a tiny **router** that picks which expert(s) to send each token to.

**The architecture.** A standard transformer block has Attention → FFN. In an MoE transformer, the FFN becomes:

1. A **router** (a tiny linear layer): \`scores = router(x)\` → \`(N_experts,)\` per token
2. **Top-k selection**: pick the \`k\` experts with the highest scores (typically \`k=1\` or \`k=2\`)
3. **Compute** only those experts on this token
4. **Weighted sum**: combine their outputs, weighted by softmax over the top-k scores

So if you have 8 experts and \`k=2\`, each token only goes through 2 experts — meaning the *active* compute per token is 2/8 = 25% of the dense equivalent, even though the total parameter count is much larger.

**The headline numbers — active vs total params:**
- **Mixtral 8x7B**: 8 experts, top-2 routing → ~47B total params, ~13B active per token. Quality close to Llama 2 70B at less than 1/3 the inference compute.
- **DeepSeek V3**: 256 routed experts + 1 shared expert, top-8 routing → 671B total, **37B active per token**.
- **gpt-oss-120B**: 128 experts, top-4 routing.

**Why this works empirically:** different experts learn to handle different *kinds* of input. One might specialize in code, another in math, another in dialogue. The router learns to send each token to the right specialist. There's no supervised signal for what each expert should learn — specialization emerges from end-to-end training.

**The catch — load balancing.** Without intervention, the router collapses: it learns to send most tokens to a small set of "winning" experts, and the others atrophy and stop learning. To prevent this, MoE training adds an **auxiliary load-balancing loss** that penalizes uneven routing. Common variants: the [Switch Transformer](https://arxiv.org/abs/2101.03961) loss (penalize imbalance between fraction of tokens per expert and fraction of router probability per expert), and DeepSeek's bias-update trick (no auxiliary loss; adjust per-expert biases instead).

**The other catch — memory.** Active params are smaller, but **all** the experts have to live in GPU memory during training and inference. Mixtral 8x7B is cheap to *run* but still needs 47B params worth of VRAM. This is the fundamental MoE trade-off: trade memory for compute.

**Implementation note:** the loop over experts in the code below is the *pedagogical* version. Production MoE uses fused dispatch/combine kernels (token permutation, expert-parallel matmul, scatter-back) to avoid the Python loop. Frameworks like [Megablocks](https://github.com/databricks/megablocks) provide these.`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class Expert(nn.Module):
    """One small FFN expert. Could be SwiGLU in a real model."""
    def __init__(self, d_model, hidden):
        super().__init__()
        self.fc1 = nn.Linear(d_model, hidden, bias=False)
        self.fc2 = nn.Linear(hidden, d_model, bias=False)

    def forward(self, x):
        return self.fc2(F.gelu(self.fc1(x)))

class MoE(nn.Module):
    def __init__(self, d_model, n_experts=8, top_k=2, hidden_mult=4):
        super().__init__()
        self.n_experts = n_experts
        self.top_k     = top_k
        self.router    = nn.Linear(d_model, n_experts, bias=False)
        self.experts = nn.ModuleList([
            Expert(d_model, hidden_mult * d_model) for _ in range(n_experts)
        ])

    def forward(self, x):
        B, T, C = x.shape
        x_flat = x.view(-1, C)                  # (N, C) where N = B*T
        N = x_flat.size(0)

        # 1. Router scores: how good is each expert for each token?
        logits = self.router(x_flat)            # (N, n_experts)

        # 2. Pick top-k experts per token
        topk_logits, topk_idx = logits.topk(self.top_k, dim=-1)   # (N, k)
        weights = F.softmax(topk_logits, dim=-1)                  # (N, k)

        # 3. Dispatch tokens to their experts and combine
        out = torch.zeros_like(x_flat)
        for e in range(self.n_experts):
            # Which (token, slot) positions chose this expert?
            mask = (topk_idx == e)              # (N, k)
            if not mask.any():
                continue
            token_idx, slot_idx = mask.nonzero(as_tuple=True)
            # Run the expert only on the selected tokens
            expert_out = self.experts[e](x_flat[token_idx])       # (n_e, C)
            # Scale by router weight, accumulate
            out[token_idx] += expert_out * weights[token_idx, slot_idx, None]

        return out.view(B, T, C)

# Mixtral-style: 8 experts, top-2 routing
moe = MoE(d_model=512, n_experts=8, top_k=2)
x = torch.randn(2, 16, 512)
print(moe(x).shape)

# Active vs total params
total  = sum(p.numel() for p in moe.parameters())
expert_params = sum(p.numel() for p in moe.experts[0].parameters())
print(f"Total params:           {total:,}")
print(f"Active params per token: ~{2 * expert_params:,}  (top_k=2)")`,
        references: [
          { title: "Outrageously Large Neural Networks: The Sparsely-Gated MoE Layer", url: "https://arxiv.org/abs/1701.06538" },
          { title: "Switch Transformer: Scaling to Trillion Parameter Models", url: "https://arxiv.org/abs/2101.03961" },
          { title: "Mixtral of Experts (Mixtral 8x7B)", url: "https://arxiv.org/abs/2401.04088" },
          { title: "DeepSeek-V3 Technical Report", url: "https://arxiv.org/abs/2412.19437" },
          { title: "Megablocks: Efficient Sparse Training", url: "https://github.com/databricks/megablocks" },
        ],
      },
      {
        title: "Multi-head Latent Attention (MLA)",
        theory: `GQA (Module 7.4) cuts the KV cache by *sharing* K/V across query head groups. **MLA** ([DeepSeek-V2 paper](https://arxiv.org/abs/2405.04434)) cuts it differently: by *compressing* K and V into a low-rank latent space and only caching the compressed form. Decompress on the fly when actually computing attention.

**The trick — low-rank decomposition.** In standard attention, you have:
\`\`\`
K = x @ W_k    # x: (T, d), W_k: (d, n_heads * head_dim)
V = x @ W_v    # similarly
\`\`\`
\`K\` and \`V\` each have \`n_heads * head_dim\` channels. The KV cache has to store both — that's the dominant inference memory cost.

MLA factors these projections into two steps:
\`\`\`
c = x @ W_dkv      # "down": (T, d) -> (T, latent_dim)   small!
K = c @ W_uk       # "up":   (T, latent_dim) -> (T, n_heads * head_dim)
V = c @ W_uv       # similarly
\`\`\`

The key insight: **only \`c\` needs to be cached.** It's small (\`latent_dim\` ≪ \`n_heads * head_dim\`). At attention time, you decompress \`c\` back to full K and V via \`W_uk\` and \`W_uv\`. The decompression matrices are *fixed parameters*, not per-token state — they don't grow with sequence length.

**The numbers:** DeepSeek V2/V3 use \`latent_dim ≈ 512\` while \`n_heads * head_dim ≈ 4096\`+. That's roughly an **8× reduction** in KV cache, similar to Llama-style GQA — but DeepSeek's ablations show MLA gets *better* perplexity than both GQA and plain MHA at the same cache budget. Compression as regularization, basically.

**The complication — RoPE doesn't compose with the trick directly.** This is the part that's annoyingly subtle. RoPE rotates K based on position; if you cache only \`c\` (pre-RoPE), you'd have to re-rotate after decompression at every attention step, which defeats the savings (the cache is supposed to be position-aware for free). DeepSeek's solution: split each head's channels into two halves — a **NoPE** half (no positional info, fully compressed via MLA) and a **RoPE** half (positionally encoded, cached separately and shared across heads MQA-style). The two halves are concatenated for the actual attention dot product. It's ugly but works.

**Used by:** DeepSeek V2, V3, R1. As of early 2026, MLA is mostly DeepSeek-specific — other labs have stuck with GQA so far, but MLA is gaining attention as DeepSeek's models prove out at scale.

**Conceptual takeaway:** GQA and MLA are two different answers to the same question — *how do we shrink the KV cache?* GQA shares; MLA compresses. The compression view is more powerful in principle (you can compress further than you can share), at the cost of decompression compute and the RoPE coupling complication.

The code below shows the simplified MLA without the RoPE complication — it's clearer for understanding the core mechanism. Real DeepSeek MLA is significantly more involved.`,
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadLatentAttention(nn.Module):
    """Simplified MLA: compress K/V to a small latent, decompress for attention.
    Omits the RoPE-decoupling trick used in real DeepSeek MLA."""
    def __init__(self, d_model, n_heads, latent_dim):
        super().__init__()
        self.n_heads  = n_heads
        self.head_dim = d_model // n_heads
        self.latent_dim = latent_dim

        # Q is normal — no compression
        self.q_proj = nn.Linear(d_model, d_model, bias=False)

        # K, V get compressed via a shared down-projection to latent space
        self.kv_down = nn.Linear(d_model, latent_dim, bias=False)
        # Then up-projected back to full K and V at attention time
        self.k_up = nn.Linear(latent_dim, d_model, bias=False)
        self.v_up = nn.Linear(latent_dim, d_model, bias=False)

        self.o_proj = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x, kv_cache_latent=None):
        """
        x: (B, T, C)
        kv_cache_latent: previously cached compressed latents (B, T_past, latent_dim)
        Returns: (out, new_latent_to_cache)
        """
        B, T, C = x.shape
        H, D = self.n_heads, self.head_dim

        q = self.q_proj(x).view(B, T, H, D).transpose(1, 2)   # (B, H, T, D)

        # Compress current x to latent — this is what gets cached
        c_new = self.kv_down(x)                                # (B, T, latent_dim)

        # Combine with past cached latents
        if kv_cache_latent is not None:
            c = torch.cat([kv_cache_latent, c_new], dim=1)     # (B, T_total, latent_dim)
        else:
            c = c_new
        T_total = c.size(1)

        # Decompress to full K, V on the fly
        k = self.k_up(c).view(B, T_total, H, D).transpose(1, 2)
        v = self.v_up(c).view(B, T_total, H, D).transpose(1, 2)

        att = (q @ k.transpose(-2, -1)) * D**-0.5              # (B, H, T, T_total)
        att = F.softmax(att, dim=-1)
        out = att @ v                                          # (B, H, T, D)
        out = out.transpose(1, 2).contiguous().view(B, T, C)

        return self.o_proj(out), c   # return latent to extend cache

# Compare cache sizes for a Llama-7B-ish config
d_model, n_heads = 4096, 32
T = 4096

mha_cache_per_layer = 2 * n_heads * (d_model // n_heads) * T   # K + V
mla_latent_dim = 512
mla_cache_per_layer = mla_latent_dim * T                       # only latent

print(f"MHA cache per layer: {mha_cache_per_layer:,} elements")
print(f"MLA cache per layer: {mla_cache_per_layer:,} elements")
print(f"Reduction: {mha_cache_per_layer / mla_cache_per_layer:.1f}x")`,
        references: [
          { title: "DeepSeek-V2: A Strong, Economical, and Efficient MoE Language Model", url: "https://arxiv.org/abs/2405.04434" },
          { title: "DeepSeek-V3 Technical Report", url: "https://arxiv.org/abs/2412.19437" },
          { title: "Sebastian Raschka: The Big LLM Architecture Comparison", url: "https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison" },
        ],
      },
    ],
  },
];

// Flatten for navigation
const FLAT = [];
LESSONS.forEach((m, mi) => m.items.forEach((l, li) => FLAT.push({ ...l, module: m.module, mi, li })));

// Tiny markdown-ish renderer: **bold**, `code`, [text](url) links, lists, paragraphs, fenced blocks, simple tables
function renderTheory(text) {
  const parts = text.split(/```\n?/);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <pre key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 my-3 text-xs overflow-x-auto text-zinc-200">
          <code>{part.replace(/\n$/, '')}</code>
        </pre>
      );
    }
    const lines = part.split('\n');
    const out = [];
    let listBuf = [];
    let tableBuf = [];

    const flushList = (key) => {
      if (listBuf.length) {
        out.push(
          <ul key={`ul-${key}`} className="list-disc ml-5 space-y-1 my-2 text-zinc-300">
            {listBuf.map((li, j) => <li key={j}>{inline(li)}</li>)}
          </ul>
        );
        listBuf = [];
      }
    };

    const flushTable = (key) => {
      if (tableBuf.length >= 2) {
        // First row is header, second is separator (|---|---|), rest are body
        const header = tableBuf[0].split('|').map(s => s.trim()).filter(Boolean);
        const body = tableBuf.slice(2).map(row => row.split('|').map(s => s.trim()).filter(Boolean));
        out.push(
          <div key={`tb-${key}`} className="my-3 overflow-x-auto">
            <table className="text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  {header.map((h, j) => <th key={j} className="text-left px-2 py-1 text-zinc-400 font-semibold">{inline(h)}</th>)}
                </tr>
              </thead>
              <tbody>
                {body.map((row, j) => (
                  <tr key={j} className="border-b border-zinc-800/50">
                    {row.map((cell, k) => <td key={k} className="px-2 py-1 text-zinc-300">{inline(cell)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableBuf = [];
    };

    lines.forEach((line, j) => {
      if (/^\s*\|.*\|\s*$/.test(line)) {
        flushList(j);
        tableBuf.push(line.trim());
      } else if (/^\s*-\s+/.test(line)) {
        flushTable(j);
        listBuf.push(line.replace(/^\s*-\s+/, ''));
      } else if (line.trim() === '') {
        flushList(j);
        flushTable(j);
      } else {
        flushList(j);
        flushTable(j);
        out.push(<p key={`p-${j}`} className="my-2 text-zinc-300 leading-relaxed">{inline(line)}</p>);
      }
    });
    flushList('end');
    flushTable('end');
    return <div key={i}>{out}</div>;
  });
}

function inline(text) {
  const tokens = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    const bold = rest.match(/\*\*(.+?)\*\*/);
    const code = rest.match(/`([^`]+)`/);
    const link = rest.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const candidates = [bold, code, link].filter(Boolean);
    if (!candidates.length) { tokens.push(rest); break; }
    const next = candidates.sort((a, b) => a.index - b.index)[0];
    if (next.index > 0) tokens.push(rest.slice(0, next.index));
    if (next === bold) {
      tokens.push(<strong key={key++} className="text-white font-semibold">{bold[1]}</strong>);
    } else if (next === code) {
      tokens.push(<code key={key++} className="bg-zinc-800 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">{code[1]}</code>);
    } else {
      tokens.push(
        <a key={key++} href={link[2]} target="_blank" rel="noopener noreferrer"
          className="text-emerald-400 underline decoration-emerald-400/40 hover:decoration-emerald-300">
          {link[1]}
        </a>
      );
    }
    rest = rest.slice(next.index + next[0].length);
  }
  return tokens;
}

export default function App() {
  const [idx, setIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const lesson = FLAT[idx];
  const Icon = LESSONS[lesson.mi].icon;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clear chat when lesson changes
  useEffect(() => {
    setMessages([]);
  }, [idx]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const systemPrompt = `You are a PyTorch tutor helping a software engineer learn PyTorch, Apple MPS, and modern LLM internals. They have strong programming background but limited prior AI experience. Be concise, technical, and direct, but explain intuition where it helps. Don't over-explain things they obviously know (Python, types, debugging).

The user is currently on lesson: "${lesson.title}" (module: "${lesson.module}").

Current lesson theory:
${lesson.theory}

Current code example:
\`\`\`python
${lesson.code}
\`\`\`

Answer their question in the context of this specific lesson. Reference the code or concepts on screen when relevant. Keep responses under 250 words unless they ask for more depth.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      setMessages([...newMessages, { role: 'assistant', content: text || '(no response)' }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const go = (delta) => {
    const next = Math.max(0, Math.min(FLAT.length - 1, idx + delta));
    setIdx(next);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-72 bg-zinc-900 border-r border-zinc-800 transition-transform overflow-y-auto`}>
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h1 className="font-bold text-lg">PyTorch + MPS</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">From tensors to a modern LLM</p>
        </div>
        <nav className="p-2">
          {LESSONS.map((mod, mi) => {
            const ModIcon = mod.icon;
            return (
              <div key={mi} className="mb-3">
                <div className="flex items-center gap-2 px-2 py-1 text-xs uppercase tracking-wide text-zinc-500">
                  <ModIcon className="w-3.5 h-3.5" />
                  {mod.module}
                </div>
                {mod.items.map((l, li) => {
                  const flatIdx = FLAT.findIndex(f => f.mi === mi && f.li === li);
                  const active = flatIdx === idx;
                  return (
                    <button
                      key={li}
                      onClick={() => { setIdx(flatIdx); setSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${active ? 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                    >
                      {l.title}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-zinc-800 rounded">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0 px-2">
            <div className="text-xs text-zinc-500">{lesson.module}</div>
            <div className="text-sm font-medium truncate">{lesson.title}</div>
          </div>
          <div className="text-xs text-zinc-500 mr-2">{idx + 1}/{FLAT.length}</div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-2 rounded transition ${chatOpen ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-zinc-800'}`}
            title="Ask Claude about this lesson"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-wide text-zinc-500">{lesson.module}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{lesson.title}</h2>

            <div className="prose prose-invert max-w-none">
              {renderTheory(lesson.theory)}
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wide text-zinc-500">
                <Book className="w-3.5 h-3.5" /> Code
              </div>
              <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs md:text-sm overflow-x-auto">
                <code className="text-zinc-200 font-mono whitespace-pre">{lesson.code}</code>
              </pre>
            </div>

            {lesson.references && lesson.references.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wide text-zinc-500">
                  <ExternalLink className="w-3.5 h-3.5" /> Further reading
                </div>
                <ul className="space-y-1.5">
                  {lesson.references.map((ref, i) => (
                    <li key={i} className="text-sm">
                      <a href={ref.url} target="_blank" rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-400/30 hover:decoration-emerald-300">
                        {ref.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pb-8">
              <button
                onClick={() => go(-1)}
                disabled={idx === 0}
                className="flex items-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => go(1)}
                disabled={idx === FLAT.length - 1}
                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm text-white font-medium"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </main>

          {chatOpen && (
            <aside className="fixed md:static inset-0 md:inset-auto md:w-96 bg-zinc-900 md:border-l border-zinc-800 flex flex-col z-40">
              <div className="flex items-center justify-between p-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-sm">Ask about this lesson</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-zinc-800 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="text-xs text-zinc-500 p-3 bg-zinc-800/50 rounded border border-zinc-800">
                    I know what's on your screen. Try:
                    <ul className="mt-2 space-y-1 list-disc ml-4">
                      <li>"Why the √d_k scaling?"</li>
                      <li>"What if I used bf16 here?"</li>
                      <li>"Walk me through the shapes"</li>
                    </ul>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`text-sm ${m.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-2.5 rounded-lg max-w-[90%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-emerald-600/20 text-emerald-100 border border-emerald-600/30' : 'bg-zinc-800 text-zinc-200'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-sm">
                    <div className="inline-block p-2.5 rounded-lg bg-zinc-800 text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-zinc-800 flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about this lesson..."
                  disabled={loading}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded px-3 text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}