import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalH2 } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service | CLARUM" },
      { name: "description", content: "Terms governing use of clarumpeptides.com and purchase of Clarum research peptides." },
      { property: "og:title", content: "Terms of Service | CLARUM" },
      { property: "og:description", content: "Terms governing use of clarumpeptides.com and purchase of Clarum research peptides." },
    ],
  }),
});

function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" lastUpdated="May 23, 2026">
      <p>
        Welcome to Clarum, operated by TLSEVEN LLC ("Clarum," "we," "us," or "our"), a Texas
        limited liability company with its principal address at 17350 State Hwy 249, Ste 220
        #32971, Houston, Texas 77064. By accessing clarumpeptides.com or purchasing any product
        from us, you ("you" or "Customer") agree to these Terms of Service. If you do not agree,
        do not use the site or purchase any product.
      </p>

      <LegalH2>1. Research Use Only</LegalH2>
      <p>
        All products sold by Clarum are intended exclusively for in vitro laboratory research by
        qualified researchers. Products are NOT for human consumption, veterinary use, dietary or
        nutritional supplementation, clinical application, cosmetic use, or any other purpose.
        You represent that any product purchased will be used solely for legitimate scientific
        research in accordance with all applicable laws and regulations.
      </p>

      <LegalH2>2. Eligibility</LegalH2>
      <p>
        You must be at least 18 years of age to access the site or place an order. By using the
        site, you represent and warrant that you are at least 18, that you have full legal
        capacity to enter this agreement, and that you are not prohibited from purchasing
        research chemicals under the laws of your jurisdiction.
      </p>

      <LegalH2>3. No Medical Claims</LegalH2>
      <p>
        Clarum makes no representations or warranties, express or implied, regarding the safety,
        efficacy, fitness for any particular purpose, or human or animal application of any
        product. No statement on this site has been evaluated by the U.S. Food and Drug
        Administration, European Medicines Agency, or any other regulatory body. Nothing on this
        site constitutes medical advice.
      </p>

      <LegalH2>4. Product Accuracy</LegalH2>
      <p>
        We make reasonable efforts to ensure product descriptions, pricing, and certificates of
        analysis are accurate, but we do not warrant that all information is error-free. We
        reserve the right to correct errors, update content, change prices, and cancel orders
        affected by pricing errors at any time without notice.
      </p>

      <LegalH2>5. Orders and Payment</LegalH2>
      <p>
        Submitting an order constitutes an offer to purchase that we may accept or reject.
        Payment is processed via approved methods including cryptocurrency, ACH/wire transfer,
        and authorized payment processors. We reserve the right to refuse any order at our sole
        discretion, including orders that appear fraudulent, are placed in restricted
        jurisdictions, or violate these Terms.
      </p>

      <LegalH2>6. Restricted Jurisdictions</LegalH2>
      <p>
        We do not ship to jurisdictions where the sale or possession of research peptides is
        restricted or prohibited. You are solely responsible for ensuring that ordering,
        importing, possessing, and using our products is lawful in your jurisdiction. Any
        duties, taxes, or fees imposed by your jurisdiction are your sole responsibility.
      </p>

      <LegalH2>7. No Refunds or Returns</LegalH2>
      <p>
        ALL SALES ARE FINAL. We do not accept returns, exchanges, or refunds under any
        circumstances. See our Refund Policy for full details.
      </p>

      <LegalH2>8. Shipping and Risk of Loss</LegalH2>
      <p>
        Title and risk of loss transfer to you when the carrier accepts the package. We are not
        responsible for lost, stolen, delayed, or damaged shipments after carrier acceptance,
        except as expressly stated in our Shipping Policy.
      </p>

      <LegalH2>9. Intellectual Property</LegalH2>
      <p>
        All site content — including text, graphics, logos, product images, COAs, and the Clarum
        name and marks — is the property of TLSEVEN LLC or its licensors and is protected by
        U.S. and international copyright, trademark, and other intellectual property laws. You
        may not copy, reproduce, distribute, or create derivative works without our prior
        written consent.
      </p>

      <LegalH2>10. Accounts</LegalH2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and
        for all activity under your account. Notify us immediately if you suspect unauthorized
        access.
      </p>

      <LegalH2>11. Prohibited Conduct</LegalH2>
      <p>
        You agree not to: (a) use the site for any unlawful purpose; (b) submit false or
        misleading information; (c) attempt to bypass security, rate limits, or access
        restrictions; (d) resell products without authorization; (e) use products for any
        purpose other than in vitro research; (f) misrepresent the nature of our products to any
        third party.
      </p>

      <LegalH2>12. Disclaimer of Warranties</LegalH2>
      <p>
        THE SITE AND ALL PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF
        ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE
        WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
      </p>

      <LegalH2>13. Limitation of Liability</LegalH2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, TLSEVEN LLC AND ITS MEMBERS, OFFICERS,
        EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL,
        SPECIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, ARISING FROM YOUR USE OF THE SITE OR
        ANY PRODUCT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL AGGREGATE
        LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SPECIFIC PRODUCT GIVING RISE TO
        THE CLAIM.
      </p>

      <LegalH2>14. Indemnification</LegalH2>
      <p>
        You agree to indemnify, defend, and hold harmless TLSEVEN LLC and its affiliates from
        any claim, demand, loss, or expense (including reasonable attorneys' fees) arising from:
        (a) your breach of these Terms; (b) your misuse of any product; (c) your violation of
        any law or third-party right.
      </p>

      <LegalH2>15. Governing Law and Disputes</LegalH2>
      <p>
        These Terms are governed by the laws of the State of Texas, without regard to
        conflict-of-law principles. Any dispute arising from these Terms or your use of the site
        shall be resolved exclusively in the state or federal courts located in Harris County,
        Texas, and you consent to the personal jurisdiction of those courts.
      </p>

      <LegalH2>16. Changes to Terms</LegalH2>
      <p>
        We may update these Terms at any time. Updates take effect when posted to this page.
        Your continued use of the site after changes constitutes acceptance of the revised
        Terms.
      </p>

      <LegalH2>17. Contact</LegalH2>
      <p>
        Questions about these Terms? Contact us at{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
