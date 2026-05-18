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
  {
    id: 'rl-policy-gradient-ppo',
    title: 'Policy Gradient & PPO — From REINFORCE to RLHF',
    description: 'The other half of modern RL. Why value-based methods (DQN) hit a wall on continuous or huge action spaces, how policy gradient methods bypass that, the variance problem REINFORCE has, and why PPO\'s clipped surrogate became the workhorse for everything from OpenAI Five to RLHF.',
    sections: [
      { title: 'Where DQN Runs Out of Road' },
      { title: 'REINFORCE — The Vanilla Policy Gradient' },
      { title: 'Advantage, Baselines, and GAE' },
      { title: 'The Trust-Region Idea (TRPO)' },
      { title: 'PPO — The Clipped Surrogate' },
      { title: 'The RLHF Connection' },
      { title: 'Where to Go Next' },
    ],
    loader: () => import('./modules/rl02-policy-gradient-ppo.json'),
    relatedModules: [
      { id: 'rl-snake', note: 'DQN — the value-based predecessor PPO improves upon.' },
      { id: 'training-inference-details', note: 'Optimizer / loss patterns that show up in PPO\'s actor-critic loop.' },
      { id: 'attention-deeper', note: 'The LM that RLHF fine-tunes on top of.' },
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
