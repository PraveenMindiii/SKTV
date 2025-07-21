// SessionModalController.ts
let triggerSessionExpiredModal: (() => void) | null = null;

export const setTrigger = (fn: () => void) => {
  triggerSessionExpiredModal = fn;
};

export const showSessionExpiredModal = () => {
  if (triggerSessionExpiredModal) triggerSessionExpiredModal();
};
