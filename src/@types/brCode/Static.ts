import { keyTypes } from "../../controllers/brCodePIX";

export interface BRCodeStatic {
  receiverName: string;
  receiverCity: string;
  receiverCountryCode: string;
  identifier: string;
  key: string;
  keyType: keyTypes;
  amount?: number;
  description?: string;
  isUniqueTransaction?: boolean;
}
