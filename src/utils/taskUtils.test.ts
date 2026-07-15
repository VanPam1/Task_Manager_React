import { describe, it, expect } from "vitest";
import { isValidTask } from "./taskUtils";

describe("isValidTask", () => {
  it("debe aceptar una tarea válida", () => {
    expect(isValidTask("Comprar pan")).toBe(true);
  });

  it("debe rechazar una tarea vacía", () => {
    expect(isValidTask("")).toBe(false);
  });

  it("debe rechazar solo espacios", () => {
    expect(isValidTask("     ")).toBe(false);
  });
});