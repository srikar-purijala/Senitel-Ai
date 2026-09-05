import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (t: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: 'demo-token',
  setToken: (token) => set({ token }),
}));

// DEMO SIMULATION ENGINE
interface DemoEvent {
  id: string;
  timestamp: Date;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
}

interface DemoState {
  isRunning: boolean;
  tickCount: number;
  transactionsProcessed: number;
  eventsAnalyzed: number;
  networksMonitored: number;
  activeThreats: number;
  pendingReview: number;
  exposureDetected: number;
  liveEvents: DemoEvent[];
  
  toggleSimulation: () => void;
  tick: () => void;
  addEvent: (msg: string, type: DemoEvent['type']) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isRunning: true,
  tickCount: 0,
  transactionsProcessed: 12481,
  eventsAnalyzed: 8921,
  networksMonitored: 147,
  activeThreats: 6,
  pendingReview: 18,
  exposureDetected: 1840000,
  liveEvents: [
    { id: '1', timestamp: new Date(Date.now() - 10000), message: 'Simulation initialized.', type: 'INFO' },
  ],
  
  toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),
  
  tick: () => set((state) => {
    if (!state.isRunning) return state;
    
    // Deterministic chaotic growth
    const shouldSpawnThreat = state.tickCount % 15 === 0;
    const shouldProcessTx = true;
    
    let newEvents = [...state.liveEvents];
    
    if (shouldProcessTx && state.tickCount % 2 === 0) {
      newEvents.unshift({
        id: Math.random().toString(),
        timestamp: new Date(),
        message: `Transaction T-${Math.floor(Math.random() * 90000) + 10000} analyzed.`,
        type: 'INFO'
      });
    }
    
    if (shouldSpawnThreat) {
      newEvents.unshift({
        id: Math.random().toString(),
        timestamp: new Date(),
        message: `Coordinated activity detected in NET-${Math.floor(Math.random() * 900) + 100}`,
        type: 'CRITICAL'
      });
    }
    
    if (newEvents.length > 50) newEvents.pop();

    return {
      tickCount: state.tickCount + 1,
      transactionsProcessed: state.transactionsProcessed + Math.floor(Math.random() * 5),
      eventsAnalyzed: state.eventsAnalyzed + Math.floor(Math.random() * 10),
      networksMonitored: state.networksMonitored + (state.tickCount % 20 === 0 ? 1 : 0),
      activeThreats: state.activeThreats + (shouldSpawnThreat ? 1 : 0),
      exposureDetected: state.exposureDetected + (shouldSpawnThreat ? Math.floor(Math.random() * 50000) : 0),
      liveEvents: newEvents,
    };
  }),
  
  addEvent: (message, type) => set((state) => ({
    liveEvents: [{ id: Math.random().toString(), timestamp: new Date(), message, type }, ...state.liveEvents].slice(0, 50)
  }))
}));
