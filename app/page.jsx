"use client";

export default function HomePage() {
  const buckets = [
    {
      percent: "40%",
      title: "Developers",
      subtitle: "Paid in SOL",
      tone: "blue",
      metricA: "— SOL",
      labelA: "Developer earnings",
      metricB: "Awaiting live feed",
      labelB: "Authoritative production data",
    },
    {
      percent: "30%",
      title: "HOST Holders",
      subtitle: "HOST rewards",
      tone: "purple",
      metricA: "— HOST",
      labelA: "HOST purchased",
      metricB: "— HOST",
      labelB: "Awaiting distribution",
      countdown: "Distribution clock activates at launch",
    },
    {
      percent: "20%",
      title: "Treasury / Operations",
      subtitle: "Platform operations",
      tone: "green",
      metricA: "— SOL",
      labelA: "Treasury allocation",
      metricB: "Awaiting live feed",
      labelB: "Authoritative production data",
    },
    {
      percent: "10%",
      title: "Host Communities",
      subtitle: "HOST rewards",
      tone: "gold",
      metricA: "— HOST",
      labelA: "HOST purchased",
      metricB: "— HOST",
      labelB: "Awaiting distribution",
      countdown: "Distribution clock activates at launch",
    },
  ];

  const launches = [
    ["Child token", "Selected Host Community", "Status", "Volume"],
    ["—", "—", "No production launches yet", "—"],
    ["—", "—", "Live data will appear here", "—"],
    ["—", "—", "Authoritative on-chain feed only", "—"],
  ];

  return (
    <main className="siteShell">
      <div className="gridGlow" />
      <div className="page">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="HOSTPAY home">
            <img src="/hostpay-header.png" alt="HOSTPAY - Launch. Reward. Grow." />
          </a>

          <nav className="nav">
            <a href="#economy">Economics</a>
            <a href="#launchpad">Launchpad</a>
            <a href="#developers">Developers</a>
            <a href="#rewards">Rewards</a>
            <a href="#robo">ASK ROBO</a>
          </nav>

          <div className="headerActions">
            <div className="networkPill">
              <span className="networkDot" />
              Solana
            </div>
            <button className="walletButton" type="button" disabled>
              Connect Wallet
            </button>
          </div>
        </header>

        <section id="top" className="hero">
          <div className="heroCopy">
            <div className="eyebrow">THE SOLANA LAUNCHPAD THAT GIVES BACK</div>
            <h1>
              Launch. Reward. <span>Grow.</span>
            </h1>
            <p>
              HOSTPAY is a Solana launchpad where platform activity is designed
              to flow back to developers, HOST holders, host communities and
              sustainable platform operations.
            </p>

            <div className="heroButtons">
              <a href="#launchpad" className="primaryButton">
                Launch a Token <b>→</b>
              </a>
              <a href="#economy" className="secondaryButton">
                See the 1% Economy
              </a>
            </div>

            <div className="featureStrip">
              <div>
                <strong>1% Platform Fee</strong>
                <span>40 / 30 / 20 / 10</span>
              </div>
              <div>
                <strong>No staking required</strong>
                <span>Snapshot-based rewards</span>
              </div>
              <div>
                <strong>Built on Solana</strong>
                <span>Fast. Transparent. On-chain.</span>
              </div>
            </div>
          </div>

          <div className="worldStage" aria-label="Animated HOSTPAY ecosystem">
            <div className="star star1" />
            <div className="star star2" />
            <div className="star star3" />
            <div className="star star4" />

            <div className="worldHalo haloOne" />
            <div className="worldHalo haloTwo" />
            <div className="worldHalo haloThree" />

            <div className="orbit orbitA">
              <div className="planet p1">◎</div>
            </div>
            <div className="orbit orbitB">
              <div className="planet p2">Σ</div>
            </div>
            <div className="orbit orbitC">
              <div className="planet p3">◈</div>
            </div>
            <div className="orbit orbitD">
              <div className="planet p4">●●●</div>
            </div>

            <div className="world">
              <div className="worldLongitude long1" />
              <div className="worldLongitude long2" />
              <div className="worldLatitude lat1" />
              <div className="worldLatitude lat2" />
              <div className="worldMap mapA" />
              <div className="worldMap mapB" />
              <div className="hMark">H</div>
            </div>

            <div className="worldBase">
              <div className="baseRing r1" />
              <div className="baseRing r2" />
              <div className="baseRing r3" />
            </div>

            <div className="worldLegend">
              <span>BUILD</span>
              <span>LAUNCH</span>
              <span>REWARD</span>
              <span>GROW</span>
              <span>TOGETHER</span>
            </div>
          </div>

          <aside id="robo" className="roboPanel">
            <div className="roboHeader">
              <div>
                <div className="roboTitle">
                  ASK ROBO <span className="online">● Online</span>
                </div>
                <div className="roboSub">Your HOSTPAY intelligence assistant</div>
              </div>
              <div className="roboBot">
                <div className="botAntenna" />
                <div className="botFace">
                  <i />
                  <i />
                </div>
                <div className="botBody">H</div>
              </div>
            </div>

            <p>
              Ask anything about HOSTPAY, launch economics, reward provenance,
              child tokens or host communities.
            </p>

            <div className="promptChips">
              <button type="button">How does HOSTPAY work?</button>
              <button type="button">Explain the 1% split</button>
              <button type="button">Why did I receive HOST?</button>
              <button type="button">How do I launch?</button>
            </div>

            <div className="roboInput">
              <span>ASK ROBO public interface arrives with 8E9</span>
              <button type="button" disabled>➤</button>
            </div>

            <div className="roboFoot">
              ROBO answers HOSTPAY ecosystem questions only.
            </div>
          </aside>
        </section>

        <section id="economy" className="economyPanel">
          <div className="sectionHeading">
            <div>
              <div className="eyebrow">HOSTPAY ECONOMY — LIVE DESIGN</div>
              <h2>Every 1% platform fee has a job.</h2>
            </div>
            <div className="statusPill">
              <span className="pulseDot" />
              Production data activates after launch gates close
            </div>
          </div>

          <div className="economyGrid">
            <div className="feeCore">
              <div className="feeOrbit" />
              <div className="feeOrbit feeOrbit2" />
              <div className="feeNumber">1%</div>
              <div className="feeLabel">Platform Fee</div>
              <div className="feeFlowLine f1" />
              <div className="feeFlowLine f2" />
              <div className="feeFlowLine f3" />
            </div>

            <div className="bucketGrid">
              {buckets.map((bucket) => (
                <article
                  key={bucket.title}
                  className={`bucketCard ${bucket.tone}`}
                >
                  <div className="bucketTop">
                    <div>
                      <div className="bucketPercent">{bucket.percent}</div>
                      <div className="bucketTitle">{bucket.title}</div>
                      <div className="bucketSubtitle">{bucket.subtitle}</div>
                    </div>
                    <div className="sparkline">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>

                  <div className="metric">
                    <strong>{bucket.metricA}</strong>
                    <span>{bucket.labelA}</span>
                  </div>

                  <div className="metric secondaryMetric">
                    <strong>{bucket.metricB}</strong>
                    <span>{bucket.labelB}</span>
                  </div>

                  {bucket.countdown ? (
                    <div className="countdown">◷ {bucket.countdown}</div>
                  ) : (
                    <div className="countdown muted">Live accounting feed pending</div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="launchpad" className="lowerGrid">
          <article className="launchPanel">
            <div className="panelTitle">
              <span>🚀</span>
              <div>
                <b>LAUNCHPAD</b>
                <small>
                  Connect → Configure → Choose Host → Review → Launch
                </small>
              </div>
            </div>

            <div className="steps">
              {[
                "Connect Wallet",
                "Configure Token",
                "Choose Community",
                "Review Economics",
                "Launch",
              ].map((step, index) => (
                <div className={index === 0 ? "step active" : "step"} key={step}>
                  <div>{index + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="launchForm">
              <div className="formBlock">
                <label>Token name</label>
                <div className="fakeInput">Your token name</div>
              </div>
              <div className="formBlock">
                <label>Token symbol</label>
                <div className="symbolRow">
                  <div className="fakeInput grow">$TICKER</div>
                  <div className="hpayTag">HPAY</div>
                </div>
              </div>
              <div className="tokenPreview">
                <div className="previewCoin">H</div>
                <div>
                  <b>YOURTOKENHPAY</b>
                  <span>HOSTPAY child-token identity</span>
                </div>
              </div>
            </div>

            <div className="devRequirement">
              <span>Developer access</span>
              <b>Minimum US$50 worth of HOST locked to launch</b>
            </div>

            <button className="wideButton" type="button" disabled>
              Launch App activates with 8E9
            </button>
          </article>

          <article className="activityPanel">
            <div className="panelTitle">
              <span>◉</span>
              <div>
                <b>RECENT LAUNCHES</b>
                <small>Authoritative production feed only</small>
              </div>
            </div>

            <div className="launchTable">
              {launches.map((row, rowIndex) => (
                <div
                  className={rowIndex === 0 ? "launchRow tableHead" : "launchRow"}
                  key={rowIndex}
                >
                  {row.map((cell, cellIndex) => (
                    <span key={cellIndex}>{cell}</span>
                  ))}
                </div>
              ))}
            </div>
          </article>

          <article className="activityPanel">
            <div className="panelTitle">
              <span>⌁</span>
              <div>
                <b>PLATFORM ACTIVITY</b>
                <small>Real metrics will populate here</small>
              </div>
            </div>

            <div className="statTiles">
              <div>
                <strong>—</strong>
                <span>Total launches</span>
              </div>
              <div>
                <strong>— SOL</strong>
                <span>Total activity</span>
              </div>
              <div>
                <strong>—</strong>
                <span>Communities rewarded</span>
              </div>
            </div>

            <div className="chart">
              {[36, 54, 46, 72, 60, 82, 68].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
              <div className="chartLine" />
              <div className="chartOverlay">
                PRE-LAUNCH VISUALIZATION — NOT PRODUCTION DATA
              </div>
            </div>
          </article>
        </section>

        <section id="developers" className="infoGrid">
          <article>
            <span>FOR DEVELOPERS</span>
            <h3>Launch into an existing community.</h3>
            <p>
              HOSTPAY links every child launch to a selected Host Community and
              exposes the 40 / 30 / 20 / 10 economics before signing.
            </p>
          </article>
          <article id="rewards">
            <span>FOR HOST HOLDERS</span>
            <h3>HOST utility is visible.</h3>
            <p>
              HOST is the native reward and access asset. No staking is required
              for the current holder-reward design.
            </p>
          </article>
          <article>
            <span>FOR HOST COMMUNITIES</span>
            <h3>Get rewarded when projects choose you.</h3>
            <p>
              Qualifying community holders can receive HOST bought from the
              child token&apos;s 10% Host Community allocation.
            </p>
          </article>
        </section>

        <footer>
          <div className="footerBrand">HOSTPAY</div>
          <div className="footerTag">Launch. Reward. Grow.</div>
          <p>
            HOSTPAY is under active development. Production reward mechanics,
            custody, fee enforcement and public launch remain subject to final
            technical validation and security review.
          </p>
        </footer>
      </div>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #030a13;
          --panel: rgba(6, 18, 33, 0.88);
          --line: rgba(61, 174, 255, 0.25);
          --blue: #27b7ff;
          --cyan: #63ddff;
          --text: #f5fbff;
          --muted: #91a8c0;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: #030a13;
        }

        body {
          margin: 0;
          background: #030a13;
        }

        button,
        input,
        a {
          font: inherit;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .siteShell {
          min-height: 100vh;
          color: var(--text);
          overflow: hidden;
          position: relative;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at 52% 4%, rgba(0, 137, 255, 0.13), transparent 30%),
            radial-gradient(circle at 90% 18%, rgba(73, 48, 255, 0.1), transparent 30%),
            linear-gradient(180deg, #020913 0%, #06111f 52%, #020811 100%);
        }

        .gridGlow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.32;
          background-image:
            linear-gradient(rgba(52, 157, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 157, 255, 0.08) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,.85), transparent 74%);
        }

        .page {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px 60px;
          position: relative;
          z-index: 1;
        }

        .topbar {
          min-height: 76px;
          display: grid;
          grid-template-columns: 290px 1fr auto;
          gap: 28px;
          align-items: center;
          border-bottom: 1px solid rgba(65, 171, 255, 0.22);
          position: sticky;
          top: 0;
          z-index: 30;
          backdrop-filter: blur(20px);
          background: rgba(2, 9, 19, 0.8);
        }

        .brand {
          height: 58px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .brand img {
          max-width: 270px;
          max-height: 54px;
          width: auto;
          height: auto;
          display: block;
          object-fit: contain;
          object-position: left center;
          filter: drop-shadow(0 0 14px rgba(39,183,255,.18));
        }

        .nav {
          display: flex;
          justify-content: center;
          gap: 26px;
          color: #b8c8da;
          font-size: 13px;
          font-weight: 800;
        }

        .nav a {
          padding: 28px 0 24px;
          border-bottom: 2px solid transparent;
          transition: .2s ease;
        }

        .nav a:hover {
          color: #fff;
          border-color: #2db9ff;
        }

        .headerActions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .networkPill,
        .walletButton,
        .statusPill {
          border: 1px solid rgba(79, 178, 255, 0.28);
          background: rgba(5, 18, 34, 0.78);
          border-radius: 12px;
          padding: 10px 13px;
          color: #c9d9e9;
          font-size: 12px;
          font-weight: 800;
        }

        .networkDot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
          background: linear-gradient(135deg, #00ffa3, #03e1ff);
          box-shadow: 0 0 12px #00e8ff;
        }

        .walletButton {
          color: white;
          background: linear-gradient(135deg, #0b7dff, #1abfff);
          box-shadow: 0 0 22px rgba(39, 183, 255, 0.24);
          opacity: .76;
        }

        .hero {
          min-height: 600px;
          display: grid;
          grid-template-columns: 1.05fr .9fr .95fr;
          gap: 26px;
          align-items: center;
          padding: 24px 0 10px;
        }

        .heroCopy {
          padding: 22px 10px 22px 20px;
        }

        .eyebrow {
          display: inline-flex;
          border: 1px solid rgba(70, 180, 255, 0.28);
          background: rgba(24, 121, 203, 0.09);
          color: #9bdcff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .12em;
          padding: 8px 12px;
          border-radius: 999px;
        }

        .hero h1 {
          font-size: clamp(56px, 5.2vw, 88px);
          line-height: .96;
          letter-spacing: -.06em;
          margin: 20px 0 18px;
        }

        .hero h1 span {
          color: #35caff;
          text-shadow: 0 0 34px rgba(53,202,255,.2);
        }

        .heroCopy > p {
          color: #b6c6d8;
          font-size: clamp(17px, 1.35vw, 21px);
          line-height: 1.55;
          max-width: 650px;
        }

        .heroButtons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .primaryButton,
        .secondaryButton {
          border-radius: 12px;
          padding: 13px 18px;
          font-weight: 900;
          font-size: 14px;
          border: 1px solid rgba(95, 193, 255, 0.3);
        }

        .primaryButton {
          background: linear-gradient(135deg, #12a7ff, #1377ff);
          box-shadow: 0 0 26px rgba(27, 166, 255, 0.28);
        }

        .secondaryButton {
          background: rgba(7, 18, 34, 0.72);
          color: #d8e6f4;
        }

        .featureStrip {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .featureStrip div {
          border-top: 1px solid rgba(72, 173, 255, 0.18);
          padding-top: 11px;
          min-width: 0;
        }

        .featureStrip strong,
        .featureStrip span {
          display: block;
        }

        .featureStrip strong {
          font-size: 12px;
          color: #e5f5ff;
        }

        .featureStrip span {
          margin-top: 4px;
          color: #7f99b3;
          font-size: 10px;
        }

        .worldStage {
          height: 520px;
          position: relative;
          display: grid;
          place-items: center;
          perspective: 1100px;
          isolation: isolate;
        }

        .worldStage::before {
          content: "";
          width: 430px;
          height: 430px;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(20, 151, 255, .22), transparent 67%);
          filter: blur(22px);
          animation: breathe 4.8s ease-in-out infinite;
        }

        .world {
          width: 250px;
          height: 250px;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          transform-style: preserve-3d;
          border: 1px solid rgba(127, 220, 255, .7);
          background:
            radial-gradient(circle at 35% 30%, rgba(117, 226, 255, .32), transparent 23%),
            radial-gradient(circle at 66% 62%, rgba(0, 75, 255, .34), transparent 37%),
            linear-gradient(135deg, #063d78, #07152c 56%, #042251);
          box-shadow:
            inset -24px -18px 45px rgba(0,0,0,.5),
            inset 18px 14px 45px rgba(28,202,255,.13),
            0 0 24px rgba(73,210,255,.6),
            0 0 72px rgba(0,94,255,.28);
          animation: worldFloat 6s ease-in-out infinite, worldSpin 18s linear infinite;
          z-index: 10;
        }

        .world::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(98deg, rgba(255,255,255,.12), transparent 30%, transparent 70%, rgba(0,0,0,.22));
          pointer-events: none;
        }

        .worldMap {
          position: absolute;
          background: rgba(50, 217, 255, .16);
          box-shadow: 0 0 12px rgba(70,210,255,.15);
          border: 1px solid rgba(112, 221, 255, .18);
          filter: blur(.2px);
        }

        .mapA {
          width: 98px;
          height: 78px;
          left: 28px;
          top: 48px;
          border-radius: 58% 42% 65% 35% / 43% 62% 38% 57%;
          transform: rotate(-12deg);
        }

        .mapB {
          width: 72px;
          height: 104px;
          right: 34px;
          bottom: 34px;
          border-radius: 46% 54% 34% 66% / 59% 34% 66% 41%;
          transform: rotate(21deg);
        }

        .worldLongitude,
        .worldLatitude {
          position: absolute;
          inset: 14px 45%;
          border: 1px solid rgba(121, 226, 255, .25);
          border-radius: 50%;
        }

        .long1 { transform: rotateY(60deg); }
        .long2 { transform: rotateY(-60deg); }

        .worldLatitude {
          inset: 45% 13px;
        }

        .lat1 { transform: rotateX(58deg); }
        .lat2 { transform: rotateX(-58deg); }

        .hMark {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-size: 108px;
          font-weight: 1000;
          font-style: italic;
          letter-spacing: -.12em;
          color: white;
          text-shadow:
            -6px 10px 0 #0574ff,
            0 0 22px #00cfff,
            0 0 46px rgba(0, 157, 255, .72);
          z-index: 5;
          transform: translateZ(18px);
        }

        .worldHalo {
          position: absolute;
          border: 1px solid rgba(86, 200, 255, .42);
          border-radius: 50%;
          z-index: 3;
          box-shadow: 0 0 18px rgba(0, 162, 255, .15);
        }

        .haloOne {
          width: 360px;
          height: 130px;
          transform: rotate(-10deg);
          animation: haloSpin 8s linear infinite;
        }

        .haloTwo {
          width: 400px;
          height: 160px;
          transform: rotate(20deg);
          animation: haloSpinReverse 12s linear infinite;
        }

        .haloThree {
          width: 325px;
          height: 330px;
          transform: rotateX(72deg) rotateZ(-4deg);
          opacity: .6;
          animation: haloSpin 14s linear infinite;
        }

        .orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 0 0;
          width: 0;
          height: 0;
          z-index: 14;
        }

        .orbitA { animation: orbitA 8s linear infinite; }
        .orbitB { animation: orbitB 11s linear infinite; }
        .orbitC { animation: orbitC 14s linear infinite reverse; }
        .orbitD { animation: orbitD 17s linear infinite; }

        .planet {
          position: absolute;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #c8f3ff;
          font-weight: 900;
          background:
            radial-gradient(circle at 35% 30%, rgba(74,211,255,.55), transparent 30%),
            linear-gradient(145deg, rgba(11,54,101,.98), rgba(5,15,34,.98));
          border: 1px solid rgba(108,216,255,.55);
          box-shadow: 0 0 22px rgba(36, 188, 255, .32);
          animation: planetCounter 8s linear infinite;
          font-size: 18px;
        }

        .p1 { transform: translate(182px, -28px); }
        .p2 { transform: translate(-206px, 42px); }
        .p3 { transform: translate(132px, 136px); }
        .p4 {
          width: 46px;
          height: 46px;
          transform: translate(-150px, -155px);
          font-size: 8px;
          letter-spacing: -2px;
        }

        .worldBase {
          width: 300px;
          height: 72px;
          position: absolute;
          top: calc(50% + 127px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          filter: drop-shadow(0 0 18px rgba(0, 159, 255, .35));
        }

        .baseRing {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2px solid rgba(68, 192, 255, .45);
          background: radial-gradient(ellipse, rgba(16,118,255,.15), transparent 65%);
        }

        .r1 { width: 280px; height: 64px; animation: basePulse 3s ease-in-out infinite; }
        .r2 { width: 224px; height: 45px; animation: basePulse 3s .7s ease-in-out infinite; }
        .r3 { width: 150px; height: 27px; animation: basePulse 3s 1.4s ease-in-out infinite; }

        .worldLegend {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          gap: 7px;
          color: #46c9ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .12em;
          text-shadow: 0 0 10px rgba(51,200,255,.5);
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #c8f5ff;
          box-shadow: 0 0 14px #4bcdff;
          animation: twinkle 2.2s ease-in-out infinite;
        }

        .star1 { left: 12%; top: 19%; }
        .star2 { right: 18%; top: 12%; animation-delay: .6s; }
        .star3 { left: 16%; bottom: 17%; animation-delay: 1.1s; }
        .star4 { right: 12%; bottom: 25%; animation-delay: 1.6s; }

        .roboPanel,
        .economyPanel,
        .launchPanel,
        .activityPanel,
        .infoGrid article {
          background:
            linear-gradient(145deg, rgba(10, 29, 53, .94), rgba(4, 13, 26, .96));
          border: 1px solid rgba(63, 169, 255, .26);
          box-shadow: 0 18px 50px rgba(0,0,0,.3);
        }

        .roboPanel {
          border-radius: 22px;
          padding: 20px;
          min-height: 410px;
          position: relative;
          overflow: hidden;
        }

        .roboPanel::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 2px;
          background: linear-gradient(90deg, transparent, #3ec7ff, transparent);
          animation: scan 4s linear infinite;
        }

        .roboHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .roboTitle {
          color: #66d5ff;
          font-size: 25px;
          font-weight: 1000;
          letter-spacing: .01em;
        }

        .online {
          margin-left: 8px;
          color: #49f39f;
          font-size: 10px;
          vertical-align: middle;
        }

        .roboSub {
          margin-top: 5px;
          color: #a6bbcf;
          font-size: 12px;
        }

        .roboBot {
          width: 84px;
          height: 94px;
          position: relative;
          flex: 0 0 auto;
        }

        .botAntenna {
          width: 2px;
          height: 12px;
          background: #65e0ff;
          position: absolute;
          top: 0;
          left: 50%;
          box-shadow: 0 0 8px #65e0ff;
        }

        .botAntenna::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #61dbff;
          left: -2px;
          top: -3px;
        }

        .botFace {
          width: 74px;
          height: 58px;
          border: 2px solid rgba(104,213,255,.8);
          border-radius: 28px;
          position: absolute;
          top: 10px;
          left: 5px;
          background: linear-gradient(145deg, #effaff, #6b8dac 35%, #0a192b 37%, #07121f 100%);
          box-shadow: 0 0 20px rgba(54,188,255,.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 17px;
        }

        .botFace i {
          display: block;
          width: 10px;
          height: 13px;
          border-radius: 50%;
          background: #40e0ff;
          box-shadow: 0 0 11px #40e0ff;
        }

        .botBody {
          position: absolute;
          width: 50px;
          height: 34px;
          border-radius: 14px 14px 18px 18px;
          bottom: 0;
          left: 17px;
          display: grid;
          place-items: center;
          background: linear-gradient(160deg, #a9dfff, #1a3c65);
          color: #0b72ff;
          font-weight: 1000;
          border: 1px solid rgba(138,224,255,.8);
        }

        .roboPanel > p {
          color: #abc0d4;
          font-size: 13px;
          line-height: 1.55;
          margin: 16px 0;
          max-width: 430px;
        }

        .promptChips {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .promptChips button {
          text-align: left;
          border: 1px solid rgba(84, 181, 255, .24);
          border-radius: 999px;
          padding: 9px 11px;
          background: rgba(9, 25, 45, .84);
          color: #c7d7e8;
          font-size: 10px;
          font-weight: 800;
        }

        .roboInput {
          margin-top: 15px;
          border: 1px solid rgba(76, 187, 255, .4);
          background: rgba(3, 13, 27, .9);
          border-radius: 12px;
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-left: 14px;
          color: #6f8aa5;
          font-size: 11px;
        }

        .roboInput button {
          align-self: stretch;
          width: 48px;
          border: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, #167eff, #2ecbff);
          color: white;
          opacity: .75;
        }

        .roboFoot {
          margin-top: 10px;
          color: #617a93;
          font-size: 9px;
          text-align: center;
        }

        .economyPanel {
          border-radius: 24px;
          padding: 24px;
          margin-top: 12px;
        }

        .sectionHeading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .sectionHeading h2 {
          margin: 7px 0 0;
          font-size: clamp(28px, 3vw, 44px);
          letter-spacing: -.035em;
        }

        .pulseDot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 7px;
          border-radius: 50%;
          background: #5df0a0;
          box-shadow: 0 0 12px #5df0a0;
          animation: pulse 1.8s ease-in-out infinite;
        }

        .economyGrid {
          display: grid;
          grid-template-columns: 230px 1fr;
          gap: 24px;
          align-items: center;
          margin-top: 22px;
        }

        .feeCore {
          width: 210px;
          height: 210px;
          margin: auto;
          border-radius: 50%;
          border: 2px solid rgba(43, 183, 255, .45);
          background:
            radial-gradient(circle, rgba(30,133,255,.22), transparent 60%),
            rgba(5, 17, 35, .8);
          display: grid;
          place-items: center;
          align-content: center;
          position: relative;
          box-shadow:
            inset 0 0 38px rgba(0, 126, 255, .15),
            0 0 28px rgba(0, 145, 255, .2);
        }

        .feeNumber {
          font-size: 58px;
          font-weight: 1000;
          line-height: 1;
          text-shadow: 0 0 22px rgba(55,196,255,.5);
        }

        .feeLabel {
          margin-top: 7px;
          color: #a9bed2;
          font-size: 12px;
          font-weight: 800;
        }

        .feeOrbit {
          position: absolute;
          inset: 13px;
          border-radius: 50%;
          border: 1px dashed rgba(69, 187, 255, .42);
          animation: spin 12s linear infinite;
        }

        .feeOrbit2 {
          inset: -10px;
          border-style: solid;
          border-color: rgba(88, 212, 255, .14);
          animation-direction: reverse;
          animation-duration: 17s;
        }

        .feeFlowLine {
          position: absolute;
          right: -66px;
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, #23baff, transparent);
          box-shadow: 0 0 10px rgba(44, 194, 255, .8);
        }

        .f1 { top: 67px; transform: rotate(-7deg); }
        .f2 { top: 105px; }
        .f3 { top: 143px; transform: rotate(7deg); }

        .bucketGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .bucketCard {
          min-height: 280px;
          border-radius: 17px;
          padding: 18px;
          background: rgba(7, 22, 41, .88);
          border: 1px solid rgba(91, 187, 255, .28);
          position: relative;
          overflow: hidden;
        }

        .bucketCard::after {
          content: "";
          position: absolute;
          inset: auto -20% -55% 15%;
          height: 170px;
          filter: blur(50px);
          opacity: .15;
          border-radius: 50%;
        }

        .bucketCard.blue { border-color: rgba(47, 184, 255, .7); }
        .bucketCard.blue::after { background: #00aaff; }

        .bucketCard.purple { border-color: rgba(186, 94, 255, .72); }
        .bucketCard.purple::after { background: #a04fff; }

        .bucketCard.green { border-color: rgba(48, 229, 188, .62); }
        .bucketCard.green::after { background: #1cd8a8; }

        .bucketCard.gold { border-color: rgba(255, 180, 63, .72); }
        .bucketCard.gold::after { background: #ffae38; }

        .bucketTop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .bucketPercent {
          font-size: 34px;
          font-weight: 1000;
          color: #48c9ff;
        }

        .purple .bucketPercent { color: #cb79ff; }
        .green .bucketPercent { color: #51e0c2; }
        .gold .bucketPercent { color: #ffc263; }

        .bucketTitle {
          font-weight: 900;
          font-size: 16px;
          margin-top: 1px;
        }

        .bucketSubtitle {
          font-size: 10px;
          color: #859db5;
          margin-top: 2px;
        }

        .sparkline {
          height: 58px;
          width: 76px;
          display: flex;
          gap: 4px;
          align-items: end;
          padding-bottom: 8px;
        }

        .sparkline i {
          flex: 1;
          border-radius: 5px 5px 1px 1px;
          background: linear-gradient(#46d4ff, #0a4b97);
          opacity: .8;
        }

        .sparkline i:nth-child(1) { height: 25%; }
        .sparkline i:nth-child(2) { height: 40%; }
        .sparkline i:nth-child(3) { height: 34%; }
        .sparkline i:nth-child(4) { height: 58%; }
        .sparkline i:nth-child(5) { height: 48%; }
        .sparkline i:nth-child(6) { height: 76%; }

        .metric {
          margin-top: 18px;
          padding: 12px 0;
          border-top: 1px solid rgba(94, 174, 235, .16);
        }

        .metric strong,
        .metric span {
          display: block;
        }

        .metric strong {
          font-size: 19px;
        }

        .metric span {
          margin-top: 4px;
          color: #829bb5;
          font-size: 10px;
        }

        .secondaryMetric {
          margin-top: 0;
        }

        .countdown {
          margin-top: 4px;
          border: 1px solid rgba(70, 176, 255, .18);
          background: rgba(6, 18, 34, .72);
          color: #abc8df;
          border-radius: 9px;
          padding: 8px 9px;
          font-size: 9px;
          font-weight: 800;
        }

        .countdown.muted {
          color: #67819a;
        }

        .lowerGrid {
          display: grid;
          grid-template-columns: 1.35fr .75fr .8fr;
          gap: 14px;
          margin-top: 14px;
        }

        .launchPanel,
        .activityPanel {
          border-radius: 20px;
          padding: 18px;
        }

        .panelTitle {
          display: flex;
          gap: 10px;
          align-items: center;
          color: #55caff;
        }

        .panelTitle > span {
          font-size: 22px;
        }

        .panelTitle b,
        .panelTitle small {
          display: block;
        }

        .panelTitle b {
          color: #f2f8fd;
          font-size: 16px;
        }

        .panelTitle small {
          color: #7892ab;
          margin-top: 3px;
          font-size: 9px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          margin: 20px 0;
        }

        .step {
          text-align: center;
          position: relative;
          color: #758ca4;
        }

        .step::after {
          content: "";
          position: absolute;
          top: 15px;
          left: 62%;
          width: 77%;
          height: 1px;
          background: rgba(83, 170, 235, .18);
        }

        .step:last-child::after {
          display: none;
        }

        .step div {
          width: 30px;
          height: 30px;
          margin: auto;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid rgba(83, 170, 235, .25);
          background: #071426;
          font-size: 11px;
          font-weight: 900;
          position: relative;
          z-index: 2;
        }

        .step span {
          display: block;
          margin-top: 7px;
          font-size: 8px;
          font-weight: 800;
        }

        .step.active {
          color: #aee8ff;
        }

        .step.active div {
          color: white;
          border-color: #31c2ff;
          background: #0a74d8;
          box-shadow: 0 0 20px rgba(33, 180, 255, .35);
        }

        .launchForm {
          display: grid;
          grid-template-columns: 1fr 1fr 1.1fr;
          gap: 10px;
          background: rgba(3, 12, 24, .46);
          padding: 12px;
          border-radius: 13px;
          border: 1px solid rgba(75, 165, 235, .14);
        }

        .formBlock label {
          color: #8ea5bc;
          font-size: 9px;
          font-weight: 800;
          display: block;
          margin-bottom: 6px;
        }

        .fakeInput {
          height: 40px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          border: 1px solid rgba(73, 164, 235, .18);
          background: #071526;
          border-radius: 8px;
          color: #5f7891;
          font-size: 10px;
        }

        .symbolRow {
          display: flex;
          gap: 5px;
        }

        .grow { flex: 1; }

        .hpayTag {
          min-width: 54px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          border: 1px solid #3697e3;
          background: linear-gradient(135deg, #173e74, #268dcc);
          font-size: 9px;
          font-weight: 900;
        }

        .tokenPreview {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          border: 1px solid rgba(73, 164, 235, .15);
          border-radius: 9px;
          padding: 8px 10px;
        }

        .previewCoin {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          color: white;
          font-weight: 1000;
          background: linear-gradient(145deg, #0f7cff, #23d5ff);
          box-shadow: 0 0 15px rgba(40, 192, 255, .24);
        }

        .tokenPreview b,
        .tokenPreview span {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tokenPreview b {
          font-size: 10px;
        }

        .tokenPreview span {
          color: #748da6;
          margin-top: 4px;
          font-size: 8px;
        }

        .devRequirement {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid rgba(80, 183, 255, .18);
          background: rgba(9, 36, 62, .55);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 9px;
        }

        .devRequirement span {
          color: #7ea4c2;
        }

        .devRequirement b {
          color: #c6edff;
          text-align: right;
        }

        .wideButton {
          width: 100%;
          margin-top: 10px;
          border: 0;
          min-height: 42px;
          border-radius: 10px;
          font-weight: 900;
          color: #06111f;
          background: linear-gradient(135deg, #4bc8ff, #157fff);
          opacity: .6;
        }

        .launchTable {
          margin-top: 14px;
          border: 1px solid rgba(69, 158, 224, .12);
          border-radius: 11px;
          overflow: hidden;
        }

        .launchRow {
          display: grid;
          grid-template-columns: 1fr 1.3fr 1.4fr .75fr;
          gap: 8px;
          padding: 11px 10px;
          border-bottom: 1px solid rgba(69, 158, 224, .09);
          font-size: 8px;
          color: #8fa7be;
        }

        .launchRow:last-child {
          border-bottom: 0;
        }

        .launchRow span:last-child {
          text-align: right;
        }

        .tableHead {
          background: rgba(9, 35, 58, .65);
          color: #6fb5db;
          text-transform: uppercase;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .06em;
        }

        .statTiles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 14px;
        }

        .statTiles div {
          min-width: 0;
          padding: 10px 7px;
          border: 1px solid rgba(64, 164, 235, .15);
          background: rgba(5, 19, 36, .66);
          border-radius: 9px;
        }

        .statTiles strong,
        .statTiles span {
          display: block;
        }

        .statTiles strong {
          font-size: 11px;
          color: #d6f1ff;
        }

        .statTiles span {
          color: #6d88a2;
          font-size: 7px;
          margin-top: 4px;
        }

        .chart {
          height: 170px;
          margin-top: 15px;
          display: flex;
          gap: 9px;
          align-items: end;
          padding: 20px 10px 8px;
          border: 1px solid rgba(64, 164, 235, .1);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          background:
            repeating-linear-gradient(to top, rgba(71, 166, 233, .08) 0, rgba(71, 166, 233, .08) 1px, transparent 1px, transparent 36px);
        }

        .chart i {
          flex: 1;
          border-radius: 5px 5px 1px 1px;
          background: linear-gradient(#23d0ff, #0d67d4);
          opacity: .72;
          box-shadow: 0 0 12px rgba(38, 188, 255, .15);
        }

        .chartLine {
          position: absolute;
          left: 8%;
          right: 8%;
          top: 45%;
          height: 2px;
          transform: rotate(-3deg);
          background: linear-gradient(90deg, #906fff, #ff5cd6);
          box-shadow: 0 0 10px rgba(212, 84, 255, .28);
        }

        .chartOverlay {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          text-align: center;
          font-size: 7px;
          letter-spacing: .1em;
          font-weight: 900;
          color: rgba(169, 209, 236, .58);
          background: rgba(2, 10, 20, .72);
          padding: 5px;
          border-radius: 5px;
        }

        .infoGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 14px;
        }

        .infoGrid article {
          padding: 25px;
          border-radius: 18px;
        }

        .infoGrid article > span {
          color: #57c8ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .infoGrid h3 {
          margin: 10px 0 8px;
          font-size: 23px;
          letter-spacing: -.025em;
        }

        .infoGrid p {
          margin: 0;
          color: #8fa6bd;
          font-size: 12px;
          line-height: 1.6;
        }

        footer {
          text-align: center;
          padding: 62px 20px 16px;
        }

        .footerBrand {
          color: #57caff;
          font-size: 11px;
          font-weight: 1000;
          letter-spacing: .2em;
        }

        .footerTag {
          margin-top: 7px;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 1000;
          letter-spacing: -.035em;
        }

        footer p {
          max-width: 780px;
          margin: 15px auto 0;
          color: #677f97;
          font-size: 11px;
          line-height: 1.6;
        }

        @keyframes worldSpin {
          from { transform: rotateY(0deg) rotateZ(-2deg); }
          to { transform: rotateY(360deg) rotateZ(-2deg); }
        }

        @keyframes worldFloat {
          0%,100% { translate: 0 0; }
          50% { translate: 0 -9px; }
        }

        @keyframes haloSpin {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        @keyframes haloSpinReverse {
          from { rotate: 360deg; }
          to { rotate: 0deg; }
        }

        @keyframes orbitA {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitB {
          from { transform: rotate(92deg); }
          to { transform: rotate(452deg); }
        }

        @keyframes orbitC {
          from { transform: rotate(-50deg); }
          to { transform: rotate(310deg); }
        }

        @keyframes orbitD {
          from { transform: rotate(170deg); }
          to { transform: rotate(530deg); }
        }

        @keyframes planetCounter {
          from { rotate: 0deg; }
          to { rotate: -360deg; }
        }

        @keyframes basePulse {
          0%,100% { opacity: .38; scale: 1; }
          50% { opacity: .9; scale: 1.04; }
        }

        @keyframes breathe {
          0%,100% { opacity: .65; transform: scale(.96); }
          50% { opacity: 1; transform: scale(1.03); }
        }

        @keyframes twinkle {
          0%,100% { opacity: .3; scale: .7; }
          50% { opacity: 1; scale: 1.4; }
        }

        @keyframes scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%,100% { opacity: .4; }
          50% { opacity: 1; }
        }

        @keyframes spin {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }

        @media (max-width: 1180px) {
          .topbar {
            grid-template-columns: 220px 1fr auto;
          }

          .brand img {
            max-width: 210px;
          }

          .nav {
            gap: 14px;
          }

          .hero {
            grid-template-columns: 1fr 1fr;
          }

          .roboPanel {
            grid-column: 1 / -1;
            min-height: 0;
          }

          .economyGrid {
            grid-template-columns: 1fr;
          }

          .feeCore {
            margin-bottom: 18px;
          }

          .bucketGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .lowerGrid {
            grid-template-columns: 1fr 1fr;
          }

          .launchPanel {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 820px) {
          .page {
            padding: 0 12px 50px;
          }

          .topbar {
            grid-template-columns: 1fr auto;
            min-height: 68px;
          }

          .brand {
            height: 54px;
          }

          .nav {
            display: none;
          }

          .networkPill {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            padding-top: 8px;
          }

          .heroCopy {
            padding: 20px 6px 0;
          }

          .hero h1 {
            font-size: clamp(48px, 15vw, 72px);
          }

          .worldStage {
            height: 470px;
          }

          .worldLegend {
            right: 0;
          }

          .featureStrip {
            grid-template-columns: 1fr;
          }

          .bucketGrid {
            grid-template-columns: 1fr;
          }

          .feeFlowLine {
            display: none;
          }

          .lowerGrid,
          .infoGrid {
            grid-template-columns: 1fr;
          }

          .launchPanel {
            grid-column: auto;
          }

          .launchForm {
            grid-template-columns: 1fr;
          }

          .steps {
            overflow-x: auto;
            grid-template-columns: repeat(5, 120px);
            padding-bottom: 7px;
          }

          .promptChips {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
