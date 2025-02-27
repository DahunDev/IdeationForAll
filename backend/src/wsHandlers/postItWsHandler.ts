import { Socket } from "socket.io";
import { debouncedUpdatePostIt } from "../utils/debounceUtils";
import { PostItUpdate } from "../types/customTypes";
import { authAdmin } from "../configs/firebaseConfig";

export function handlePostItWs(socket: Socket) {
  console.log(`Client connected: ${socket.id}`);

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
