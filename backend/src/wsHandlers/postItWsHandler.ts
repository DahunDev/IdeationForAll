import { Socket } from "socket.io";
import { debouncedUpdatePostIt } from "../utils/debounceUtils";
import { PostItUpdate } from "../types/customTypes";
import { authAdmin } from "../configs/firebaseConfig";
import { lockPostIt } from "../services/postItService";

export function handlePostItWs(socket: Socket) {
  console.log(`Client connected: ${socket.id}`);
  // Handle locking a post-it
  socket.on(
    "lockPostIt",
    async (data: { postItId: string; idToken: string }, callback) => {
      try {
        const { postItId, idToken } = data;

        if (!postItId || !idToken) {
          throw new Error("Invalid lock request data");
        } 

        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const userId = decodedToken.uid; // Get the authenticated user ID

        // Attempt to lock the post-it
        await lockPostIt(postItId, userId);

        // Notify the client that locking was successful
        if (callback) {
          callback({ success: true, message: "Post-it locked successfully" });
        }

        // Broadcast to other users that this post-it is now locked
        socket.broadcast.emit("postItLocked", { postItId, lockedBy: userId });
      } catch (error) {
        console.error("Error handling lockPostIt:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (callback) {
          callback({ success: false, message: errorMessage });
        }
      }
    }
  );

  socket.on(
    "updatePostIt",
    async (data: { postItId: string; updates: PostItUpdate; idToken: string }, callback) => {
      try {
        const { postItId, updates, idToken } = data;
        // console.log(JSON.stringify(postItId) + " " + data + " postItId: " + postItId + " updates: " + updates + " idToken: " + idToken);
        if (!postItId || !updates || !idToken) {
          throw new Error("Invalid update data");
        }    
        
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const userId = decodedToken.uid; // Get the authenticated user ID
  
        debouncedUpdatePostIt(postItId, updates, userId);
  
        if (callback) {
          callback({ success: true, message: "Update queued successfully" });
        }
      } catch (error) {
        console.error("Error handling updatePostIt:", error);
  
        // Fix: Cast `error` as `Error` before accessing `.message`
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
  
        if (callback) {
          callback({ success: false, message: errorMessage });
        }
      }
    }
  );
  

  // Ensure all debounced updates are saved on disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    debouncedUpdatePostIt.flush();
  });
}
