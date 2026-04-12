import React, { useState, useRef, useEffect } from 'react'
import CodeBlock from './CodeBlock'

export default function Exercise({ exercise }) {
  const [code, setCode] = useState(exercise.starterCode)
  const [showSolution, setShowSolution] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pyodideReady, setPyodideReady] = useState(false)
  const pyodideRef = useRef(null)
  const outputRef = useRef(null)

  // Load Pyodide on first run
  const loadPyodide = async () => {
    if (pyodideReady || isLoading) return

    try {
      setIsLoading(true)
      setOutput('Loading Python runtime...\n')

      // Load Pyodide from CDN
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js'

      script.onload = async () => {
        try {
          const pyodide = await window.loadPyodide()
          pyodideRef.current = pyodide

          // Pre-install packages
          setOutput(prev => prev + 'Installing numpy...\n')
          await pyodide.loadPackage('numpy')

          // Register a mock torch module so exercises can import torch
          setOutput(prev => prev + 'Setting up PyTorch shim...\n')
          pyodide.runPython(`
import sys
import types
import numpy as np

# Create mock torch module backed by numpy
torch = types.ModuleType('torch')
torch.__version__ = '2.3.0+mock'

# Tensor class wrapping numpy
class Tensor:
    def __init__(self, data, dtype=None, requires_grad=False):
        if isinstance(data, Tensor):
            data = data.data
        self.data = np.array(data, dtype=_resolve_dtype(dtype) if dtype else None)
        self.requires_grad = requires_grad
        self.grad = None
        self._grad_fn = None
        self.shape = self.data.shape
        self.dtype = dtype or _numpy_to_torch_dtype(self.data.dtype)
        self.ndim = self.data.ndim

    def __repr__(self):
        return f"tensor({self.data}, dtype={self.dtype})"

    def __add__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data + o)
    def __radd__(self, other): return self.__add__(other)
    def __mul__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data * o)
    def __rmul__(self, other): return self.__mul__(other)
    def __sub__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data - o)
    def __rsub__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(o - self.data)
    def __truediv__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data / o)
    def __neg__(self): return Tensor(-self.data)
    def __pow__(self, other): return Tensor(self.data ** other)
    def __matmul__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data @ o)
    def __getitem__(self, idx): return Tensor(self.data[idx])
    def __len__(self): return len(self.data)
    def __eq__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data == o)
    def __lt__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data < o)
    def __gt__(self, other):
        o = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data > o)

    def item(self): return self.data.item()
    def numpy(self): return self.data.copy()
    def tolist(self): return self.data.tolist()
    def clone(self): return Tensor(self.data.copy(), requires_grad=self.requires_grad)
    def detach(self): return Tensor(self.data.copy())
    def view(self, *shape): return Tensor(self.data.reshape(shape))
    def reshape(self, *shape): return Tensor(self.data.reshape(shape))
    def unsqueeze(self, dim): return Tensor(np.expand_dims(self.data, dim))
    def squeeze(self, dim=None): return Tensor(np.squeeze(self.data, axis=dim))
    def permute(self, *dims): return Tensor(np.transpose(self.data, dims))
    def transpose(self, d0, d1):
        axes = list(range(self.ndim))
        axes[d0], axes[d1] = axes[d1], axes[d0]
        return Tensor(np.transpose(self.data, axes))
    def contiguous(self): return self
    def t(self): return Tensor(self.data.T)
    def mean(self, dim=None, keepdim=False): return Tensor(np.mean(self.data, axis=dim, keepdims=keepdim))
    def sum(self, dim=None, keepdim=False): return Tensor(np.sum(self.data, axis=dim, keepdims=keepdim))
    def max(self, dim=None):
        if dim is None: return Tensor(np.max(self.data))
        return Tensor(np.max(self.data, axis=dim)), Tensor(np.argmax(self.data, axis=dim))
    def min(self, dim=None):
        if dim is None: return Tensor(np.min(self.data))
        return Tensor(np.min(self.data, axis=dim)), Tensor(np.argmin(self.data, axis=dim))
    def argmax(self, dim=None): return Tensor(np.argmax(self.data, axis=dim))
    def float(self): return Tensor(self.data.astype(np.float32))
    def long(self): return Tensor(self.data.astype(np.int64))
    def int(self): return Tensor(self.data.astype(np.int32))
    def half(self): return Tensor(self.data.astype(np.float16))
    def to(self, *args, **kwargs): return self  # no-op for device moves
    def cuda(self): return self
    def cpu(self): return self
    def size(self, dim=None):
        if dim is not None: return self.shape[dim]
        return self.shape
    def dim(self): return self.ndim
    def numel(self): return self.data.size
    def zero_(self):
        self.data.fill(0)
        return self
    def fill_(self, val):
        self.data.fill(val)
        return self
    def backward(self):
        pass  # no-op
    def softmax(self, dim=-1):
        e = np.exp(self.data - np.max(self.data, axis=dim, keepdims=True))
        return Tensor(e / np.sum(e, axis=dim, keepdims=True))
    def log_softmax(self, dim=-1):
        return Tensor(np.log(self.softmax(dim).data + 1e-12))
    def exp(self): return Tensor(np.exp(self.data))
    def log(self): return Tensor(np.log(self.data))
    def sqrt(self): return Tensor(np.sqrt(self.data))
    def abs(self): return Tensor(np.abs(self.data))
    def clamp(self, min=None, max=None): return Tensor(np.clip(self.data, min, max))
    def masked_fill(self, mask, value):
        m = mask.data if isinstance(mask, Tensor) else mask
        out = self.data.copy()
        out[m.astype(bool)] = value
        return Tensor(out)

torch.Tensor = Tensor

# Dtype mapping
_dtype_map = {
    'float32': 'torch.float32', 'float64': 'torch.float64',
    'float16': 'torch.float16', 'int32': 'torch.int32',
    'int64': 'torch.int64', 'bool': 'torch.bool',
}
def _numpy_to_torch_dtype(dt):
    return _dtype_map.get(str(dt), str(dt))
def _resolve_dtype(dt):
    rmap = {
        torch.float32: np.float32, torch.float64: np.float64,
        torch.float16: np.float16, torch.int32: np.int32,
        torch.int64: np.int64, torch.bool: np.bool_,
    }
    return rmap.get(dt, None)

torch.float32 = 'torch.float32'
torch.float64 = 'torch.float64'
torch.float16 = 'torch.float16'
torch.bfloat16 = 'torch.bfloat16'
torch.int32 = 'torch.int32'
torch.int64 = 'torch.int64'
torch.long = 'torch.int64'
torch.bool = 'torch.bool'
torch.float = 'torch.float32'

# Factory functions
def _tensor(data, dtype=None, requires_grad=False): return Tensor(data, dtype=dtype, requires_grad=requires_grad)
torch.tensor = _tensor
torch.randn = lambda *s, **kw: Tensor(np.random.randn(*s).astype(np.float32))
torch.rand = lambda *s, **kw: Tensor(np.random.rand(*s).astype(np.float32))
torch.zeros = lambda *s, **kw: Tensor(np.zeros(s, dtype=np.float32))
torch.ones = lambda *s, **kw: Tensor(np.ones(s, dtype=np.float32))
torch.arange = lambda *a, **kw: Tensor(np.arange(*a))
torch.linspace = lambda s, e, n, **kw: Tensor(np.linspace(s, e, n, dtype=np.float32))
torch.eye = lambda n, **kw: Tensor(np.eye(n, dtype=np.float32))
torch.empty = lambda *s, **kw: Tensor(np.empty(s, dtype=np.float32))
torch.full = lambda s, v, **kw: Tensor(np.full(s, v, dtype=np.float32))
torch.stack = lambda ts, dim=0: Tensor(np.stack([t.data for t in ts], axis=dim))
torch.cat = lambda ts, dim=0: Tensor(np.concatenate([t.data for t in ts], axis=dim))

# Math ops
torch.matmul = lambda a, b: Tensor(a.data @ b.data)
torch.bmm = lambda a, b: Tensor(np.matmul(a.data, b.data))
torch.softmax = lambda t, dim=-1: t.softmax(dim)
torch.log_softmax = lambda t, dim=-1: t.log_softmax(dim)
torch.sigmoid = lambda t: Tensor(1 / (1 + np.exp(-t.data)))
torch.relu = lambda t: Tensor(np.maximum(0, t.data))
torch.tanh = lambda t: Tensor(np.tanh(t.data))
torch.exp = lambda t: Tensor(np.exp(t.data))
torch.log = lambda t: Tensor(np.log(t.data))
torch.sqrt = lambda t: Tensor(np.sqrt(t.data))
torch.abs = lambda t: Tensor(np.abs(t.data))
torch.clamp = lambda t, mn=None, mx=None: Tensor(np.clip(t.data, mn, mx))
torch.sum = lambda t, dim=None, keepdim=False: t.sum(dim, keepdim)
torch.mean = lambda t, dim=None, keepdim=False: t.mean(dim, keepdim)
torch.max = lambda t, dim=None: t.max(dim)
torch.min = lambda t, dim=None: t.min(dim)
torch.argmax = lambda t, dim=None: t.argmax(dim)
torch.no_grad = lambda: type('ctx', (), {'__enter__': lambda s: None, '__exit__': lambda s,*a: None})()
torch.tril = lambda t, diagonal=0: Tensor(np.tril(t.data, diagonal))
torch.triu = lambda t, diagonal=0: Tensor(np.triu(t.data, diagonal))

# Device (no-op)
class _Device:
    def __init__(self, name='cpu'): self.type = name
    def __repr__(self): return self.type
    def __eq__(self, other): return True
torch.device = _Device

# MPS mock
class _Backends:
    class mps:
        @staticmethod
        def is_available(): return True
        @staticmethod
        def is_built(): return True
torch.backends = _Backends()
torch.cuda = types.ModuleType('torch.cuda')
torch.cuda.is_available = lambda: False

# nn module
nn = types.ModuleType('torch.nn')

class Module:
    def __init__(self): self._modules = {}; self._parameters = {}; self.training = True
    def __call__(self, *args, **kwargs): return self.forward(*args, **kwargs)
    def forward(self, *args, **kwargs): raise NotImplementedError
    def parameters(self): return []
    def named_parameters(self): return []
    def train(self, mode=True): self.training = mode; return self
    def eval(self): self.training = False; return self
    def to(self, *args, **kwargs): return self
    def cuda(self): return self
    def cpu(self): return self
    def state_dict(self): return {}
    def load_state_dict(self, d): pass
    def zero_grad(self): pass
    def __repr__(self): return f"{self.__class__.__name__}()"

class Linear(Module):
    def __init__(self, in_f, out_f, bias=True):
        super().__init__()
        self.weight = Tensor(np.random.randn(out_f, in_f).astype(np.float32) * 0.02)
        self.bias = Tensor(np.zeros(out_f, dtype=np.float32)) if bias else None
        self.in_features = in_f
        self.out_features = out_f
    def forward(self, x):
        out = Tensor(x.data @ self.weight.data.T)
        if self.bias is not None:
            out = Tensor(out.data + self.bias.data)
        return out
    def parameters(self): return [self.weight] + ([self.bias] if self.bias else [])

class Embedding(Module):
    def __init__(self, num, dim):
        super().__init__()
        self.weight = Tensor(np.random.randn(num, dim).astype(np.float32) * 0.02)
        self.num_embeddings = num
        self.embedding_dim = dim
    def forward(self, x):
        return Tensor(self.weight.data[x.data.astype(int)])
    def parameters(self): return [self.weight]

class LayerNorm(Module):
    def __init__(self, dims, eps=1e-5):
        super().__init__()
        if isinstance(dims, int): dims = (dims,)
        self.normalized_shape = dims
        self.eps = eps
        self.weight = Tensor(np.ones(dims, dtype=np.float32))
        self.bias = Tensor(np.zeros(dims, dtype=np.float32))
    def forward(self, x):
        m = np.mean(x.data, axis=-1, keepdims=True)
        v = np.var(x.data, axis=-1, keepdims=True)
        return Tensor((x.data - m) / np.sqrt(v + self.eps) * self.weight.data + self.bias.data)
    def parameters(self): return [self.weight, self.bias]

class Dropout(Module):
    def __init__(self, p=0.5): super().__init__(); self.p = p
    def forward(self, x): return x

class ReLU(Module):
    def forward(self, x): return Tensor(np.maximum(0, x.data))

class GELU(Module):
    def forward(self, x):
        return Tensor(0.5 * x.data * (1 + np.tanh(np.sqrt(2/np.pi) * (x.data + 0.044715 * x.data**3))))

class Softmax(Module):
    def __init__(self, dim=-1): super().__init__(); self.dim = dim
    def forward(self, x): return x.softmax(self.dim)

class Sequential(Module):
    def __init__(self, *layers): super().__init__(); self.layers = layers
    def forward(self, x):
        for l in self.layers: x = l(x)
        return x
    def parameters(self):
        p = []
        for l in self.layers: p.extend(l.parameters())
        return p

class ModuleList(Module):
    def __init__(self, modules=None): super().__init__(); self._list = list(modules or [])
    def __getitem__(self, i): return self._list[i]
    def __len__(self): return len(self._list)
    def __iter__(self): return iter(self._list)
    def append(self, m): self._list.append(m)
    def parameters(self):
        p = []
        for m in self._list: p.extend(m.parameters())
        return p

nn.Module = Module
nn.Linear = Linear
nn.Embedding = Embedding
nn.LayerNorm = LayerNorm
nn.Dropout = Dropout
nn.ReLU = ReLU
nn.GELU = GELU
nn.Softmax = Softmax
nn.Sequential = Sequential
nn.ModuleList = ModuleList

# nn.functional
F = types.ModuleType('torch.nn.functional')
F.softmax = lambda t, dim=-1: t.softmax(dim)
F.log_softmax = lambda t, dim=-1: t.log_softmax(dim)
F.relu = lambda t: Tensor(np.maximum(0, t.data))
F.gelu = lambda t: GELU().forward(t)
F.dropout = lambda t, p=0.5, training=True: t
F.cross_entropy = lambda inp, tgt: Tensor(np.array(-np.mean(np.log(np.exp(inp.data[np.arange(len(tgt.data)), tgt.data.astype(int)]) / np.sum(np.exp(inp.data), axis=-1) + 1e-12))))
F.linear = lambda x, w, b=None: Tensor(x.data @ w.data.T + (b.data if b else 0))
nn.functional = F

torch.nn = nn
sys.modules['torch'] = torch
sys.modules['torch.nn'] = nn
sys.modules['torch.nn.functional'] = F

# Optim mock
optim = types.ModuleType('torch.optim')
class _Optimizer:
    def __init__(self, params, lr=0.001, **kw): self.lr = lr
    def step(self): pass
    def zero_grad(self): pass
optim.Adam = type('Adam', (_Optimizer,), {})
optim.AdamW = type('AdamW', (_Optimizer,), {})
optim.SGD = type('SGD', (_Optimizer,), {})
torch.optim = optim
sys.modules['torch.optim'] = optim

print("PyTorch shim loaded (numpy-backed, supports torch.nn, torch.optim)")
`)

          setOutput(prev => prev + 'Python runtime ready!\n\n')
          setPyodideReady(true)
          setIsLoading(false)
        } catch (err) {
          setOutput(`Error initializing Pyodide: ${err.message}`)
          setIsLoading(false)
        }
      }

      script.onerror = () => {
        setOutput('Error loading Pyodide from CDN')
        setIsLoading(false)
      }

      document.head.appendChild(script)
    } catch (err) {
      setOutput(`Error: ${err.message}`)
      setIsLoading(false)
    }
  }

  const handleRunCode = async () => {
    // Load Pyodide if not already loaded
    if (!pyodideReady) {
      await loadPyodide()
      // Wait for Pyodide to be ready
      if (!pyodideRef.current) {
        const maxWait = 30000 // 30 seconds
        const startTime = Date.now()
        while (!pyodideRef.current && Date.now() - startTime < maxWait) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      if (!pyodideRef.current) {
        setOutput('Failed to load Python runtime')
        return
      }
    }

    setIsRunning(true)
    setOutput('')

    try {
      const pyodide = pyodideRef.current

      // Wrap user code to capture output
      const wrappedCode = `
import sys
import io
from contextlib import redirect_stdout, redirect_stderr

# Create string buffers for output
_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()

try:
    with redirect_stdout(_stdout_buffer), redirect_stderr(_stderr_buffer):
${code.split('\n').map(line => '        ' + line).join('\n')}
except Exception as e:
    import traceback
    _stderr_buffer.write(traceback.format_exc())

# Store results
_final_stdout = _stdout_buffer.getvalue()
_final_stderr = _stderr_buffer.getvalue()
`

      try {
        pyodide.runPython(wrappedCode)

        const stdout = pyodide.globals.get('_final_stdout')
        const stderr = pyodide.globals.get('_final_stderr')

        let result = ''
        if (stdout) result += stdout
        if (stderr) result += stderr

        if (!result) result = 'Code executed successfully with no output.\n'

        setOutput(result)
        setIsRunning(false)
      } catch (err) {
        const errorMsg = err.toString()
        setOutput(`Error executing code:\n${errorMsg}\n`)
        setIsRunning(false)
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`)
      setIsRunning(false)
    }
  }

  const handleClearOutput = () => {
    setOutput('')
  }

  const handleReset = () => {
    setCode(exercise.starterCode)
    setShowSolution(false)
    setOutput('')
  }

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const val = e.target.value
      setCode(val.substring(0, start) + '    ' + val.substring(end))
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4
      }, 0)
    }
  }

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRunCode()
    }
    handleTab(e)
  }

  // Scroll output to bottom when new content is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  return (
    <div className="exercise-section">
      <h3>🔨 Exercise: {exercise.title}</h3>
      <div className="exercise-desc">
        {exercise.description.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>

      <div className="exercise-editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Write your Python code here... (Ctrl+Enter or Cmd+Enter to run)"
        />
      </div>

      {/* Output Panel */}
      {output && (
        <div className="exercise-output">
          <div className="output-header">
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              Output
            </span>
            <button
              className="output-clear-btn"
              onClick={handleClearOutput}
            >
              Clear
            </button>
          </div>
          <div className="output-terminal" ref={outputRef}>
            <pre>{output}</pre>
          </div>
        </div>
      )}

      <div className="exercise-actions">
        <button
          className="btn btn-primary"
          onClick={handleRunCode}
          disabled={isLoading || isRunning}
          title="Run code (Ctrl+Enter or Cmd+Enter)"
        >
          {isLoading || isRunning ? (
            <>
              <span className="spinner-inline"></span>
              {isLoading ? 'Loading...' : 'Running...'}
            </>
          ) : (
            '▶ Run Code'
          )}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const blob = new Blob([code], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `exercise_${exercise.title.toLowerCase().replace(/\s+/g, '_')}.py`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          Download .py
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>

      {showSolution && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--green)' }}>
            Solution
          </h4>
          <CodeBlock code={exercise.solution} />
        </div>
      )}
    </div>
  )
}
