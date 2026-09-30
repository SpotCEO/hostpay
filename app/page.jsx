export default function HomePage() {
  const splitCards = [
    {
      percent: "40%",
      title: "Developer",
      text: "Paid in SOL"
    },
    {
      percent: "30%",
      title: "HOST Holders",
      text: "HOST rewards"
    },
    {
      percent: "20%",
      title: "Treasury",
      text: "Operations"
    },
    {
      percent: "10%",
      title: "Host Community",
      text: "HOST rewards"
    }
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(42,140,255,0.18), transparent 30%), linear-gradient(180deg, #06111f 0%, #081522 58%, #050d17 100%)",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "26px 22px 80px"
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            padding: "8px 0 34px"
          }}
        >
          <div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                letterSpacing: "0.08em"
              }}
            >
              HOSTPAY
            </div>

            <div
              style={{
                marginTop: "4px",
                color: "#5dc5ff",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.08em"
              }}
            >
              LAUNCH. REWARD. GROW.
            </div>
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(91,196,255,0.28)",
              background: "rgba(14,35,57,0.72)",
              color: "#9edfff",
              fontSize: "13px",
              fontWeight: 800
            }}
          >
            Built on Solana
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "34px",
            alignItems: "center",
            padding: "42px 0 34px"
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "999px",
                background: "rgba(58,173,255,0.12)",
                border: "1px solid rgba(58,173,255,0.22)",
                color: "#67c9ff",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.08em"
              }}
            >
              A DIFFERENT KIND OF LAUNCHPAD
            </div>

            <h1
              style={{
                fontSize: "clamp(52px, 8vw, 92px)",
                lineHeight: 0.98,
                margin: "24px 0 22px",
                letterSpacing: "-0.055em"
              }}
            >
              Launch.
              <br />
              Reward.
              <br />
              Grow.
            </h1>

            <p
              style={{
                maxWidth: "760px",
                color: "#b9c8da",
                fontSize: "clamp(18px, 2.2vw, 24px)",
                lineHeight: 1.55,
                margin: 0
              }}
            >
              HOSTPAY is a Solana launchpad designed so platform activity can
              reward developers, HOST holders and selected host communities.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "28px"
              }}
            >
              <div
                style={{
                  padding: "13px 18px",
                  borderRadius: "12px",
                  background: "#4bbcff",
                  color: "#06111f",
                  fontWeight: 900
                }}
              >
                1% Platform Fee Model
              </div>

              <div
                style={{
                  padding: "13px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.13)",
                  background: "rgba(255,255,255,0.035)",
                  color: "#d9e6f3",
                  fontWeight: 800
                }}
              >
                No staking required
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: "26px",
              padding: "28px",
              background:
                "linear-gradient(180deg, rgba(14,34,55,0.96), rgba(8,21,35,0.96))",
              border: "1px solid rgba(81,181,255,0.22)",
              boxShadow: "0 28px 70px rgba(0,0,0,0.35)"
            }}
          >
            <div
              style={{
                color: "#6fd0ff",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.08em"
              }}
            >
              HOW VALUE FLOWS
            </div>

            <div
              style={{
                marginTop: "18px",
                fontSize: "30px",
                fontWeight: 900,
                lineHeight: 1.18
              }}
            >
              Every successful launch feeds the HOSTPAY ecosystem.
            </div>

            <div
              style={{
                marginTop: "22px",
                color: "#aebed0",
                lineHeight: 1.7,
                fontSize: "16px"
              }}
            >
              Developers earn in SOL. HOST holder and host-community allocations
              are used to buy HOST for rewards. Treasury remains available to
              operate the machinery behind the platform.
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: "22px",
            padding: "28px",
            borderRadius: "24px",
            background:
              "linear-gradient(145deg, rgba(12,31,51,0.98), rgba(7,20,34,0.98))",
            border: "1px solid rgba(83,190,255,0.22)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.22)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "18px",
              alignItems: "end",
              flexWrap: "wrap"
            }}
          >
            <div>
              <div
                style={{
                  color: "#67c9ff",
                  fontWeight: 800,
                  fontSize: "13px",
                  letterSpacing: "0.08em"
                }}
              >
                THE 1% SPLIT
              </div>

              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 48px)",
                  margin: "10px 0 0",
                  letterSpacing: "-0.035em"
                }}
              >
                40 / 30 / 20 / 10
              </h2>
            </div>

            <div
              style={{
                color: "#9fb2c6",
                fontSize: "15px",
                maxWidth: "430px",
                lineHeight: 1.5
              }}
            >
              Every 1% platform fee is designed to flow across developers,
              HOST holders, operations and the selected host community.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "14px",
              marginTop: "24px"
            }}
          >
            {splitCards.map((card) => (
              <div
                key={card.title}
                style={{
                  borderRadius: "18px",
                  padding: "22px",
                  background: "rgba(15,35,57,0.94)",
                  border: "1px solid rgba(92,191,255,0.18)"
                }}
              >
                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: 900,
                    color: "#50c1ff"
                  }}
                >
                  {card.percent}
                </div>

                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 850,
                    marginTop: "8px"
                  }}
                >
                  {card.title}
                </div>

                <div
                  style={{
                    color: "#aebed0",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    marginTop: "6px"
                  }}
                >
                  {card.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: "50px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px"
          }}
        >
          <div
            style={{
              borderRadius: "24px",
              padding: "30px",
              background:
                "linear-gradient(160deg, rgba(17,43,70,0.96), rgba(7,20,33,0.98))",
              border: "1px solid rgba(79,188,255,0.22)"
            }}
          >
            <div
              style={{
                color: "#61c8ff",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.08em"
              }}
            >
              FOR DEVELOPERS
            </div>

            <h3
              style={{
                fontSize: "30px",
                margin: "14px 0 12px"
              }}
            >
              Launch into an existing community.
            </h3>

            <p
              style={{
                color: "#afc0d3",
                lineHeight: 1.65,
                margin: 0
              }}
            >
              Choose a host community, earn from the activity your token
              creates, and give that community a real reason to notice your
              launch.
            </p>
          </div>

          <div
            style={{
              borderRadius: "24px",
              padding: "30px",
              background:
                "linear-gradient(160deg, rgba(17,43,70,0.96), rgba(7,20,33,0.98))",
              border: "1px solid rgba(79,188,255,0.22)"
            }}
          >
            <div
              style={{
                color: "#61c8ff",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.08em"
              }}
            >
              FOR COMMUNITIES
            </div>

            <h3
              style={{
                fontSize: "30px",
                margin: "14px 0 12px"
              }}
            >
              Get rewarded when projects choose you.
            </h3>

            <p
              style={{
                color: "#afc0d3",
                lineHeight: 1.65,
                margin: 0
              }}
            >
              A child token can select your community as its host. Part of the
              platform activity it generates can then be used to buy HOST for
              qualifying members of your community.
            </p>
          </div>
        </section>

        <section
          style={{
            marginTop: "56px",
            padding: "34px",
            borderRadius: "26px",
            background:
              "linear-gradient(145deg, rgba(17,47,77,0.98), rgba(7,22,37,0.98))",
            border: "1px solid rgba(84,193,255,0.27)",
            boxShadow: "0 22px 60px rgba(0,0,0,0.28)"
          }}
        >
          <div
            style={{
              color: "#63cbff",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.08em"
            }}
          >
            ASK ROBO
          </div>

          <h2
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              margin: "12px 0 12px",
              letterSpacing: "-0.03em"
            }}
          >
            Why did HOST appear in my wallet?
          </h2>

          <p
            style={{
              color: "#b7c6d8",
              fontSize: "18px",
              lineHeight: 1.65,
              maxWidth: "800px",
              margin: 0
            }}
          >
            ASK ROBO is being built to explain HOSTPAY, launches, reward
            provenance and why a wallet received HOST. Later, users will be able
            to provide a public wallet address or transaction signature and
            trace the source of a reward.
          </p>

          <div
            style={{
              marginTop: "24px",
              padding: "16px 18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#d7e4ef",
              fontSize: "15px",
              lineHeight: 1.55
            }}
          >
            ROBO will never ask for your seed phrase, private key, recovery
            phrase or wallet password.
          </div>
        </section>

        <section
          style={{
            marginTop: "56px",
            textAlign: "center",
            padding: "42px 20px"
          }}
        >
          <div
            style={{
              color: "#5dc5ff",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "0.08em"
            }}
          >
            HOSTPAY
          </div>

          <div
            style={{
              fontSize: "clamp(34px, 5vw, 54px)",
              fontWeight: 900,
              marginTop: "12px"
            }}
          >
            Launch. Reward. Grow.
          </div>

          <p
            style={{
              color: "#93a7bc",
              maxWidth: "720px",
              margin: "16px auto 0",
              lineHeight: 1.65
            }}
          >
            HOSTPAY is under active development. Reward mechanics, timing,
            custody, fee enforcement and legal treatment remain subject to
            final technical validation and review before public launch.
          </p>
        </section>
      </div>
    </main>
  );
}
