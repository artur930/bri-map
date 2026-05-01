'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StatsPanel({ overview, regions }: { overview: any; regions: any[] }) {
      const invest = overview?.totalInvestment || overview?.totalInvestmentBn || 1000;
      const countries = overview?.participatingCountries || overview?.countriesInvolved || 152;
      const completed = overview?.projectsCompleted || 3000;
      const ongoing = overview?.projectsOngoing || 1800;
      const maxInvest = Math.max(...(regions || []).map((r: any) => r.investment || r.investmentBn || 0), 1);

  const statCards = [
      { icon: '$', label: 'Total Investment', value: '$' + invest + 'B+', sub: 'USD committed' },
      { icon: '#', label: 'Partner Nations', value: String(countries), sub: 'countries signed' },
      { icon: '~', label: 'Trade Volume', value: '$2800B', sub: 'annual USD' },
      { icon: '+', label: 'Jobs Created', value: '420K+', sub: 'direct jobs' },
        ];

  return (
          <div
                    style={{
                                background: 'rgba(255, 252, 245, 0.97)',
                                borderRight: '1px solid rgba(210, 185, 150, 0.5)',
                                color: '#2c1810',
                                width: '296px',
                                minWidth: '296px',
                                height: '100%',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '2px 0 12px rgba(100, 60, 20, 0.1)',
                                position: 'relative',
                                zIndex: 1000,
                    }}
                    className="custom-scroll"
                  >
                <div style={{
                              padding: '16px 16px 12px',
                              borderBottom: '1px solid rgba(210, 185, 150, 0.4)',
                              background: 'linear-gradient(135deg, #faf4e8 0%, #fff8ee 100%)',
                  }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#c85a0a', textTransform: 'uppercase', marginBottom: '4px' }}>
                                  Belt &amp; Road Initiative
                        </div>div>
                        <div style={{ fontSize: '13px', color: '#7c5c3e', lineHeight: 1.4 }}>
                                  Infrastructure &amp; Trade Network
                        </div>div>
                </div>div>
          
                <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '1px',
                              background: 'rgba(210, 185, 150, 0.3)',
                              borderBottom: '1px solid rgba(210, 185, 150, 0.4)',
                  }}>
                    {statCards.map((stat) => (
                                <div key={stat.label} style={{
                                                background: 'rgba(255, 252, 245, 0.95)',
                                                padding: '12px 14px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                }}>
                                            <div style={{ fontSize: '11px', color: '#9c7d5a', fontWeight: 500 }}>{stat.label}</div>div>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#c85a0a', lineHeight: 1 }}>{stat.value}</div>div>
                                            <div style={{ fontSize: '10px', color: '#b0926e' }}>{stat.sub}</div>div>
                                </div>div>
                              ))}
                </div>div>
          
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(210, 185, 150, 0.3)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#9c7d5a', textTransform: 'uppercase', marginBottom: '8px' }}>
                                  Project Status
                        </div>div>
                        <div style={{ position: 'relative', height: '6px', background: 'rgba(210, 185, 150, 0.3)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                                  <div style={{
                                  position: 'absolute', left: 0, top: 0, bottom: 0,
                                  width: (completed / (completed + ongoing) * 100) + '%',
                                  background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                                  borderRadius: '3px',
                  }} />
                        </div>div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                  <span style={{ color: '#16a34a', fontWeight: 600 }}>{completed.toLocaleString()} completed</span>span>
                                  <span style={{ color: '#d97706', fontWeight: 600 }}>{ongoing.toLocaleString()} ongoing</span>span>
                        </div>div>
                </div>div>
          
                <div style={{ padding: '12px 16px', flex: 1 }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#9c7d5a', textTransform: 'uppercase', marginBottom: '10px' }}>
                                  Regional Investment
                        </div>div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(regions || []).map((region: any) => {
                                  const inv = region.investment || region.investmentBn || 0;
                                  const cnt = region.countries || 0;
                                  const pct = (inv / maxInvest) * 100;
                                  const ports = region.stats?.ports || region.ports;
                                  const airports = region.stats?.airports || region.airports;
                                  const rail = region.stats?.railKm || region.railKm;
                                  return (
                                                    <div key={region.name}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                                                                                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#3d2408' }}>{region.name}</span>span>
                                                                                      <span style={{ fontSize: '11px', color: '#9c7d5a' }}>${inv}B - {cnt} nations</span>span>
                                                                    </div>div>
                                                                    <div style={{ height: '4px', background: 'rgba(210, 185, 150, 0.25)', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
                                                                                      <div style={{ height: '100%', width: pct + '%', background: region.color || '#c85a0a', borderRadius: '2px' }} />
                                                                    </div>div>
                                                        {(ports || airports || rail) && (
                                                                          <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: '#9c7d5a' }}>
                                                                              {ports && <span>{ports} ports</span>span>}
                                                                              {airports && <span>{airports} airports</span>span>}
                                                                              {rail && <span>{rail} rail</span>span>}
                                                                          </div>div>
                                                                    )}
                                                    </div>div>
                                                  );
                  })}
                        </div>div>
                </div>div>
          
                <div style={{
                              padding: '10px 16px',
                              borderTop: '1px solid rgba(210, 185, 150, 0.4)',
                              background: 'rgba(250, 244, 232, 0.8)',
                              fontSize: '10px',
                              color: '#9c7d5a',
                              textAlign: 'center',
                  }}>
                        Click any marker for details
                </div>div>
          </div>div>
        );
}</div>
