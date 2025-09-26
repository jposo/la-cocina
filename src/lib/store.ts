import { writable, derived } from "svelte/store";
import { isAuthenticated, user, popupOpen, error } from "./auth";

export { isAuthenticated, user, popupOpen, error };

export const tasks = writable([]);

export const user_tasks = derived([tasks, user], ([$tasks, $user]) => {
  let logged_in_user_tasks: any[] = [];

  if ($user && $user.email) {
    logged_in_user_tasks = $tasks.filter(
      (task: any) => task.user === $user.email,
    );
  }

  return logged_in_user_tasks;
});
