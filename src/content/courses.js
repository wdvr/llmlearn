import { modules as pytorchModules, loadModule as loadPytorchModule } from './modules'
import { modules as mpsModules, curatedPRs as mpsCuratedPRs, loadModule as loadMpsModule } from './mps-modules'
import { modules as cudaModules, loadModule as loadCudaModule } from './cuda-modules'

export const courses = [
  {
    id: 'pytorch-llm',
    title: 'PyTorch & LLMs',
    subtitle: 'Tensors, Transformers, and Training',
    description: 'Hands-on course covering autograd, attention, transformers, training loops, modern architectures, and MoE/MLA — device-agnostic.',
    icon: '🔥',
    color: '#58a6ff',
    modules: pytorchModules,
    curatedPRs: [],
    exerciseRuntime: 'pyodide',
  },
  {
    id: 'apple-mps',
    title: 'Apple Silicon GPU (MPS)',
    subtitle: 'Metal Performance Shaders & MLX',
    description: 'GPU programming on Apple Silicon — Metal Performance Shaders, custom Metal Shading Language kernels, MLX, the Apple Neural Engine, and CoreML.',
    icon: '🍎',
    color: '#bc8cff',
    modules: mpsModules,
    curatedPRs: mpsCuratedPRs,
    // Colab T4 demonstrates the same patterns (autocast, AMP, etc.); a future
    // LocalExercise component can let users run snippets natively on MPS.
    exerciseRuntime: 'colab',
  },
  {
    id: 'cuda-parallel',
    title: 'CUDA & Parallel Computing',
    subtitle: 'Based on PMPP (Hwu, Kirk & El Hajj)',
    description: 'Master GPU programming from first principles. Write CUDA kernels in Python with numba.cuda — covering memory hierarchies, tiling, parallel patterns, and performance optimization on Google Colab T4.',
    icon: '⚡',
    color: '#3fb950',
    modules: cudaModules,
    curatedPRs: [],
    exerciseRuntime: 'colab',
  },
]

// Flat helpers for backward compat and route lookup. These operate on the
// manifest only — full module content is loaded on demand via loadModule().
export const allModules = courses.flatMap(c => c.modules)
export const findCourse = (courseId) => courses.find(c => c.id === courseId)
export const findModuleCourse = (moduleId) => courses.find(c => c.modules.some(m => m.id === moduleId))

// Dynamically import the full content for a module (sections.content, quiz, exercise).
// Returns null if the id is unknown.
export async function loadModule(id) {
  return (
    (await loadPytorchModule(id)) ||
    (await loadMpsModule(id)) ||
    (await loadCudaModule(id))
  )
}

// Re-export the curated PRs (now sourced from the MPS course) for any callers
// still importing curatedPRs from this module.
export const curatedPRs = mpsCuratedPRs
