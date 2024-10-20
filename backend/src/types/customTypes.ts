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
