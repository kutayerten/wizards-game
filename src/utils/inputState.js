/**
 * Shared mutable input state – written by React UI, read by game systems.
 * This bridge avoids passing callbacks through the GameEngine.
 */
const InputState = {
  pendingSpell: null, // spell id string or null
};

export default InputState;
