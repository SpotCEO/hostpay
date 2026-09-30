export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "60px 24px"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >
        <p
          style={{
            color: "#49b7ff",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase"
          }}
        >
          HOSTPAY
        </p>

        <h1
          style={{
            fontSize: "64px",
            lineHeight: 1.05,
            margin: "20px 0"
          }}
        >
          Launch. Reward. Grow.
        </h1>

        <p
          style={{
            fontSize: "22px",
            lineHeight: 1.6,
            maxWidth: "760px",
            color: "#c7d2e3"
          }}
        >
          HOSTPAY is a Solana launchpad designed to reward developers,
          HOST holders and selected host communities from real platform activity.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginTop: "50px"
          }}
        >
          {[
            ["40%", "Developer", "Paid in SOL"],
            ["30%", "HOST Holders", "Rewarded in HOST"],
            ["20%", "Treasury", "Operations and distribution"],
            ["10%", "Host Community", "Rewarded in HOST"]
          ].map(([percent, title, text]) => (
            <div
              key={title}
              style={{
                border: "1px solid #1c3654",
                borderRadius: "18px",
                padding: "24px",
                background: "#0b1728"
              }}
            >
              <div
                style={{
                  fontSize: "34px",
                  fontWeight: 800,
                  color: "#49b7ff"
                }}
              >
                {percent}
              </div>

              <h2 style={{ margin: "12px 0 8px" }}>{title}</h2>

              <p style={{ color: "#aebcd0", margin: 0 }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        <section
          style={{
            marginTop: "70px",
            padding: "36px",
            borderRadius: "24px",
            background: "#0d1c30",
            border: "1px solid #1d456d"
          }}
        >
          <h2 style={{ fontSize: "36px", marginTop: 0 }}>
            ASK ROBO
          </h2>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#c7d2e3"
            }}
          >
            Ask anything about HOSTPAY, launches, rewards, HOST, or why HOST
            appeared in your wallet.
          </p>

          <button
            style={{
              marginTop: "14px",
              padding: "14px 22px",
              borderRadius: "12px",
              border: "none",
              background: "#49b7ff",
              color: "#07111f",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            Why did I receive HOST?
          </button>
        </section>
      </div>
    </main>
  );
}
