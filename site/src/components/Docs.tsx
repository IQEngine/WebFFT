import SiteHeader from "./SiteHeader";

function Docs() {
  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto text-center">
        <p>Documentation!</p>
      </main>
    </div>
  );
}

export default Docs;
