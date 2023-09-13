import SiteHeader from "./SiteHeader";

function About() {
  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto text-center">
        <p className="text-2xl py-4 text-cyber-text-secondary"> About WebFFT</p>

        <p>
          WebFFT started as part of a Microsoft internal Hackathon in 2023, motivated by the lack of actively maintained
          web-based FFT libraries and interest in applying new WebSIMD technology to the problem.
        </p>

        <br></br>
        <div className="flex flex-row gap-4 mx-auto w-full">
          <div>
            <a href="https://github.com/777arc">
              <img className="rounded-3xl" src="https://github.com/777arc.png"></img>Marc
            </a>
          </div>
          <div>
            <a href="https://github.com/lmiguelgato">
              <img className="rounded-3xl" src="https://github.com/lmiguelgato.png"></img>Luis
            </a>
          </div>
          <div>
            <a href="https://github.com/chadp777">
              <img className="rounded-3xl" src="https://github.com/chadp777.png"></img>Chad
            </a>
          </div>
          <div>
            <a href="https://github.com/mcontractor12">
              <img className="rounded-3xl" src="https://github.com/mcontractor12.png"></img>Maheen
            </a>
          </div>
          <div>
            <a href="https://github.com/faikwokms">
              <img className="rounded-3xl" src="https://github.com/faikwokms.png"></img>Fai
            </a>
          </div>
          <div>
            <a href="https://github.com/10sae">
              <img className="rounded-3xl" src="https://github.com/10sae.png"></img>Tensae
            </a>
          </div>
          <div>
            <a href="https://github.com/robotastic">
              <img className="rounded-3xl" src="https://github.com/robotastic.png"></img>Luke
            </a>
          </div>
          <div>
            <a href="https://github.com/Nepomuceno">
              <img className="rounded-3xl" src="https://github.com/Nepomuceno.png"></img>Gabriel
            </a>
          </div>
        </div>

        <br></br>
        <p>
          The project is currently maintained by the <a href="https://github.com/IQEngine/IQEngine">IQEngine</a>{" "}
          organization, as it is heavily used within IQEngine.
        </p>
        <br></br>
        <p>WebFFT is licensed under the MIT License and welcomes Issues/PRs!</p>
      </main>
    </div>
  );
}

export default About;
