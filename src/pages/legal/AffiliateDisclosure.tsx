import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AffiliateDisclosure = () => {
  return (
    <>
      <Helmet>
        <title>Affiliate Disclosure - AIWriterPros</title>
        <meta name="description" content="Affiliate disclosure and FTC compliance information for AIWriterPros." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Affiliate Disclosure</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">FTC Disclosure</h2>
              <p className="text-muted-foreground">
                In accordance with the Federal Trade Commission's 16 CFR Part 255: "Guides Concerning the Use of 
                Endorsements and Testimonials in Advertising," we want to be transparent about our affiliate relationships.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Amazon Affiliate Program</h2>
              <p className="text-muted-foreground">
                AIWriterPros is a participant in the Amazon Services LLC Associates Program, an affiliate advertising 
                program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
              </p>
              <p className="text-muted-foreground mt-4">
                Content generated through our platform may contain Amazon affiliate links. When you click on these links 
                and make purchases, we may earn a commission at no additional cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">User-Generated Content</h2>
              <p className="text-muted-foreground">
                Articles and content created using AIWriterPros may include affiliate links as configured by our users. 
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Properly disclosing affiliate relationships in their published content</li>
                <li>Complying with FTC guidelines and Amazon's Terms of Service</li>
                <li>Including appropriate disclaimers on their websites</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Earnings Disclaimer</h2>
              <p className="text-muted-foreground">
                While we provide tools to help create affiliate marketing content, we make no guarantees about earnings 
                or income. Results vary based on many factors including market conditions, your audience, and effort invested.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
              <p className="text-muted-foreground">
                Testimonials appearing on this site reflect real experiences of real customers. However, individual results 
                may vary. We do not claim that these results are typical, and you should not expect to experience the same 
                results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact</h2>
              <p className="text-muted-foreground">
                If you have questions about our affiliate relationships, please contact us at legal@aiwriterpros.com.
              </p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AffiliateDisclosure;
