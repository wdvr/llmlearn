import { modules as pytorchModules, curatedPRs } from './modules'
import { modules as cudaModules } from './cuda-modules'

export const courses = [
  {
    id: 'pytorch-llm',
    title: 'PyTorch & LLMs',
    subtitle: 'Learning on Apple Silicon',
    description: 'Hands-on course covering tensors, backprop, transformers, MPS acceleration, and building your own language model — all on Apple Silicon.',
    icon: '🔥',
    color: '#58a6ff',
    modules: pytorchModules,
    curatedPRs,
    exerciseRuntime: 'pyodide',
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

// Flat helpers for backward compat and route lookup
export const allModules = courses.flatMap(c => c.modules)
export const findCourse = (courseId) => courses.find(c => c.id === courseId)
export const findModuleCourse = (moduleId) => courses.find(c => c.modules.some(m => m.id === moduleId))

// Re-export for anything still importing curatedPRs
export { curatedPRs }
