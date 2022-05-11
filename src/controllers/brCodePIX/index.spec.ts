import { BRCode } from ".";
import { BRCodeStatic } from "../../@types/brCode/Static";

const defaultData: BRCodeStatic = {
  receiverName: "Weslley",
  receiverCity: "Sao Paulo",
  receiverCountryCode: "BR",
  identifier: "***",
  description: "Teste",
  key: "example123456@example.com",
  keyType: "EMAIL",
};

describe("Creating BRCode", () => {
  it("should create a BRCode without amount", () => {
    const brcode = new BRCode(defaultData);
    expect(brcode.toBRCode()).toBe(
      "00020126560014br.gov.bcb.pix0125example123456@example.com0205Teste5204000053039865802BR5907Weslley6009Sao Paulo62070503***6304D6B4"
    );
  });
  it("should create a BRCode with amount", () => {
    let data = { ...defaultData, amount: 100 };
    const brcode = new BRCode(data);
    expect(brcode.toBRCode()).toBe(
      "00020126560014br.gov.bcb.pix0125example123456@example.com0205Teste5204000053039865406100.005802BR5907Weslley6009Sao Paulo62070503***6304316C"
    );
  });
  it("should not create with big name", () => {
    let data = { ...defaultData, receiverName: "Fulano Ciclano Jose da Silva" };
    expect(() => new BRCode(data)).toThrowError(
      "Receiver name must be less than 25 characters"
    );
  });
  it("should not create without name", () => {
    let data = { ...defaultData, receiverName: "" };
    expect(() => new BRCode(data)).toThrowError("Receiver name must be set");
  });
  it("should not create with big city", () => {
    let data = { ...defaultData, receiverCity: "Fortaleza de Minas" };
    expect(() => new BRCode(data)).toThrowError(
      "Receiver city must be less than 15 characters"
    );
  });
  it("should not create without city", () => {
    let data = { ...defaultData, receiverCity: "" };
    expect(() => new BRCode(data)).toThrowError("Receiver city must be set");
  });
  it("should not create with big country", () => {
    let data = { ...defaultData, receiverCountryCode: "USD" };
    expect(() => new BRCode(data)).toThrowError(
      "Receiver country code must be 2 characters"
    );
  });
  it("should not create with invalid country", () => {
    let data = { ...defaultData, receiverCountryCode: "XX" };
    expect(() => new BRCode(data)).toThrowError(
      "Receiver country code must be a valid country code"
    );
  });
  it("should not create without country", () => {
    let data = { ...defaultData, receiverCountryCode: "" };
    expect(() => new BRCode(data)).toThrowError(
      "Receiver country code must be set"
    );
  });
  it("should not create without identifier", () => {
    let data = { ...defaultData, identifier: "" };
    expect(() => new BRCode(data)).toThrowError("Identifier must be set");
  });
  it("should not create with big identifier", () => {
    let data = { ...defaultData, identifier: "long identifier for testing" };
    expect(() => new BRCode(data)).toThrowError(
      "Identifier must be less than 25 characters"
    );
  });
  it("should not create with big description", () => {
    let data = {
      ...defaultData,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id malesuada biam.",
    };
    expect(() => new BRCode(data)).toThrowError(
      "Description must be less than 77 characters"
    );
  });
  it("should not create with negative amount", () => {
    let data = { ...defaultData, amount: -100 };
    expect(() => new BRCode(data)).toThrowError(
      "Amount must be greater than 0"
    );
  });
  it("should not create without key", () => {
    let data = { ...defaultData, key: "" };
    expect(() => new BRCode(data)).toThrowError("Key must be set");
  });
  it("should not create with big key", () => {
    let data = {
      ...defaultData,
      key: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id malesuada biam.",
    };
    expect(() => new BRCode(data)).toThrowError(
      "Key must be less than 77 characters"
    );
  });
  it("should not create with invalid key", () => {
    let data: BRCodeStatic = {
      ...defaultData,
      key: "45664564566",
      keyType: "EMAIL",
    };
    expect(() => new BRCode(data)).toThrowError(
      "Key must be a valid key for this key type"
    );
  });
  it("should create with CNPJ key type", () => {
    let data: BRCodeStatic = {
      ...defaultData,
      key: "99336905000102",
      keyType: "CNPJ",
    };
    expect(() => new BRCode(data)).not.toThrowError();
  });

  it("should create with CPF key type", () => {
    let data: BRCodeStatic = {
      ...defaultData,
      key: "65952998607",
      keyType: "CPF",
    };
    expect(() => new BRCode(data)).not.toThrowError();
  });
  it("should create with RANDOM key type", () => {
    let data: BRCodeStatic = {
      ...defaultData,
      key: "gfhfghjgfhfghgf",
      keyType: "RANDOM",
    };
    expect(() => new BRCode(data)).not.toThrowError();
  });
  it("should create with EMAIL key type", () => {
    let data: BRCodeStatic = {
      ...defaultData,
      key: "example@example.com",
      keyType: "EMAIL",
    };
    expect(() => new BRCode(data)).not.toThrowError();
  });
  it("should create with PHONE key type", () => {
    let data: BRCodeStatic = {
      ...defaultData,
      key: "+5564996474879",
      keyType: "PHONE",
    };
    expect(() => new BRCode(data)).not.toThrowError();
  });
});
