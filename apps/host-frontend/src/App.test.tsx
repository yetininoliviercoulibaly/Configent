import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the app title", () => {
    render(<App />);
    
    expect(screen.getByText("Configent")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<App />);
    
    expect(screen.getByText("Your Keys, Your Data, Your Runtime")).toBeInTheDocument();
  });

  it("displays the SDK version", () => {
    render(<App />);
    
    expect(screen.getByText(/SDK Version:/)).toBeInTheDocument();
    expect(screen.getByText("0.1.0")).toBeInTheDocument();
  });

  it("shows system ready status", () => {
    render(<App />);
    
    expect(screen.getByText("System Ready")).toBeInTheDocument();
  });
});
