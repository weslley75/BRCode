import { BRCodeStatic } from "../../@types/brCode/Static";
import validator from "validator";
import { crc16ccitt } from "crc";

const keyTypesValidation = {
  EMAIL: (value: string) => validator.isEmail(value),
  PHONE: (value: string) =>
    validator.isMobilePhone(value, undefined, { strictMode: true }),
  CPF: (value: string) => validator.isTaxID(value, "pt-BR"),
  CNPJ: (value: string) => validator.isTaxID(value, "pt-BR"),
  RANDOM: () => true,
};

export type keyTypes = keyof typeof keyTypesValidation;

export class BRCode {
  private _keyType: keyTypes;

  private readonly _payloadFormatIndicator = "01";

  private readonly _gui = "br.gov.bcb.pix"; // GUI
  private _key: string | undefined; // Chave PIX
  private _description: string | undefined; // infoAdicional

  private readonly _merchantCategoryCode: string = "0000";

  private readonly _currencyCode = "986";

  private _amount: number | undefined;

  private _receiverCountryCode: string | undefined;

  private _receiverName: string | undefined;

  private _receiverCity: string | undefined;

  private _identifier: string | undefined;

  private _isUniqueTransaction = false;

  private get merchantInformation(): string {
    return [
      this.getEVM(0, this._gui),
      this.getEVM(1, this._key),
      this._description && this.getEVM(2, this._description),
    ].join("");
  }

  private get additionalDataFields(): string {
    return [this.getEVM(5, this._identifier)].join("");
  }

  constructor(data: BRCodeStatic) {
    this.receiverName = data.receiverName.trim();
    this.receiverCity = data.receiverCity.trim();
    this.receiverCountryCode = data.receiverCountryCode.trim();
    this.identifier = data.identifier.trim();
    this.description = data.description?.trim();
    this.amount = data.amount;
    this._keyType = data.keyType;
    this.key = data.key.trim();
    this._isUniqueTransaction = data.isUniqueTransaction || false;
  }

  private padTwoZeros(value: number): string {
    return value.toString().padStart(2, "0");
  }

  private getEVM(id: number, value: string | undefined): string {
    if (value) {
      return `${this.padTwoZeros(id)}${this.padTwoZeros(value.length)}${value}`;
    }
    return "";
  }

  toBRCode(): string {
    const data = [
      this.getEVM(0, this._payloadFormatIndicator),
      this.getEVM(26, this.merchantInformation),
      this.getEVM(52, this._merchantCategoryCode),
      this.getEVM(53, this._currencyCode),
      this.getEVM(54, this._amount?.toFixed(2)),
      this.getEVM(58, this._receiverCountryCode),
      this.getEVM(59, this._receiverName),
      this.getEVM(60, this._receiverCity),
      this.getEVM(62, this.additionalDataFields),
      6304,
    ].join("");

    return data + crc16ccitt(data).toString(16).toUpperCase();
  }

  private set receiverName(value: string) {
    if (!value) {
      throw new Error("Receiver name must be set");
    }
    if (value.length > 25) {
      throw new Error("Receiver name must be less than 25 characters");
    }
    this._receiverName = value;
  }

  private set receiverCity(value: string) {
    if (!value) {
      throw new Error("Receiver city must be set");
    }
    if (value.length > 15) {
      throw new Error("Receiver city must be less than 15 characters");
    }
    this._receiverCity = value;
  }

  private set receiverCountryCode(value: string) {
    if (!value) {
      throw new Error("Receiver country code must be set");
    }
    if (value.length != 2) {
      throw new Error("Receiver country code must be 2 characters");
    }
    if (!validator.isISO31661Alpha2(value)) {
      throw new Error("Receiver country code must be a valid country code");
    }
    this._receiverCountryCode = value;
  }

  private set identifier(value: string) {
    if (!value) {
      throw new Error("Identifier must be set");
    } else if (value.length > 25) {
      throw new Error("Identifier must be less than 25 characters");
    }
    this._identifier = value;
  }

  private set description(value: string | undefined) {
    if (value && value.length > 77) {
      throw new Error("Description must be less than 77 characters");
    }
    this._description = value;
  }

  private set amount(value: number | undefined) {
    if (value && value < 0) {
      throw new Error("Amount must be greater than 0");
    }
    this._amount = value;
  }

  private set key(value: string) {
    if (!value) {
      throw new Error("Key must be set");
    } else if (value.length > 77) {
      throw new Error("Key must be less than 77 characters");
    } else if (!keyTypesValidation[this._keyType](value)) {
      throw new Error("Key must be a valid key for this key type");
    }
    this._key = value;
  }
}
