import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VerificationBadge } from "./VerificationBadge";
import * as publicApi from "../index";

describe("VerificationBadge", () => {
  it("renders with default content and accessible label", () => {
    render(<VerificationBadge />);
    expect(
      screen.getByRole("img", {
        name: /newton holographic verification badge for bizantine/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("VERIFIED")).toBeInTheDocument();
    expect(screen.getByText("BIZANTINE")).toBeInTheDocument();
  });

  it("supports variant and substrate props", () => {
    const { container } = render(
      <VerificationBadge variant="prismatic-coin" substrate="gold" />,
    );
    const root = container.querySelector("[data-variant='prismatic-coin']");
    expect(root).toBeTruthy();
    expect(root).toHaveAttribute("data-substrate", "gold");
  });

  it("renders loading state", () => {
    render(<VerificationBadge loading />);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("respects disabled state and blocks activation", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<VerificationBadge disabled onActivate={onActivate} />);
    const badge = screen.getByRole("img");
    expect(badge).toHaveAttribute("aria-disabled", "true");
    await user.click(badge);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it("fires onActivate on click and keyboard", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<VerificationBadge onActivate={onActivate} />);
    const badge = screen.getByRole("img");
    await user.click(badge);
    expect(onActivate).toHaveBeenCalledTimes(1);
    badge.focus();
    await user.keyboard("{Enter}");
    expect(onActivate).toHaveBeenCalledTimes(2);
    await user.keyboard(" ");
    expect(onActivate).toHaveBeenCalledTimes(3);
  });

  it("hides circular ring when circular text is empty", () => {
    const { container } = render(<VerificationBadge content={{ circular: "" }} />);
    const circ = container.querySelector("[class*='circtext']");
    expect(circ?.className).toMatch(/circtextHidden|Hidden/);
  });

  it("applies custom aria-label and size", () => {
    const { container } = render(
      <VerificationBadge size={240} aria-label="Custom badge label" />,
    );
    expect(screen.getByRole("img", { name: "Custom badge label" })).toBeInTheDocument();
    const root = container.querySelector('[role="img"]') as HTMLElement;
    expect(root.style.width).toBe("240px");
    expect(root.style.height).toBe("240px");
  });

  it("marks empty content", () => {
    const { container } = render(
      <VerificationBadge
        content={{
          verified: "  ",
          brand: "",
          customer: "",
          protocol: "",
          serial: "",
          circular: "",
        }}
      />,
    );
    const root = container.querySelector('[role="img"]');
    expect(root?.className).toMatch(/empty/i);
  });
});

describe("public exports", () => {
  it("exposes VerificationBadge and preset helpers", () => {
    expect(publicApi.VerificationBadge).toBeTypeOf("function");
    expect(publicApi.BADGE_PRESETS.length).toBe(4);
    expect(publicApi.DEFAULT_CONTENT.customer).toBe("BIZANTINE");
    expect(publicApi.DEFAULT_OPTICS.intensity).toBe(0.7);
  });
});
