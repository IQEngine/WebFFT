import SiteHeader from "./SiteHeader";

function About() {
  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto text-center">
        <p>About Us</p>
      </main>
    </div>
  );
}

export default About;
