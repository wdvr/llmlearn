// Manifest-only entries for the Reinforcement Learning course. Full module
// content (sections.content, quiz, exercise) is dynamic-imported on demand
// via loadModule(id) so each module ships in its own chunk.

export const modules = [
  {
    id: 'rl-snake',
    title: 'DQN: Train an Agent to Play Snake',
    description: 'A working end-to-end DQN tutorial. Build a Snake environment, design state/action/reward, implement DQN with replay buffer + target network, train it on your Mac (MPS) or GPU. The bridge from supervised learning to value-based RL.',
    sections: [
      { title: 'Why Snake' },
      { title: 'RL Vocabulary in 5 Minutes' },
      { title: 'Game Design: State, Action, Reward' },
      { title: 'Q-Learning, DQN, and the One Equation You Need' },
      { title: 'The PyTorch Network' },
      { title: 'The Training Loop' },
      { title: 'Mac vs GPU: Which to Train On' },
      { title: 'Tuning, Failure Modes & What "Solved" Looks Like' },
      { title: 'Where This Goes Next' },
    ],
    loader: () => import('./modules/module11-rl-snake.json'),
    relatedModules: [
      { id: 'tensors-devices', note: 'Device-agnostic PyTorch patterns — MPS → CUDA → CPU auto-detect.' },
      { id: 'nn-module-training', note: 'The same training-loop skeleton from supervised learning, adapted for RL.' },
      { id: 'mps-apple-gpu-architecture', note: 'Why Snake DQN trains so well on MPS — small model, unified memory.' },
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
