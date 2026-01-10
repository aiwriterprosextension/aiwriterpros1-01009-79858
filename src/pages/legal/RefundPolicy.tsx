import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - AIWriterPros</title>
        <meta name="description" content="30-day money-back guarantee. Our refund policy for AIWriterPros products and services." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">30-Day Money-Back Guarantee</h2>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee on all AIWriterPros purchases. If you're not completely 
                satisfied with your purchase, you can request a full refund within 30 days of your purchase date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How to Request a Refund</h2>
              <p className="text-muted-foreground mb-4">
                To request a refund, please contact our support team:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Email: support@aiwriterpros.com</li>
                <li>Include your order number and reason for refund</li>
                <li>Refunds are processed within 5-7 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Refund Conditions</h2>
              <p className="text-muted-foreground mb-4">
                To qualify for a refund:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Request must be made within 30 days of purchase</li>
                <li>Account must not have generated more than 10 articles</li>
                <li>User must not have violated our Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Non-Refundable Items</h2>
              <p className="text-muted-foreground">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Purchases made more than 30 days ago</li>
                <li>Accounts that have been terminated for abuse</li>
                <li>Accounts that have generated excessive content for resale purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our refund policy, please contact us at support@aiwriterpros.com.
              </p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default RefundPolicy;
