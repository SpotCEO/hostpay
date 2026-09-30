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
          "radial-gradient(circle at top right, rgba(40,130,255,0.18), transparent 28%), linear-gradient(180deg, #06111f 0%, #081522 58%, #050d17 100%)",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "18px 22px 70px"
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            padding: "4px 0 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px"
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(145deg, rgba(75,188,255,1), rgba(39,101,255,1))",
                boxShadow:
                  "0 10px 30px rgba(54,160,255,0.28), inset 0 1px 0 rgba(255,255,255,0.35)",
                color: "#ffffff",
                fontSize: "27px",
                fontWeight: 950,
                letterSpacing: "-0.08em"
              }}
            >
              H
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px"
                }}
              >
                <span
                  style={{
                    fontSize: "25px",
                    fontWeight: 950,
                    letterSpacing: "-0.025em"
                  }}
                >
                  HOST
                </span>

                <span
                  style={{
                    fontSize: "25px",
                    fontWeight: 950,
                    letterSpacing: "-0.025em",
                    color: "#55c3ff"
                  }}
                >
                  PAY
                </span>
              </div>

              <div
                style={{
                  marginTop: "2px",
                  color: "#7189a3",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.18em"
                }}
              >
                LAUNCH · REWARD · GROW
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "22px",
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                color: "#9fb2c7",
                fontSize: "13px",
                fontWeight: 700,
                flexWrap: "wrap"
              }}
            >
              <span>How It Works</span>
              <span>Economics</span>
              <span>For Developers</span>
              <span>Rewards</span>
            </div>

            <div
              style={{
                padding: "9px 13px",
                borderRadius: "999px",
                border: "1px solid rgba(91,196,255,0.28)",
                background: "rgba(14,35,57,0.72)",
                color: "#9edfff",
                fontSize: "12px",
                fontWeight: 800,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)"
              }}
            >
              Built on Solana
            </div>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "34px",
            alignItems: "start",
            padding: "22px 0 16px"
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "7px 11px",
                borderRadius: "999px",
                background: "rgba(58,173,255,0.12)",
                border: "1px solid rgba(58,173,255,0.22)",
                color: "#67c9ff",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.08em"
              }}
            >
              A DIFFERENT KIND OF LAUNCHPAD
            </div>

            <h1
              style={{
                fontSize: "clamp(50px, 6.7vw, 82px)",
                lineHeight: 0.96,
                margin: "18px 0 18px",
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
                maxWidth: "650px",
                color: "#b9c8da",
                fontSize: "clamp(17px, 1.8vw, 21px)",
                lineHeight: 1.5,
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
                gap: "10px",
                marginTop: "22px"
              }}
            >
              <div
                style={{
                  padding: "12px 17px",
                  borderRadius: "11px",
                  background: "#4bbcff",
                  color: "#06111f",
                  fontWeight: 900,
                  fontSize: "14px"
                }}
              >
                1% Platform Fee Model
              </div>

              <div
                style={{
                  padding: "12px 17px",
                  borderRadius: "11px",
                  border: "1px solid rgba(255,255,255,0.13)",
                  background: "rgba(255,255,255,0.035)",
                  color: "#d9e6f3",
                  fontWeight: 800,
                  fontSize: "14px"
                }}
              >
                No staking required
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px"
            }}
          >
            <div
              style={{
                borderRadius: "22px",
                padding: "24px",
                background:
                  "linear-gradient(145deg, rgba(16,48,78,0.98), rgba(8,24,40,0.98))",
                border: "1px solid rgba(84,193,255,0.3)",
                boxShadow: "0 20px 55px rgba(0,0,0,0.28)"
              }}
            >
              <div
                style={{
                  color: "#63cbff",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em"
                }}
              >
                ASK ROBO
              </div>

              <h2
                style={{
                  fontSize: "30px",
                  lineHeight: 1.12,
                  margin: "10px 0 10px",
                  letterSpacing: "-0.025em"
                }}
              >
                Why did I receive HOST?
              </h2>

              <p
                style={{
                  color: "#b7c6d8",
                  fontSize: "15px",
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                ASK ROBO is being built to explain HOSTPAY, launches and reward
                provenance — including why HOST appeared in a wallet.
              </p>

              <div
                style={{
                  marginTop: "17px",
                  display: "inline-block",
                  padding: "11px 15px",
                  borderRadius: "11px",
                  background: "#4bbcff",
                  color: "#06111f",
                  fontWeight: 900,
                  fontSize: "14px"
                }}
              >
                Why did I receive HOST?
              </div>
            </div>

            <div
              style={{
                borderRadius: "22px",
                padding: "22px",
                background:
                  "linear-gradient(180deg, rgba(14,34,55,0.96), rgba(8,21,35,0.96))",
                border: "1px solid rgba(81,181,255,0.22)"
              }}
            >
              <div
                style={{
                  color: "#6fd0ff",
                  fontWeight: 800,
                  fontSize: "12px",
                  letterSpacing: "0.08em"
                }}
              >
                HOW VALUE FLOWS
              </div>

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "24px",
                  fontWeight: 900,
                  lineHeight: 1.17
                }}
              >
                Every successful launch feeds the HOSTPAY ecosystem.
              </div>

              <div
                style={{
                  marginTop: "12px",
                  color: "#aebed0",
                  lineHeight: 1.55,
                  fontSize: "14px"
                }}
              >
                Developers earn in SOL. HOST holder and host-community
                allocations are used to buy HOST for rewards. Treasury supports
                platform operations and distribution.
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: "12px",
            padding: "24px",
            borderRadius: "22px",
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
                  fontSize: "12px",
                  letterSpacing: "0.08em"
                }}
              >
                THE 1% SPLIT
              </div>

              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  margin: "7px 0 0",
                  letterSpacing: "-0.035em"
                }}
              >
                40 / 30 / 20 / 10
              </h2>
            </div>

            <div
              style={{
                color: "#9fb2c6",
                fontSize: "14px",
                maxWidth: "430px",
                lineHeight: 1.45
              }}
            >
              The 1% platform fee model is designed to flow across developers,
              HOST holders, operations and the selected host community.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "12px",
              marginTop: "20px"
            }}
          >
            {splitCards.map((card) => (
              <div
                key={card.title}
                style={{
                  borderRadius: "16px",
                  padding: "18px",
                  background: "rgba(15,35,57,0.94)",
                  border: "1px solid rgba(92,191,255,0.18)"
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    color: "#50c1ff"
                  }}
                >
                  {card.percent}
                </div>

                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 850,
                    marginTop: "6px"
                  }}
                >
                  {card.title}
                </div>

                <div
                  style={{
                    color: "#aebed0",
                    fontSize: "13px",
                    lineHeight: 1.45,
                    marginTop: "5px"
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
            marginTop: "42px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px"
          }}
        >
          <div
            style={{
              borderRadius: "22px",
              padding: "28px",
              background:
                "linear-gradient(160deg, rgba(17,43,70,0.96), rgba(7,20,33,0.98))",
              border: "1px solid rgba(79,188,255,0.22)"
            }}
          >
            <div
              style={{
                color: "#61c8ff",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.08em"
              }}
            >
              FOR DEVELOPERS
            </div>

            <h3
              style={{
                fontSize: "28px",
                margin: "12px 0 10px"
              }}
            >
              Launch into an existing community.
            </h3>

            <p
              style={{
                color: "#afc0d3",
                lineHeight: 1.6,
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
              borderRadius: "22px",
              padding: "28px",
              background:
                "linear-gradient(160deg, rgba(17,43,70,0.96), rgba(7,20,33,0.98))",
              border: "1px solid rgba(79,188,255,0.22)"
            }}
          >
            <div
              style={{
                color: "#61c8ff",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.08em"
              }}
            >
              FOR HOST COMMUNITIES
            </div>

            <h3
              style={{
                fontSize: "28px",
                margin: "12px 0 10px"
              }}
            >
              Get rewarded when projects choose you.
            </h3>

            <p
              style={{
                color: "#afc0d3",
                lineHeight: 1.6,
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
            marginTop: "48px",
            textAlign: "center",
            padding: "34px 20px"
          }}
        >
          <div
            style={{
              color: "#5dc5ff",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.08em"
            }}
          >
            HOSTPAY
          </div>

          <div
            style={{
              fontSize: "clamp(32px, 5vw, 50px)",
              fontWeight: 900,
              marginTop: "10px"
            }}
          >
            Launch. Reward. Grow.
          </div>

          <p
            style={{
              color: "#93a7bc",
              maxWidth: "720px",
              margin: "14px auto 0",
              lineHeight: 1.6
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
