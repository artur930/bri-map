'use client';

interface StatsPanelProps {
    overview: {
          totalInvestmentBn: number;
          countriesInvolved: number;
          routesOperational: number;
          totalLengthKm: number;
    };
    regions: Array<{
      name: string;
      investmentBn: number;
      countries: number;
      color: string;
      ports?: number;
      airports?: number;
      railKm?: number;
    }>;
    projectStatus?: {
      completed: number;
      ongoing: number;
    };
}

function formatNum(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'T';
    return n.toFixed(0) + 'B';
}

export default function StatsPanel({ overview, regions, projectStatus }: StatsPanelProps) {
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
                            gap: 0,
                            boxShadow: '2px 0 12px rgba(100, 60, 20, 0.1)',
                  }}
                  className="custom-scroll"
                >
            {/* Header */}
                <div style={{
                          padding: '16px 16px 12px',
                          borderBottom: '1px solid rgba(210, 185, 150, 0.4)',
                          background: 'linear-gradient(135deg, #faf4e8 0%, #fff8ee 100%)',
                }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#c85a0a', textTransform: 'uppercase', marginBottom: '4px' }}>
                                  🌐 Belt &amp; Road Initiative
                        </div>div>
                        <div style={{ fontSize: '13px', color: '#7c5c3e', lineHeight: 1.4 }}>
                                  Infrastructure &amp; Trade Network
                        </div>div>
                </div>div>
          
            {/* Key Stats Grid */}
                <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1px',
                          background: 'rgba(210, 185, 150, 0.3)',
                          borderBottom: '1px solid rgba(210, 185, 150, 0.4)',
                }}>
                  {[
                  { icon: '💰', label: 'Total Investment', value: '$' + formatNum(overview.totalInvestmentBn), sub: 'USD committed' },
                  { icon: '🌍', label: 'Partner Nations', value: overview.countriesInvolved.toString(), sub: 'countries signed' },
                  { icon: '📦', label: 'Trade Volume', value: '$2800B', sub: 'annual USD' },
                  { icon: '👷', label: 'Jobs Created', value: '420K+', sub: 'direct jobs' },
                          ].map((stat) => (
                                      <div
                                                    key={stat.label}
                                                    style={{
                                                                    background: 'rgba(255, 252, 245, 0.95)',
                                                                    padding: '12px 14px',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '2px',
                                                    }}
                                                  >
                                                  <div style={{ fontSize: '18px', marginBottom: '2px' }}>{stat.icon}</div>div>
                                                  <div style={{ fontSize: '11px', color: '#9c7d5a', fontWeight: 500 }}>{stat.label}</div>div>
                                                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#c85a0a', lineHeight: 1 }}>{stat.value}</div>div>
                                                  <div style={{ fontSize: '10px', color: '#b0926e' }}>{stat.sub}</div>div>
                                      </div>div>
                                    ))}
                </div>div>
          
            {/* Project Status */}
            {projectStatus && (
                          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(210, 185, 150, 0.3)' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#9c7d5a', textTransform: 'uppercase', marginBottom: '8px' }}>
                                                Project Status
                                    </div>div>
                                    <div style={{ position: 'relative', height: '6px', background: 'rgba(210, 185, 150, 0.3)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                                                <div style={{
                                          position: 'absolute',
                                          left: 0, top: 0, bottom: 0,
                                          width: (projectStatus.completed / (projectStatus.completed + projectStatus.ongoing) * 100) + '%',
                                          background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                                          borderRadius: '3px',
                          }} />
                                    </div>div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                                <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ {projectStatus.completed.toLocaleString()} completed</span>span>
                                                <span style={{ color: '#d97706', fontWeight: 600 }}>⟳ {projectStatus.ongoing.toLocaleString()} ongoing</span>span>
                                    </div>div>
                          </div>div>
                )}
          
            {/* Regional Investment */}
                <div style={{ padding: '12px 16px', flex: 1 }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#9c7d5a', textTransform: 'uppercase', marginBottom: '10px' }}>
                                  Regional Investment
                        </div>div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {regions.map((region) => {
                              const maxInvest = Math.max(...regions.map(r => r.investmentBn));
                              const pct = (region.investmentBn / maxInvest) * 100;
                              return (
                                              <div key={region.name}>
                                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                                                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#3d2408' }}>{region.name}</span>span>
                                                                                <span style={{ fontSize: '11px', color: '#9c7d5a' }}>${region.investmentBn}B · {region.countries} nations</span>span>
                                                              </div>div>
                                                              <div style={{ height: '4px', background: 'rgba(210, 185, 150, 0.25)', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
                                                                                <div style={{ height: '100%', width: pct + '%', background: region.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                                                              </div>div>
                                                {(region.ports || region.airports || region.railKm) && (
                                                                  <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: '#9c7d5a' }}>
                                                                    {region.ports !== undefined && <span>⚓ {region.ports} ports</span>span>}
                                                                    {region.airports !== undefined && <span>✈ {region.airports} airports</span>span>}
                                                                    {region.railKm !== undefined && <span>🚂 {region.railKm} rail</span>span>}
                                                                  </div>div>
                                                              )}
                                              </div>div>
                                            );
                })}
                        </div>div>
                </div>div>
          
            {/* Legend */}
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
