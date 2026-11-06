import { expect, test } from "@playwright/test";

test("browse: home → books → detail", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Your reading" })).toBeVisible();
  await page.getByRole("link", { name: "All books →" }).click();
  await expect(page).toHaveURL(/\/books$/);
  await page.getByRole("link", { name: "Dune" }).click();
  await expect(page.getByRole("heading", { name: "Dune" })).toBeVisible();
  await expect(page).toHaveTitle("Dune · Reading List");
});

test("security: anonymous admin visit goes to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?from=%2Fadmin$/);
});

test("admin: log in and add a book", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("ada@example.com");
  await page.getByPlaceholder("Password").fill("correct horse");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Signed in as Ada (admin).")).toBeVisible();

  await page.getByPlaceholder("Title").fill("Piranesi");
  await page.getByPlaceholder("Author").fill("Susanna Clarke");
  await page.getByPlaceholder("Year").fill("2020");
  await page.getByRole("button", { name: "Add book" }).click();
  await expect(page.getByText("Added “Piranesi”.")).toBeVisible();

  await page.goto("/books?q=piranesi");
  await expect(page.getByRole("link", { name: "Piranesi" })).toBeVisible();
});
