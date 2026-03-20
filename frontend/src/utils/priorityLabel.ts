export const PRIORITY_LABELS = {
  1: { label: 'low',  color: 'gray' },
  2: { label: 'mid',  color: 'orange' },
  3: { label: 'high', color: 'red' },
} as const;

export const getPriorityLabel = (priority: 1 | 2 | 3) => {
  return PRIORITY_LABELS[priority];
};