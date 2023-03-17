import MainPane from "../components/general/MainPane/mainPane";

export default function About() {
  const discordURL = "https://discord.com/";

  return (
    <MainPane title="About" className={"max-w-[800px]"}>
      <div className="glass-inner p-10 round mb-[2rem]">
        <h2>Our History</h2>
        <p>
          Starting as the culminating capstone project for our Computer Science
          degrees, our team of three devised the mission of the Stratosphere
          platform in August and September of 2022.
        </p>
        <p>
          We saw various tools in the Rocket League community, including
          websites for replay analytics, and downloadable programs for in-game
          statistics. We believed we could improve upon what was already
          available as well as bring the online and in-game aspects together
          into a single platform.
        </p>
        <p>
          As such, we stepped out of our comfort zone, bringing together the
          fields of Software Engineering & Architecture, Machine Learning,
          Marketing, and Visual Design in order to bring you the best Rocket
          League analytics experience
        </p>
        <p>
          Released in May 2023, Stratosphere is now host to over 1000 replays
          and 100 users across Steam and Epic. And the future is only upward
          from here.
        </p>
        <h2>Our Team</h2>
        <ul>
          <li>Chris Holland (BS Computer Science) -- In-game: Oakerinos</li>
          <li>
            Matt Jugovic (BA Computer Science, Economics) -- In-game: Novarchite
          </li>
          <li>Caleb Churness (BS Computer Science) -- In-game: Chicken935</li>
        </ul>
      </div>

      {/* Kinda sucks, that I have to fix it like this, but I'll have to investigate why this is causing so much of an issue*/}
      <div className="flex justify-center">
        <a className="primary-btn px-[3rem]" href="https://discord.com/">
          Join Our Discord!
        </a>
      </div>
    </MainPane>
  );
}
