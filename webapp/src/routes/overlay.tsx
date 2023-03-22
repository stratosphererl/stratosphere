import MainPane from "../components/general/MainPane/mainPane";
export default function Overlay() {
  const bakkesModURL = "https://bakkesmod.com/download.php";
  const discordURL = "https://discord.com/";
  const videoURL = "https://www.youtube.com/embed/X290anUi9qE";

  return (
    <MainPane className="max-w-[800px]" title="Overlay">
      <iframe
        className="m-auto round border-white w-full"
        src={videoURL}
        height="315"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>

      <div className="glass-inner p-10 round mb-[2rem] mt-[2rem]">
        <h2>Instructions</h2>
        <p>
          To get our in-game overlay, head over to our page on BakkesMod, linked{" "}
          <a href={bakkesModURL}>here.</a>
        </p>
        <ol>
          <li>Download BakkesMod if you don’t have it already</li>
          <li>Download our overlay plugin via the BakkesMod website</li>
          <li>Run the BakkesMod program and then start Rocket League</li>
          <li>Open the BakkesMod control panel when in-game</li>
          <li>Go to the ‘Options’ tab and enable our plugin</li>
        </ol>
        <p>
          If you have any problem getting the overlay to work, you can reach out
          to us on our Discord server <a href={discordURL}>here.</a>
        </p>
      </div>

      {/* Kinda sucks, that I have to fix it like this, but I'll have to investigate why this is causing so much of an issue*/}
      <div className="flex justify-center">
        <a className="primary-btn px-[3rem]" href={bakkesModURL}>
          Go to Bakkes Page
        </a>
      </div>
    </MainPane>
  );
}
