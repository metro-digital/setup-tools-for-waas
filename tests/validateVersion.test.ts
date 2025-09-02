import { test, expect} from "vitest";
import { validateVersion } from "../src/validateVersion";

test("For version waas/latest", () => {
  expect(() => validateVersion("waas/latest")).not.toThrow();
});

test("For version waas/v1", () => {
  expect(() => validateVersion("waas/v1")).not.toThrow();
});

test("For version waas/v1beta1", () => {
  expect(() => validateVersion("waas/v1beta1")).not.toThrow();
});

test("For version waas/v1alpha3", () => {
  expect(() => validateVersion("waas/v1alpha3")).not.toThrow();
});

test("For version waas/v1alpha4", () => {
  expect(() => validateVersion("waas/v1alpha4")).not.toThrow();
});

test("For version waas/v2", () => {
  expect(() => validateVersion("waas/v2")).not.toThrow();
});

test("For version waas/v2alpha1", () => {
  expect(() => validateVersion("waas/v2alpha1")).toThrow();
});

test("For version waas/v2alpha2", () => {
  expect(() => validateVersion("waas/v2alpha2")).toThrow();
});

test("For version waas/v2alpha3", () => {
  expect(() => validateVersion("waas/v2alpha3")).toThrow();
});

test("For version waas/v2alpha4", () => {
  expect(() => validateVersion("waas/v2alpha4")).toThrow();
});
