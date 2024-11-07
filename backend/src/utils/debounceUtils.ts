import { debounce } from "lodash";
import { PostItUpdate } from "../types/customTypes";
import { updatePostItInFirestore } from "../services/postItService";

// A debounced version of Firestore update function
export const debouncedUpdatePostIt = debounce(
    async (postItId: string, updates: PostItUpdate, userId: string) => {
      await updatePostItInFirestore(postItId, updates, userId);
    },
    300 // Debounce delay in milliseconds
  );