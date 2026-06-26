import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Medical disclaimer",
  description:
    "Content on Healthy Logs is for general information and education only — not medical advice. Always consult a qualified health provider.",
  path: "/medical-disclaimer",
});

export default function MedicalDisclaimerPage() {
  return (
    <LegalPage title="Medical disclaimer" notice>
      <p>
        The content on Healthy Logs is provided for general informational and
        educational purposes only. It is <strong>not</strong> medical advice and
        is not a substitute for professional medical advice, diagnosis, or
        treatment.
      </p>
      <p>
        Always seek the advice of your physician, registered dietitian, or
        another qualified health provider with any questions you may have
        regarding a medical condition, your diet, or before starting any
        supplement. Never disregard professional medical advice or delay seeking
        it because of something you have read on this site.
      </p>
      <p>
        Statements about supplements and foods have not been evaluated by the
        FDA and are not intended to diagnose, treat, cure, or prevent any
        disease.
      </p>
      <p>
        If you think you may have a medical emergency, call your doctor or
        emergency services immediately.
      </p>
    </LegalPage>
  );
}
