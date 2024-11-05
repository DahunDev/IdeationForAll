// src/types/customTypes.ts
import { Request } from "express";
import { IncomingHttpHeaders } from "http";

export interface UserPayload {
  uid: string;
  email?: string;
  displayName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
  headers: IncomingHttpHeaders; // Use IncomingHttpHeaders instead of a custom object
}


export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type PostItUpdateData = {
  postItId: string;
  content?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  userId: string;
};