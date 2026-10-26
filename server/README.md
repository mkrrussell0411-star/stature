# Optional backend (Phase 4+)

Not required to play the compiled story. When you enable **AI flavor text** or **live images**, run a self-hosted service here.

Planned components (from build spec):

- LLM proxy with fixed prompt slots (`STYLE`, `STATE`, `SCALE`, `BEAT`)
- Slop filter and structural lint (see `src/js/ai/validate.js` for client-side checks)
- ComfyUI workflow client for keyframe generation

Adult content should stay on local models; do not send story state to hosted image APIs that ban NSFW.
