import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DMCA = () => {
  return (
    <>
      <Helmet>
        <title>DMCA Policy - AIWriterPros</title>
        <meta name="description" content="Digital Millennium Copyright Act (DMCA) policy for AIWriterPros." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">DMCA Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Copyright Infringement Notification</h2>
              <p className="text-muted-foreground">
                AIWriterPros respects the intellectual property rights of others and expects its users to do the same. 
                In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously 
                to claims of copyright infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Filing a DMCA Notice</h2>
              <p className="text-muted-foreground mb-4">
                If you believe that your copyrighted work has been copied and is accessible on our service in a way 
                that constitutes copyright infringement, please provide our DMCA Agent with the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information (address, phone number, email)</li>
                <li>A statement that you have a good faith belief that the use is not authorized</li>
                <li>A statement that the information in the notification is accurate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">DMCA Agent Contact</h2>
              <p className="text-muted-foreground">
                Please send DMCA notices to:
              </p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <p className="text-foreground">DMCA Agent</p>
                <p className="text-muted-foreground">AIWriterPros</p>
                <p className="text-muted-foreground">Email: dmca@aiwriterpros.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Counter-Notification</h2>
              <p className="text-muted-foreground">
                If you believe that your content was removed or disabled by mistake or misidentification, 
                you may file a counter-notification with our DMCA Agent containing the required information 
                as specified under the DMCA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Repeat Infringers</h2>
              <p className="text-muted-foreground">
                It is our policy to terminate the accounts of users who are repeat infringers of copyrights.
              </p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default DMCA;
