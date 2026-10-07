const transitions = {
  BOOT: { START: 'PRELOADING' },
  PRELOADING: { READY: 'READY', FAIL: 'FAILURE' },
  READY: { ENTER: 'ENTER', REDUCED_MOTION: 'SITE' },
  ENTER: { ENTER_COMPLETE: 'SITE' },
  FAILURE: { USE_FALLBACK: 'FALLBACK' },
  FALLBACK: { CONTINUE_STATIC: 'SITE' },
  SITE: {},
}

export function transitionLoadingState(state, event) {
  const next = transitions[state]?.[event]
  if (!next) throw new Error(`Invalid loading transition: ${state} → ${event}`)
  return next
}
