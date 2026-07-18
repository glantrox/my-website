import { setContext, getContext } from 'svelte';
import { ConsultationState } from './state.svelte';

const CONSULTATION_KEY = Symbol('CONSULTATION_STATE');

export function initConsultationState(store: any): ConsultationState {
  const state = new ConsultationState(store);
  return setContext(CONSULTATION_KEY, state);
}

export function useConsultationState(): ConsultationState {
  const state = getContext<ConsultationState>(CONSULTATION_KEY);
  if (!state) {
    throw new Error('useConsultationState must be consumed within an initialized subtree');
  }
  return state;
}
