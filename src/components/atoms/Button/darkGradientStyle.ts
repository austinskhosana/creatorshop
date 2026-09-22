import type { CSSProperties } from "react";

/**
 * The dark gradient action-button treatment used on the explore listing cards
 * ("View Campaign"). Pass to `<Button variant="dark" style={...} />` and add
 * your own `padding` for the context.
 */
export const darkGradientButtonStyle: CSSProperties = {
  borderRadius: "8px",
  fontWeight: 500,
  letterSpacing: "normal",
  background: "linear-gradient(180deg, #323232 0%, #222222 100%)",
  boxShadow: [
    "inset 0 0.5px 1px rgba(255,255,255,0.15)",
    "inset 0 -1px 1.2px 0.35px rgba(18,18,18,1)",
    "0 2px 3px -1px rgba(13,13,13,0.5)",
    "0 0 0 1px rgba(51,51,51,1)",
  ].join(", "),
};
