import SiteHeader from "./SiteHeader";

function About() {
  return (
    <div className="App flex flex-col items-center text-cyber-text min-h-screen min-w-screen">
      <SiteHeader />
      <main className="!font-system container mx-auto text-center">
        <h3
          className="text-cyber-text-secondary"
          aria-describedby="Learn more about the WebFFT Team in this Section"
        >
          {" "}
          About WebFFT
        </h3>

        <p className="text-cyber-text px-4 py-4">
          WebFFT started as part of a Microsoft internal Hackathon in 2023,
          motivated by the lack of actively maintained web-based FFT libraries{" "}
          <br />
          and interest in applying new WebSIMD technology to the problem.
        </p>

        <br></br>
        <div className="flex">
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/777arc" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/777arc.png"
                alt="Marc's profile picture"
              ></img>
              Marc
            </a>
          </div>
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/lmiguelgato" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/lmiguelgato.png"
                alt="Luis's profile picture"
              ></img>
              Luis
            </a>
          </div>
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/chadp777" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/chadp777.png"
                alt="Chad's profile picture"
              ></img>
              Chad
            </a>
          </div>
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/mcontractor12" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/mcontractor12.png"
                alt="Maheen's profile picture"
              ></img>
              Maheen
            </a>
          </div>
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/faikwokms" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/faikwokms.png"
                alt="Fai's profile picture"
              ></img>
              Fai
            </a>
          </div>
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/10sae" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/10sae.png"
                alt="Tensae's profile picture"
              ></img>
              Tensae
            </a>
          </div>
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/robotastic" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/robotastic.png"
                alt="Luke's profile picture"
              ></img>
              Luke
            </a>
          </div>
          <div className="flex flex-col items-center mx-auto">
            <a href="https://github.com/Nepomuceno" target="_blank">
              <img
                className="rounded-3xl w-16"
                src="https://github.com/Nepomuceno.png"
                alt="Gabriel's profile picture"
              ></img>
              Gabriel
            </a>
          </div>
        </div>

        <br></br>
        <p>
          The project is currently maintained by the{" "}
          <a href="https://github.com/IQEngine/IQEngine">IQEngine</a>{" "}
          organization, as it is heavily used within IQEngine.
        </p>
        <br></br>
        <p>WebFFT is licensed under the MIT License and welcomes Issues/PRs!</p>
      </main>
    </div>
  );
}

export default About;
