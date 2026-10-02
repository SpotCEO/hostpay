"use client";

export default function HomePage() {
  const navItems = [
    "Home",
    "How It Works",
    "Economics",
    "For Developers",
    "For Communities",
    "Rewards",
    "ASK ROBO"
  ];

  const quickQuestions = [
    "How does HOSTPAY work?",
    "Explain the 1% fee distribution",
    "How do I launch a token?",
    "How are HOST rewards distributed?"
  ];

  const splitCards = [
    {
      percent: "40%",
      title: "Developers",
      subtitle: "Paid in SOL to token creators",
      accent: "#22b4ff",
      glow: "rgba(34,180,255,.35)",
      amountA: "1,248.52 SOL",
      amountB: "$214,932 USD",
      footA: "Total Launches Rewarded",
      footB: "482"
    },
    {
      percent: "30%",
      title: "HOST Holders",
      subtitle: "Buy & distribute HOST rewards",
      accent: "#b05bff",
      glow: "rgba(176,91,255,.35)",
      amountA: "152,420 HOST",
      amountB: "Purchased with fees",
      footA: "98,330 HOST distributed · 54,090 HOST pending",
      footB: "Next distribution in 2D 14H 36M"
    },
    {
      percent: "20%",
      title: "Treasury / Operations",
      subtitle: "Funds platform operations & growth",
      accent: "#20e6c1",
      glow: "rgba(32,230,193,.35)",
      amountA: "624.26 SOL",
      amountB: "$107,466 USD",
      footA: "Runway 18 months · Avg cost per launch 0.42 SOL",
      footB: "Operations reserve"
    },
    {
      percent: "10%",
      title: "Host Communities",
      subtitle: "Buy & distribute HOST to communities",
      accent: "#ffb341",
      glow: "rgba(255,179,65,.35)",
      amountA: "50,840 HOST",
      amountB: "Purchased with fees",
      footA: "32,620 HOST distributed · 18,220 HOST pending",
      footB: "Next distribution in 1D 22H 18M"
    }
  ];

  const orbitCoins = [
    { label: "BONK", emoji: "🐶", size: 74, top: "5%", left: "56%", delay: "0s", duration: "11s" },
    { label: "WIF", emoji: "🧢", size: 70, top: "20%", left: "16%", delay: "-1s", duration: "13s" },
    { label: "PEPE", emoji: "🐸", size: 76, top: "10%", left: "74%", delay: "-2.5s", duration: "12s" },
    { label: "POPCAT", emoji: "🐱", size: 72, top: "24%", left: "86%", delay: "-3s", duration: "14s" },
    { label: "DOGE", emoji: "🐕", size: 72, top: "56%", left: "19%", delay: "-4s", duration: "10.5s" },
    { label: "FLOKI", emoji: "🐺", size: 70, top: "44%", left: "88%", delay: "-5s", duration: "12.5s" },
    { label: "PENGU", emoji: "🐧", size: 74, top: "78%", left: "48%", delay: "-1.5s", duration: "11.5s" },
    { label: "MEW", emoji: "😺", size: 72, top: "60%", left: "78%", delay: "-6s", duration: "13.5s" },
    { label: "PNUT", emoji: "🥜", size: 68, top: "55%", left: "4%", delay: "-7s", duration: "10s" },
    { label: "BRETT", emoji: "🟣", size: 52, top: "12%", left: "36%", delay: "-2s", duration: "9.5s" }
  ];

  const launchSteps = [
    "Connect Wallet",
    "Configure Token",
    "Choose Community",
    "Review Economics",
    "Launch"
  ];

  const recentLaunches = [
    ["MOONHPAY", "Moon Base", "2h ago", "12,428 SOL"],
    ["CATHPAY", "Solana Cats", "5h ago", "8,932 SOL"],
    ["AIHPAY", "AI Builders", "8h ago", "6,214 SOL"],
    ["PEPEHPAY", "MemeVerse", "12h ago", "4,801 SOL"],
    ["DOGEHPAY", "Doge Planet", "1d ago", "3,229 SOL"]
  ];

  const activityStats = [
    ["482", "Total Launches", "+24%"],
    ["12,428 SOL", "Total Volume", "+67%"],
    ["3,920", "Active Communities", "+18%"]
  ];

  const bars = [32, 44, 58, 72, 60, 78, 65];
  const line = [40, 54, 61, 58, 49, 63, 68];

  return (
    <main className="page-shell">
      <div className="stars" />
      <div className="stars stars-two" />

      <div className="page-wrap">
        <header className="topbar glass-panel">
          <div className="brand-block">
            <div className="brand-icon">H</div>
            <div>
              <div className="brand-name">HOSTPAY</div>
              <div className="brand-tag">Launch. Reward. Grow.</div>
            </div>
          </div>

          <nav className="topnav">
            {navItems.map((item, index) => (
              <span key={item} className={index === 0 ? "active" : ""}>
                {item}
              </span>
            ))}
          </nav>

          <div className="top-actions">
            <div className="chain-pill">Solana ▾</div>
            <button className="wallet-btn">Connect Wallet</button>
          </div>
        </header>

        <section className="hero glass-panel">
          <div className="hero-copy">
            <div className="eyebrow">THE SOLANA LAUNCHPAD THAT GIVES BACK</div>
            <h1>
              Launch.
              <br />
              Reward.
              <span> Grow.</span>
            </h1>
            <p>
              HOSTPAY is a Solana launchpad where real platform fees flow back
              to developers, HOST holders, host communities and a sustainable
              treasury — creating a flywheel for long-term growth.
            </p>

            <div className="cta-row">
              <button className="primary-btn">Launch a Token →</button>
              <button className="secondary-btn">Learn How It Works</button>
            </div>

            <div className="feature-row">
              <div>
                <strong>1% Platform Fee Model</strong>
                <span>No staking required</span>
              </div>
              <div>
                <strong>Rewards Real Builders</strong>
                <span>Automated & transparent</span>
              </div>
              <div>
                <strong>Powered by Solana</strong>
                <span>Fast. Secure. Low cost.</span>
              </div>
            </div>
          </div>

          <div className="hero-scene">
            <div className="orbit-label left">MEME COMMUNITIES POWER REAL GROWTH</div>
            <div className="orbit-label right">BUILD LAUNCH REWARD GROW TOGETHER</div>

            <div className="scene-core">
              <div className="scene-platform" />
              <div className="ring ring-a" />
              <div className="ring ring-b" />
              <div className="ring ring-c" />
              <div className="big-planet-wrap">
                <div className="big-planet">
                  <div className="planet-shine" />
                  <div className="planet-h">H</div>
                </div>
              </div>

              <div className="orbital-system orbit-one">
                {orbitCoins.slice(0, 4).map((coin) => (
                  <div
                    key={coin.label}
                    className="coin-planet"
                    style={{
                      width: coin.size,
                      height: coin.size,
                      top: coin.top,
                      left: coin.left,
                      animationDelay: coin.delay,
                      animationDuration: coin.duration
                    }}
                  >
                    <span className="emoji">{coin.emoji}</span>
                    <span className="coin-label">{coin.label}</span>
                  </div>
                ))}
              </div>

              <div className="orbital-system orbit-two">
                {orbitCoins.slice(4, 7).map((coin) => (
                  <div
                    key={coin.label}
                    className="coin-planet"
                    style={{
                      width: coin.size,
                      height: coin.size,
                      top: coin.top,
                      left: coin.left,
                      animationDelay: coin.delay,
                      animationDuration: coin.duration
                    }}
                  >
                    <span className="emoji">{coin.emoji}</span>
                    <span className="coin-label">{coin.label}</span>
                  </div>
                ))}
              </div>

              <div className="orbital-system orbit-three">
                {orbitCoins.slice(7).map((coin) => (
                  <div
                    key={coin.label}
                    className="coin-planet mini"
                    style={{
                      width: coin.size,
                      height: coin.size,
                      top: coin.top,
                      left: coin.left,
                      animationDelay: coin.delay,
                      animationDuration: coin.duration
                    }}
                  >
                    <span className="emoji">{coin.emoji}</span>
                    <span className="coin-label">{coin.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="robo-panel glass-panel">
            <div className="robo-head">
              <div>
                <div className="robo-title">ASK ROBO <span>● Online</span></div>
                <div className="robo-subtitle">Your HOSTPAY Intelligence Assistant</div>
              </div>
              <div className="robo-avatar">🤖</div>
            </div>

            <p>
              Get instant, accurate answers about HOSTPAY. Ask anything about
              our platform, token economics, rewards, launching, or host
              communities.
            </p>

            <div className="question-grid">
              {quickQuestions.map((question) => (
                <div key={question} className="question-chip">
                  {question} <span>→</span>
                </div>
              ))}
            </div>

            <div className="ask-input-row">
              <div className="ask-input">Ask a question about HOSTPAY...</div>
              <button className="send-btn">➤</button>
            </div>

            <div className="robo-note">
              ROBO can only answer questions about HOSTPAY, our ecosystem and
              platform.
            </div>
          </div>
        </section>

        <section className="economy-section glass-panel">
          <div className="section-head">
            <div>
              <div className="section-title">HOSTPAY ECONOMY — LIVE ●</div>
              <p>
                Every 1% platform fee is automatically split to reward
                developers, HOST holders, fund operations and support host
                communities.
              </p>
            </div>

            <div className="head-actions">
              <button className="small-outline">View Onchain Data ↗</button>
              <div className="range-pills">
                <span className="active">24H</span>
                <span>7D</span>
                <span>30D</span>
                <span>ALL</span>
              </div>
            </div>
          </div>

          <div className="economy-grid">
            <div className="fee-gauge-wrap">
              <div className="fee-link" />
              <div className="fee-gauge">
                <div className="fee-gauge-inner">
                  <strong>1%</strong>
                  <span>Platform Fee</span>
                </div>
              </div>
            </div>

            <div className="split-grid">
              {splitCards.map((card) => (
                <div
                  key={card.title}
                  className="split-card"
                  style={{
                    borderColor: `${card.accent}55`,
                    boxShadow: `0 0 0 1px ${card.accent}20 inset, 0 24px 50px ${card.glow}`
                  }}
                >
                  <div
                    className="card-top-line"
                    style={{ background: `linear-gradient(90deg, ${card.accent}, transparent)` }}
                  />
                  <div className="split-percent" style={{ color: card.accent }}>
                    {card.percent}
                  </div>
                  <div className="split-title">{card.title}</div>
                  <div className="split-subtitle">{card.subtitle}</div>
                  <div className="split-amount">{card.amountA}</div>
                  <div className="split-subamount">{card.amountB}</div>
                  <div className="split-foot">{card.footA}</div>
                  <div className="split-foot strong">{card.footB}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="launchpad-panel glass-panel">
            <div className="panel-title">🚀 LAUNCHPAD</div>
            <div className="panel-subtitle">
              Launch your token in minutes and automatically reward developers,
              HOST holders and a host community.
            </div>

            <div className="step-row">
              {launchSteps.map((step, index) => (
                <div key={step} className="step-item">
                  <div className={`step-dot ${index === 0 ? "active" : ""}`}>{index + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="config-grid">
              <div className="field-block">
                <label>Token Name</label>
                <div className="field-value">My Project</div>
              </div>
              <div className="field-block">
                <label>Token Symbol</label>
                <div className="field-value symbol-row">
                  PROJECT <span>HPAY</span>
                </div>
              </div>
              <div className="preview-block">
                <label>Token Preview</label>
                <div className="preview-chip">
                  <div className="preview-icon">◌</div>
                  <div>
                    <strong>PROJECTHPAY</strong>
                    <span>My Project</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-panel glass-panel">
            <div className="recent-top">
              <div>
                <div className="panel-title">RECENT LAUNCHES</div>
                <div className="mini-tabs">
                  <span className="active">Live Launches</span>
                  <span>Top Gainers</span>
                  <span>Latest</span>
                </div>
              </div>
              <button className="mini-btn">View All →</button>
            </div>

            <div className="launch-table">
              <div className="table-head">
                <span>TOKEN</span>
                <span>COMMUNITY</span>
                <span>LAUNCHED</span>
                <span>VOLUME (24H)</span>
              </div>
              {recentLaunches.map((row) => (
                <div key={row[0]} className="table-row">
                  <span>{row[0]}</span>
                  <span>{row[1]}</span>
                  <span>{row[2]}</span>
                  <span>{row[3]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-panel glass-panel">
            <div className="activity-head">
              <div className="panel-title">PLATFORM ACTIVITY</div>
              <div className="mini-select">7D ▾</div>
            </div>

            <div className="activity-stats">
              {activityStats.map((stat) => (
                <div key={stat[1]} className="activity-box">
                  <strong>{stat[0]}</strong>
                  <span>{stat[1]}</span>
                  <em>{stat[2]}</em>
                </div>
              ))}
            </div>

            <div className="chart-box">
              <div className="bars">
                {bars.map((bar, index) => (
                  <div key={index} className="bar-col">
                    <div className="line-point" style={{ bottom: `${line[index]}%` }} />
                    <div className="bar" style={{ height: `${bar}%` }} />
                    <span>Sep {index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="chart-line" />
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .page-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at 20% 0%, rgba(0, 129, 255, 0.18), transparent 32%),
            radial-gradient(circle at 85% 10%, rgba(173, 74, 255, 0.15), transparent 26%),
            linear-gradient(180deg, #030918 0%, #051126 52%, #040a18 100%);
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .stars,
        .stars-two {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 10% 20%, rgba(255,255,255,.75) 0 1px, transparent 1.6px),
            radial-gradient(circle at 70% 14%, rgba(65,205,255,.9) 0 1px, transparent 2px),
            radial-gradient(circle at 48% 62%, rgba(255,255,255,.55) 0 1px, transparent 1.6px),
            radial-gradient(circle at 90% 34%, rgba(179,118,255,.9) 0 1px, transparent 2px),
            radial-gradient(circle at 31% 78%, rgba(81,213,255,.9) 0 1px, transparent 2px),
            radial-gradient(circle at 78% 84%, rgba(255,255,255,.75) 0 1px, transparent 1.4px);
          opacity: .55;
        }

        .stars-two {
          transform: scale(1.1);
          opacity: .25;
          filter: blur(1px);
        }

        .page-wrap {
          max-width: 1680px;
          margin: 0 auto;
          padding: 14px 20px 28px;
          position: relative;
          z-index: 2;
        }

        .glass-panel {
          background: linear-gradient(180deg, rgba(7, 18, 40, .92), rgba(6, 14, 31, .94));
          border: 1px solid rgba(66, 164, 255, .28);
          box-shadow: inset 0 0 0 1px rgba(0, 187, 255, .06), 0 18px 55px rgba(0, 0, 0, .35);
          border-radius: 24px;
          backdrop-filter: blur(10px);
        }

        .topbar {
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 14px;
        }

        .brand-block {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 250px;
        }

        .brand-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(180deg, #74c8ff, #1574ff 54%, #38ecff);
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 28px;
          color: #05111d;
          box-shadow: 0 0 28px rgba(52, 180, 255, .45);
        }

        .brand-name {
          font-size: 34px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -.04em;
        }

        .brand-tag {
          color: #9db4d7;
          font-size: 15px;
          margin-top: 2px;
        }

        .topnav {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: center;
          color: #d8e8ff;
          font-size: 16px;
          font-weight: 700;
          flex: 1;
        }

        .topnav span {
          opacity: .86;
          position: relative;
        }

        .topnav .active {
          color: #fff;
        }

        .topnav .active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -10px;
          margin: auto;
          width: 42px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #4bbcff, #7a74ff);
          box-shadow: 0 0 18px rgba(75,188,255,.75);
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .chain-pill,
        .wallet-btn,
        .small-outline,
        .mini-btn {
          border-radius: 14px;
          border: 1px solid rgba(94, 185, 255, .36);
          background: rgba(5, 20, 46, .82);
          color: #eef7ff;
          font-weight: 800;
        }

        .chain-pill {
          padding: 14px 18px;
          min-width: 120px;
          text-align: center;
        }

        .wallet-btn {
          padding: 15px 24px;
          background: linear-gradient(180deg, #2b9fff, #2167ff);
          box-shadow: 0 0 28px rgba(42, 140, 255, .42);
        }

        .hero {
          padding: 26px;
          display: grid;
          grid-template-columns: 1.2fr 1fr .9fr;
          gap: 22px;
          align-items: stretch;
          margin-bottom: 14px;
        }

        .eyebrow,
        .section-title {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid rgba(76, 182, 255, .26);
          background: rgba(9, 24, 52, .72);
          color: #cbe5ff;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: .03em;
        }

        .hero-copy h1 {
          font-size: clamp(66px, 6vw, 104px);
          line-height: .92;
          letter-spacing: -.07em;
          margin: 18px 0 20px;
        }

        .hero-copy h1 span {
          color: #21b6ff;
          text-shadow: 0 0 20px rgba(33,182,255,.35);
        }

        .hero-copy p {
          font-size: 22px;
          line-height: 1.32;
          color: #d3e0f3;
          max-width: 700px;
          margin: 0 0 18px;
        }

        .cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .primary-btn,
        .secondary-btn,
        .send-btn {
          border: none;
          border-radius: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .primary-btn {
          background: linear-gradient(180deg, #2cb1ff, #2174ff);
          color: #fff;
          padding: 18px 28px;
          box-shadow: 0 0 30px rgba(44,177,255,.35);
        }

        .secondary-btn {
          padding: 18px 26px;
          color: #fff;
          border: 1px solid rgba(99, 185, 255, .34);
          background: rgba(6, 16, 37, .84);
        }

        .feature-row {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }

        .feature-row div {
          min-width: 170px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(7, 18, 41, .65);
          border: 1px solid rgba(84, 174, 255, .14);
        }

        .feature-row strong {
          display: block;
          font-size: 14px;
          color: #fff;
        }

        .feature-row span {
          display: block;
          font-size: 13px;
          color: #9db0ca;
          margin-top: 3px;
        }

        .hero-scene {
          position: relative;
          min-height: 430px;
          overflow: hidden;
          border-radius: 24px;
          background:
            radial-gradient(circle at 50% 18%, rgba(81, 203, 255, .15), transparent 26%),
            radial-gradient(circle at 60% 5%, rgba(182, 80, 255, .14), transparent 24%),
            linear-gradient(180deg, rgba(7, 19, 44, .78), rgba(4, 13, 30, .82));
          border: 1px solid rgba(80, 190, 255, .14);
        }

        .orbit-label {
          position: absolute;
          z-index: 5;
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: .13em;
          font-weight: 800;
          color: #26beff;
          text-shadow: 0 0 16px rgba(38,190,255,.35);
        }

        .orbit-label.left {
          left: 6%;
          top: 45%;
          max-width: 110px;
        }

        .orbit-label.right {
          right: 5%;
          top: 50%;
          max-width: 90px;
        }

        .scene-core {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          perspective: 1000px;
        }

        .scene-platform {
          position: absolute;
          width: 320px;
          height: 50px;
          bottom: 26px;
          border-radius: 50%;
          border: 3px solid rgba(52, 190, 255, .5);
          box-shadow: 0 0 35px rgba(52,190,255,.35), inset 0 0 24px rgba(52,190,255,.2);
        }

        .scene-platform::before,
        .scene-platform::after {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 2px solid rgba(91, 184, 255, .34);
        }

        .scene-platform::after {
          inset: 16px;
          border-color: rgba(109, 226, 255, .2);
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(84, 193, 255, .35);
          box-shadow: 0 0 28px rgba(84,193,255,.16);
        }

        .ring-a {
          width: 410px;
          height: 190px;
          transform: rotateX(72deg) rotateZ(8deg);
          animation: spinRing 14s linear infinite;
        }

        .ring-b {
          width: 320px;
          height: 420px;
          transform: rotateY(70deg) rotateZ(22deg);
          animation: spinRingB 17s linear infinite;
        }

        .ring-c {
          width: 420px;
          height: 320px;
          transform: rotateY(72deg) rotateX(58deg) rotateZ(-16deg);
          animation: spinRingC 12s linear infinite;
        }

        .big-planet-wrap {
          position: relative;
          width: 280px;
          height: 280px;
          z-index: 3;
          animation: bob 5s ease-in-out infinite;
        }

        .big-planet {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,.02) 28%),
            radial-gradient(circle at 60% 70%, rgba(1, 184, 255, .28), transparent 34%),
            radial-gradient(circle at 50% 45%, #0d64ff 0%, #0b2c7f 45%, #071639 100%);
          box-shadow:
            inset -18px -22px 40px rgba(0, 0, 0, .4),
            inset 16px 18px 30px rgba(124, 230, 255, .18),
            0 0 50px rgba(44, 183, 255, .45),
            0 0 120px rgba(71, 116, 255, .2);
          animation: globeRotate 18s linear infinite;
        }

        .big-planet::before {
          content: "";
          position: absolute;
          inset: -2%;
          border-radius: 50%;
          background:
            repeating-linear-gradient(110deg, rgba(255,255,255,.08) 0 2px, transparent 2px 22px),
            radial-gradient(circle at 70% 40%, rgba(81, 214, 255, .12), transparent 25%);
          mix-blend-mode: screen;
          animation: textureShift 10s linear infinite;
          opacity: .7;
        }

        .planet-shine {
          position: absolute;
          inset: 10% 48% 14% 12%;
          border-radius: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,.32), rgba(255,255,255,.02));
          filter: blur(2px);
        }

        .planet-h {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-size: 140px;
          font-weight: 900;
          color: #8fe8ff;
          text-shadow: 0 0 30px rgba(97, 220, 255, .8), 0 0 60px rgba(40, 135, 255, .35);
        }

        .orbital-system {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          animation: orbitScene 22s linear infinite;
        }

        .orbit-two {
          animation-duration: 18s;
          animation-direction: reverse;
        }

        .orbit-three {
          animation-duration: 15s;
        }

        .coin-planet {
          position: absolute;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background:
            radial-gradient(circle at 35% 28%, rgba(255,255,255,.5), rgba(255,255,255,.05) 25%),
            linear-gradient(180deg, #2b86ff, #1e2f83);
          box-shadow: inset -12px -15px 20px rgba(0, 0, 0, .38), 0 0 24px rgba(79, 193, 255, .45);
          border: 2px solid rgba(109, 230, 255, .55);
          color: #fff;
          transform-style: preserve-3d;
          animation-name: selfSpin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .coin-planet.mini {
          border-color: rgba(181, 131, 255, .48);
          box-shadow: inset -10px -12px 18px rgba(0,0,0,.42), 0 0 18px rgba(137, 108, 255, .36);
        }

        .emoji {
          font-size: 28px;
          line-height: 1;
          filter: drop-shadow(0 0 6px rgba(255,255,255,.3));
        }

        .coin-label {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .08em;
        }

        .robo-panel {
          padding: 18px 18px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .robo-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
        }

        .robo-title {
          font-size: 26px;
          font-weight: 900;
          color: #92ddff;
        }

        .robo-title span {
          font-size: 16px;
          color: #70f7a1;
        }

        .robo-subtitle {
          color: #d9eaff;
          font-size: 18px;
          margin-top: 3px;
        }

        .robo-avatar {
          width: 96px;
          height: 96px;
          display: grid;
          place-items: center;
          border-radius: 24px;
          font-size: 56px;
          background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.45), rgba(255,255,255,.02) 30%), linear-gradient(180deg, rgba(34,113,255,.3), rgba(16,28,62,.95));
          border: 1px solid rgba(92, 198, 255, .28);
          box-shadow: 0 0 24px rgba(58, 165, 255, .25);
        }

        .robo-panel p {
          font-size: 16px;
          color: #cbdcf3;
          line-height: 1.45;
          margin: 14px 0;
        }

        .question-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .question-chip {
          border-radius: 14px;
          border: 1px solid rgba(100, 192, 255, .24);
          background: rgba(10, 27, 61, .74);
          padding: 12px 14px;
          color: #eef8ff;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .ask-input-row {
          display: grid;
          grid-template-columns: 1fr 70px;
          gap: 12px;
          margin-top: 14px;
        }

        .ask-input {
          border-radius: 16px;
          border: 1px solid rgba(84, 186, 255, .28);
          background: rgba(7, 20, 45, .86);
          color: #8ea5c5;
          font-size: 18px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          min-height: 64px;
        }

        .send-btn {
          background: linear-gradient(180deg, #2eb2ff, #3f65ff);
          color: #fff;
          font-size: 28px;
          box-shadow: 0 0 26px rgba(46,178,255,.25);
        }

        .robo-note {
          color: #a4bbd8;
          font-size: 13px;
          margin-top: 10px;
          text-align: center;
        }

        .economy-section {
          padding: 18px 18px 16px;
          margin-bottom: 14px;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .section-head p {
          margin: 8px 0 0;
          color: #d2e0f2;
          font-size: 16px;
        }

        .head-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .small-outline,
        .mini-btn {
          padding: 12px 18px;
        }

        .range-pills {
          display: flex;
          border: 1px solid rgba(82, 180, 255, .22);
          border-radius: 999px;
          background: rgba(7, 19, 44, .88);
          overflow: hidden;
        }

        .range-pills span {
          padding: 12px 16px;
          color: #caddf4;
          font-weight: 800;
        }

        .range-pills .active {
          background: linear-gradient(180deg, #2aa4ff, #3569ff);
          color: #fff;
        }

        .economy-grid {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 18px;
          align-items: stretch;
        }

        .fee-gauge-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 240px;
        }

        .fee-link {
          position: absolute;
          right: -10px;
          width: 90px;
          height: 4px;
          background: linear-gradient(90deg, rgba(65,204,255,.8), rgba(65,204,255,0));
          box-shadow: 0 0 14px rgba(65,204,255,.45);
        }

        .fee-gauge {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          padding: 12px;
          background: conic-gradient(from 0deg, #31b0ff, #7257ff, #31b0ff);
          box-shadow: 0 0 44px rgba(52, 185, 255, .35);
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .fee-gauge-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 20%, rgba(39,120,255,.45), rgba(5,18,40,.95));
          border: 2px solid rgba(96, 208, 255, .26);
        }

        .fee-gauge-inner strong {
          font-size: 62px;
          line-height: 1;
        }

        .fee-gauge-inner span {
          color: #cbddf3;
          font-size: 22px;
        }

        .split-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .split-card {
          position: relative;
          overflow: hidden;
          padding: 16px;
          min-height: 216px;
          border-radius: 20px;
          border: 1px solid;
          background: linear-gradient(180deg, rgba(11, 24, 51, .96), rgba(8, 18, 39, .98));
        }

        .card-top-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .split-percent {
          font-size: 54px;
          line-height: .9;
          font-weight: 900;
        }

        .split-title {
          font-size: 26px;
          font-weight: 900;
        }

        .split-subtitle,
        .split-subamount,
        .split-foot {
          color: #c3d4ec;
          font-size: 15px;
          line-height: 1.35;
        }

        .split-amount {
          font-size: 42px;
          line-height: 1;
          font-weight: 900;
          margin-top: 18px;
        }

        .split-subamount {
          margin-top: 6px;
        }

        .split-foot {
          margin-top: 16px;
        }

        .split-foot.strong {
          margin-top: 8px;
          color: #fff;
          font-weight: 800;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.15fr .72fr .55fr;
          gap: 14px;
        }

        .launchpad-panel,
        .recent-panel,
        .activity-panel {
          padding: 18px;
        }

        .panel-title {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: .02em;
        }

        .panel-subtitle {
          color: #c7d8ef;
          font-size: 16px;
          margin-top: 6px;
          max-width: 640px;
        }

        .step-row {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .step-item {
          text-align: center;
          color: #b7c9e0;
          font-size: 14px;
          font-weight: 700;
        }

        .step-dot {
          width: 38px;
          height: 38px;
          margin: 0 auto 8px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid rgba(96, 186, 255, .3);
          background: rgba(10, 24, 50, .84);
          box-shadow: inset 0 0 0 1px rgba(94,186,255,.1);
        }

        .step-dot.active {
          background: linear-gradient(180deg, #33b4ff, #3c68ff);
          color: #fff;
          box-shadow: 0 0 18px rgba(51,180,255,.35);
        }

        .config-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr .9fr;
          gap: 14px;
        }

        .field-block,
        .preview-block {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(80, 180, 255, .18);
          background: rgba(8, 18, 39, .72);
        }

        .field-block label,
        .preview-block label {
          display: block;
          font-size: 13px;
          color: #9fb6d3;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .field-value {
          min-height: 54px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          background: rgba(4, 14, 30, .95);
          border: 1px solid rgba(87, 183, 255, .18);
          color: #fff;
          font-weight: 800;
        }

        .symbol-row {
          justify-content: space-between;
        }

        .symbol-row span {
          padding: 8px 10px;
          border-radius: 10px;
          background: linear-gradient(180deg, #2eb2ff, #2d6bff);
          color: #fff;
          font-size: 12px;
        }

        .preview-chip {
          min-height: 54px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(4, 14, 30, .95);
          border: 1px solid rgba(87, 183, 255, .18);
        }

        .preview-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, #d6e9ff, #6983ff);
          color: #07111c;
          font-size: 24px;
        }

        .preview-chip strong,
        .activity-box strong {
          display: block;
          font-size: 20px;
          font-weight: 900;
        }

        .preview-chip span,
        .activity-box span {
          display: block;
          color: #acc0da;
          margin-top: 2px;
        }

        .recent-top,
        .activity-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .mini-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .mini-tabs span,
        .mini-select {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(84, 180, 255, .18);
          background: rgba(8, 18, 39, .72);
          color: #cfe1f6;
          font-size: 13px;
          font-weight: 800;
        }

        .mini-tabs .active {
          background: linear-gradient(180deg, #2ea7ff, #336eff);
          color: #fff;
        }

        .launch-table {
          margin-top: 16px;
        }

        .table-head,
        .table-row {
          display: grid;
          grid-template-columns: 1.05fr 1fr .8fr .9fr;
          gap: 8px;
          align-items: center;
        }

        .table-head {
          color: #8ea9c7;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .05em;
          padding: 0 10px 10px;
        }

        .table-row {
          padding: 12px 10px;
          border-top: 1px solid rgba(84, 180, 255, .14);
          color: #f0f7ff;
          font-size: 14px;
        }

        .table-row span:last-child {
          color: #55d6ff;
          font-weight: 800;
        }

        .activity-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 16px;
        }

        .activity-box {
          padding: 14px 12px;
          border-radius: 16px;
          border: 1px solid rgba(86, 183, 255, .16);
          background: rgba(8, 18, 39, .72);
        }

        .activity-box em {
          display: block;
          color: #46ee9d;
          margin-top: 6px;
          font-style: normal;
          font-weight: 900;
        }

        .chart-box {
          margin-top: 16px;
          position: relative;
          min-height: 260px;
          border-radius: 18px;
          padding: 18px 10px 8px;
          border: 1px solid rgba(84, 180, 255, .16);
          background: linear-gradient(180deg, rgba(8, 18, 39, .72), rgba(5, 12, 28, .95));
          overflow: hidden;
        }

        .bars {
          height: 220px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
          align-items: end;
          position: relative;
          z-index: 2;
        }

        .bar-col {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: end;
          align-items: center;
          position: relative;
        }

        .bar {
          width: 32px;
          border-radius: 10px 10px 4px 4px;
          background: linear-gradient(180deg, #2fc1ff, #2b70ff);
          box-shadow: 0 0 18px rgba(47,193,255,.32);
        }

        .line-point {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #c163ff;
          box-shadow: 0 0 12px rgba(193,99,255,.75);
          z-index: 3;
        }

        .bar-col span {
          margin-top: 8px;
          color: #95abca;
          font-size: 12px;
        }

        .chart-line {
          position: absolute;
          left: 8%;
          right: 6%;
          top: 26%;
          bottom: 18%;
          background:
            linear-gradient(135deg, transparent 5%, rgba(193,99,255,.86) 8%, transparent 10%),
            linear-gradient(24deg, transparent 16%, rgba(193,99,255,.86) 18%, transparent 20%),
            linear-gradient(141deg, transparent 31%, rgba(193,99,255,.86) 33%, transparent 35%),
            linear-gradient(12deg, transparent 48%, rgba(193,99,255,.86) 50%, transparent 52%),
            linear-gradient(156deg, transparent 65%, rgba(193,99,255,.86) 67%, transparent 69%),
            linear-gradient(10deg, transparent 81%, rgba(193,99,255,.86) 83%, transparent 85%);
          opacity: .9;
          pointer-events: none;
          filter: drop-shadow(0 0 8px rgba(193,99,255,.55));
        }

        @keyframes globeRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes textureShift {
          from { transform: rotate(0deg) translateX(0); }
          to { transform: rotate(360deg) translateX(-10px); }
        }

        @keyframes spinRing {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to { transform: rotateX(72deg) rotateZ(360deg); }
        }

        @keyframes spinRingB {
          from { transform: rotateY(70deg) rotateZ(0deg); }
          to { transform: rotateY(70deg) rotateZ(-360deg); }
        }

        @keyframes spinRingC {
          from { transform: rotateY(72deg) rotateX(58deg) rotateZ(0deg); }
          to { transform: rotateY(72deg) rotateX(58deg) rotateZ(360deg); }
        }

        @keyframes orbitScene {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes selfSpin {
          from { transform: rotate(0deg) translateZ(0); }
          to { transform: rotate(-360deg) translateZ(0); }
        }

        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 44px rgba(52,185,255,.25); }
          50% { box-shadow: 0 0 60px rgba(98,109,255,.38); }
        }

        @media (max-width: 1450px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .hero-scene {
            order: 2;
          }

          .robo-panel {
            order: 3;
          }

          .economy-grid,
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .split-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 980px) {
          .topbar {
            flex-direction: column;
            align-items: stretch;
          }

          .topnav {
            justify-content: flex-start;
          }

          .question-grid,
          .config-grid,
          .activity-stats,
          .step-row,
          .split-grid {
            grid-template-columns: 1fr;
          }

          .ask-input-row,
          .table-head,
          .table-row {
            grid-template-columns: 1fr;
          }

          .hero-copy h1 {
            font-size: 54px;
          }

          .hero-copy p {
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}
