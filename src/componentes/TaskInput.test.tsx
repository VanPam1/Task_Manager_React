import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TaskInput from "./TaskInput";

describe("TaskInput", () => {
  it("llama a onAdd cuando se escribe una tarea", async () => {
    const onAdd = vi.fn();

    render(<TaskInput onAdd={onAdd} />);

    const usuario = userEvent.setup();

    await usuario.type(
      screen.getByPlaceholderText("Escribe una nueva tarea"),
      "Comprar leche"
    );

    await usuario.click(screen.getByText("Agregar"));

    expect(onAdd).toHaveBeenCalledWith("Comprar leche");
  });

  it("no agrega una tarea vacía", async () => {
    const onAdd = vi.fn();

    render(<TaskInput onAdd={onAdd} />);

    const usuario = userEvent.setup();

    await usuario.click(screen.getByText("Agregar"));

    expect(onAdd).not.toHaveBeenCalled();
  });
});