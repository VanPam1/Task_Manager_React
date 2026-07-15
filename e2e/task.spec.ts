import { test, expect } from "@playwright/test";

test("Agregar tarea", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByPlaceholder("Nueva tarea").fill("Comprar pan");

  await page.getByRole("button", {
    name: "Agregar",
  }).click();

  await expect(page.getByText("Comprar pan")).toBeVisible();
});