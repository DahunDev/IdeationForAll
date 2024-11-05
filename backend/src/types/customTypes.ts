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

export interface PostItUpdate {
  position?: Position;
  size?: Size;
  content?: string;
  name?: string;
  font?: string;
}

export interface ValidPostItUpdate extends PostItUpdate {
  position?: Position;
  size?: Size;
  content?: string;
  name?: string;
  font?: string;
}