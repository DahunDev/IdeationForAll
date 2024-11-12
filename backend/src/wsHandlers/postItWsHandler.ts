import { Socket } from "socket.io";
import { debouncedUpdatePostIt } from "../utils/debounceUtils";
import { PostItUpdate } from "../types/customTypes";

export function handlePostItWs(socket: Socket) {
  socket.on(
    "updatePostIt",
    (data: { postItId: string; updates: PostItUpdate; userId: string }) => {
      const { postItId, updates, userId } = data;

      // Use the debounced function for all updates
      debouncedUpdatePostIt(postItId, updates, userId);
    },
  );

  // Ensure all debounced updates are saved on disconnect
  socket.on("disconnect", () => {
    debouncedUpdatePostIt.flush();
  });
}
