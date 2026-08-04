import { VerificationBadge } from "../../components";

/**
 * Minimal product-integration example.
 * Copy this pattern into the host app after wiring the source import path
 * (or publishing this package internally).
 */
export function ProductExample() {
  return (
    <VerificationBadge
      variant="radial-seal"
      size={280}
      content={{
        verified: "VERIFIED",
        brand: "NEWTON",
        customer: "ACME",
        protocol: "GENUINE PROTOCOL ARTIFACT",
        serial: "N° 000001",
        circular: "SECURE · GENUINE · VALID · AUTHENTIC",
      }}
      optics={{ intensity: 0.7, patOpacity: 0.55 }}
      interaction
      interactionStyle="tilt"
      onActivate={() => {
        // e.g. open certificate detail
      }}
    />
  );
}
