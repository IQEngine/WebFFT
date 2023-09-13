import SiteHeader from "./SiteHeader";

function NotFound() {
  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto text-center">
        <h1 className="text-cyber-text-secondary">
          404 <br />
          Not Found
        </h1>
      </main>
    </div>
  );
}

export default NotFound;
