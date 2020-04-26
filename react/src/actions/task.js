export const SET_TASKS = 'SET_TASKS';

export function setTasks(pendingTasksList) {
  return { type: SET_TASKS, payload: pendingTasksList };
}
