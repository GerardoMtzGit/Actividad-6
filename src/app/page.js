"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [activeSection, setActiveSection] = useState("portada");
  
  // Portada Info State (editable so student can customize)
  const [studentName, setStudentName] = useState("Gerardo Martínez");
  const [professorName, setProfessorName] = useState("Dr. Alejandro Silva");
  const [subject, setSubject] = useState("Administración Financiera");
  const [campus, setCampus] = useState("Campus Coyoacán");
  const [currentDate, setCurrentDate] = useState("");

  // Toggle procedure visibility state
  const [expandedSteps, setExpandedSteps] = useState({
    ejercicio1: true,
    ejercicio2: true,
    ejercicio3: true,
    ejercicio4: true,
    ejercicio5: true
  });

  // --- EJERCICIO 1 STATE ---
  const [invNatalia, setInvNatalia] = useState(2500000);
  const [retNatalia, setRetNatalia] = useState(3200000);
  const [rateNatalia, setRateNatalia] = useState(2.5); // 2.5% monthly
  const [periodNatalia, setPeriodNatalia] = useState(12); // months

  // --- EJERCICIO 2 STATE ---
  const [invInicial2, setInvInicial2] = useState(40000000);
  const [invMensual2, setInvMensual2] = useState(500000);
  const [utilidadMensual2, setUtilidadMensual2] = useState(1000000);
  const [rateOportunidad2, setRateOportunidad2] = useState(6.0); // 6%
  const [tasaTipo2, setTasaTipo2] = useState("mensual"); // mensual vs anual

  // --- EJERCICIO 3 STATE ---
  const [inv3, setInv3] = useState(300000);
  const [ret3_1, setRet3_1] = useState(130000);
  const [ret3_2, setRet3_2] = useState(130000);

  // --- EJERCICIO 4 STATE ---
  const [inv4, setInv4] = useState(500);
  const [retAnual4, setRetAnual4] = useState(80);
  const [years4, setYears4] = useState(8);

  // --- EJERCICIO 5 STATE ---
  const [precio5, setPrecio5] = useState(15000);
  const [cuota5, setCuota5] = useState(1536.81);
  const [numCuotas5, setNumCuotas5] = useState(12);

  // --- HELPERS & SOLVERS ---

  // Numeric solver for IRR (Newton-Raphson)
  const calculateIRR = (cashFlows, guess = 0.1) => {
    const maxIteration = 1000;
    const precision = 1e-7;
    let r = guess;
    for (let i = 0; i < maxIteration; i++) {
      let npv = 0;
      let dNpv = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        npv += cashFlows[t] / Math.pow(1 + r, t);
        dNpv -= t * cashFlows[t] / Math.pow(1 + r, t + 1);
      }
      if (Math.abs(dNpv) < 1e-12) break;
      let nextR = r - npv / dNpv;
      if (Math.abs(nextR - r) < precision) {
        return nextR;
      }
      r = nextR;
    }
    return null;
  };

  // Toggle procedure collapse/expand
  const toggleSteps = (key) => {
    setExpandedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Format date on mount
  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('es-MX', options));
  }, []);

  // Theme switcher helper
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- MATH CALCS ---

  // Ejercicio 1: Natalia VPN
  const rNataliaDecimal = rateNatalia / 100;
  const factorNatalia = Math.pow(1 + rNataliaDecimal, periodNatalia);
  const vpRetornoNatalia = retNatalia / factorNatalia;
  const vpnNatalia = vpRetornoNatalia - invNatalia;
  const esBuenNegocio1 = vpnNatalia > 0;

  // Ejercicio 2: Tienda VPN
  // Tasa de descuento mensual efectiva
  let r2Mensual;
  let explanationRate2 = "";
  if (tasaTipo2 === "mensual") {
    r2Mensual = rateOportunidad2 / 100;
    explanationRate2 = `Tasa mensual directa: ${rateOportunidad2}% (${r2Mensual})`;
  } else {
    // Tasa nominal mensual = Tasa anual / 12
    r2Mensual = (rateOportunidad2 / 100) / 12;
    explanationRate2 = `Tasa anual del ${rateOportunidad2}% convertida a mensual nominal: ${rateOportunidad2}% / 12 = ${(rateOportunidad2 / 12).toFixed(4)}% (${r2Mensual.toFixed(6)})`;
  }

  // Egresos adicionales: 500,000 mensuales desde el mes 3 hasta el mes 10 (8 pagos)
  // Presente de inversiones adicionales en el mes 2 (anualidad vencida de 8 periodos)
  const numPagosAdicionales = 8;
  const factorAnualidadAdic = (1 - Math.pow(1 + r2Mensual, -numPagosAdicionales)) / r2Mensual;
  const vpInversionesEnMes2 = invMensual2 * factorAnualidadAdic;
  // Descontado al mes 0
  const vpInversionesAdic0 = vpInversionesEnMes2 / Math.pow(1 + r2Mensual, 2);
  const totalEgresosVP = invInicial2 + vpInversionesAdic0;

  // Ingresos: utilidades mensuales de 1,000,000 desde el mes 2 indefinidamente (perpetuidad)
  // Valor presente de la perpetuidad en el mes 1 (A / r)
  const vpPerpetuidadEnMes1 = utilidadMensual2 / r2Mensual;
  // Descontado al mes 0
  const vpIngresos0 = vpPerpetuidadEnMes1 / (1 + r2Mensual);
  const vpnEjercicio2 = vpIngresos0 - totalEgresosVP;
  const esRecomendable2 = vpnEjercicio2 > 0;

  // Ejercicio 3: Sánchez TIR
  const flows3 = [-inv3, ret3_1, ret3_2];
  const tir3Raw = calculateIRR(flows3, 0.1);
  const tir3Percent = tir3Raw !== null ? (tir3Raw * 100).toFixed(2) : "N/D";

  // Ejercicio 4: TIR $500 y $80 anual por 8 años
  const flows4 = [-inv4];
  for (let i = 0; i < years4; i++) {
    flows4.push(retAnual4);
  }
  const tir4Raw = calculateIRR(flows4, 0.1);
  const tir4Percent = tir4Raw !== null ? (tir4Raw * 100).toFixed(2) : "N/D";

  // Ejercicio 5: Financiación TV
  // Anualidad anticipada:
  // flujo hoy: contado - cuota (porque la primera cuota es hoy)
  // flujos restantes: cuota por 11 meses
  const flows5 = [precio5 - cuota5];
  for (let i = 0; i < numCuotas5 - 1; i++) {
    flows5.push(-cuota5);
  }
  const tir5Raw = calculateIRR(flows5, 0.05);
  const tir5Percent = tir5Raw !== null ? (tir5Raw * 100).toFixed(4) : "N/D";

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="nav-container">
          <div className="logo-section">
            <span className="logo-uvm">
              UVM <span className="logo-badge">Actividad 6</span>
            </span>
          </div>
          <div className="actions-group">
            <button className="btn-primary" onClick={handlePrint} title="Imprimir o Guardar como PDF">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <path d="M6 14h12v8H6z" />
              </svg>
              Exportar PDF
            </button>
            <button className="btn-icon" onClick={toggleTheme} aria-label="Cambiar Tema">
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="main-content">
        {/* Navigation Bar */}
        <nav className="anchor-nav">
          <button className={`anchor-link ${activeSection === 'portada' ? 'active' : ''}`} onClick={() => setActiveSection('portada')}>
            Portada
          </button>
          <button className={`anchor-link ${activeSection === 'ejercicio1' ? 'active' : ''}`} onClick={() => setActiveSection('ejercicio1')}>
            Ejercicio 1
          </button>
          <button className={`anchor-link ${activeSection === 'ejercicio2' ? 'active' : ''}`} onClick={() => setActiveSection('ejercicio2')}>
            Ejercicio 2
          </button>
          <button className={`anchor-link ${activeSection === 'ejercicio3' ? 'active' : ''}`} onClick={() => setActiveSection('ejercicio3')}>
            Ejercicio 3
          </button>
          <button className={`anchor-link ${activeSection === 'ejercicio4' ? 'active' : ''}`} onClick={() => setActiveSection('ejercicio4')}>
            Ejercicio 4
          </button>
          <button className={`anchor-link ${activeSection === 'ejercicio5' ? 'active' : ''}`} onClick={() => setActiveSection('ejercicio5')}>
            Ejercicio 5
          </button>
          <button className={`anchor-link ${activeSection === 'referencias' ? 'active' : ''}`} onClick={() => setActiveSection('referencias')}>
            Referencias APA
          </button>
        </nav>

        {/* SECTION: PORTADA */}
        {activeSection === 'portada' && (
          <section id="portada" className="portada-sheet">
            <div className="portada-header">
              <h2 className="portada-uni">Universidad del Valle de México</h2>
              <p className="portada-sub">Laureate International Universities</p>
              <div className="portada-divider"></div>
            </div>

            <div className="portada-title-container">
              <p className="portada-work-type">Lista de Cotejo - Ejercicios</p>
              <h1 className="portada-title">Actividad 6. VPN, TIR y Financiamiento</h1>
              <p className="portada-subtitle">Resolución interactiva y detallada de ejercicios prácticos de matemáticas financieras aplicadas.</p>
            </div>

            <div className="portada-meta">
              <div className="meta-item">
                <span className="meta-label">Estudiante</span>
                <input 
                  type="text" 
                  className="meta-value" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', borderBottom: '1px dashed var(--border-color)' }}
                />
              </div>
              <div className="meta-item">
                <span className="meta-label">Asignatura</span>
                <input 
                  type="text" 
                  className="meta-value" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', borderBottom: '1px dashed var(--border-color)' }}
                />
              </div>
              <div className="meta-item">
                <span className="meta-label">Docente</span>
                <input 
                  type="text" 
                  className="meta-value" 
                  value={professorName} 
                  onChange={(e) => setProfessorName(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', borderBottom: '1px dashed var(--border-color)' }}
                />
              </div>
              <div className="meta-item">
                <span className="meta-label">Campus</span>
                <input 
                  type="text" 
                  className="meta-value" 
                  value={campus} 
                  onChange={(e) => setCampus(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', borderBottom: '1px dashed var(--border-color)' }}
                />
              </div>
              <div className="meta-item" style={{ gridColumn: 'span 2' }}>
                <span className="meta-label">Fecha de Entrega</span>
                <input 
                  type="text" 
                  className="meta-value" 
                  value={currentDate} 
                  onChange={(e) => setCurrentDate(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', borderBottom: '1px dashed var(--border-color)' }}
                />
              </div>
            </div>

            <div className="portada-footer">
              UVM SISTEMA EJERCICIOS • MÉXICO
            </div>
          </section>
        )}

        {/* SECTION: EJERCICIO 1 */}
        {activeSection === 'ejercicio1' && (
          <section id="ejercicio1" className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span>Ejercicio 1</span>
                <span className="section-badge">VPN</span>
              </h2>
            </div>
            
            <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
              <strong>Problema:</strong> La señora Natalia invierte hoy $2,500,000 y al final del año recibe $3,200,000. Si su tasa de oportunidad es del 2.5% mensual ¿hizo un buen negocio?
            </p>

            <div className="calculator-grid">
              <div className="calculator-panel">
                <h3 className="input-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Datos del Ejercicio</h3>
                
                <div className="input-group">
                  <span className="input-label">Inversión Inicial ($)</span>
                  <input type="number" className="input-field" value={invNatalia} onChange={(e) => setInvNatalia(parseFloat(e.target.value) || 0)} />
                </div>
                
                <div className="input-group">
                  <span className="input-label">Retorno al Final del Año ($)</span>
                  <input type="number" className="input-field" value={retNatalia} onChange={(e) => setRetNatalia(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="input-group">
                  <span className="input-label">Tasa de Oportunidad Mensual (%)</span>
                  <input type="number" step="0.1" className="input-field" value={rateNatalia} onChange={(e) => setRateNatalia(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="input-group">
                  <span className="input-label">Periodos (Meses)</span>
                  <input type="number" className="input-field" value={periodNatalia} onChange={(e) => setPeriodNatalia(parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div className="results-panel">
                <div className="result-card">
                  <span className="input-label">Valor Presente Neto (VPN)</span>
                  <div className={`result-val ${esBuenNegocio1 ? 'positive' : 'negative'}`}>
                    ${vpnNatalia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="result-card" style={{ marginTop: '1rem' }}>
                  <span className="input-label">Decisión Operativa</span>
                  <div className={`result-val ${esBuenNegocio1 ? 'positive' : 'negative'}`} style={{ fontSize: '1.5rem' }}>
                    {esBuenNegocio1 ? "ACEPTAR NEGOCIO" : "RECHAZAR NEGOCIO"}
                  </div>
                </div>
              </div>
            </div>

            <div className="cashflow-visualizer">
              <h4 className="cashflow-title">Diagrama de Flujo de Caja (Natalia)</h4>
              <div className="cashflow-timeline">
                <div className="cashflow-node outflow">
                  <span className="cashflow-val">-${invNatalia.toLocaleString('es-MX')}</span>
                  <div className="cashflow-arrow"></div>
                  <span className="cashflow-period">Mes 0</span>
                </div>
                <div className="cashflow-node neutral">
                  <span className="cashflow-val" style={{ color: 'var(--text-muted)' }}>$0</span>
                  <div className="cashflow-arrow"></div>
                  <span className="cashflow-period">Meses 1-11</span>
                </div>
                <div className="cashflow-node inflow">
                  <span className="cashflow-val">+${retNatalia.toLocaleString('es-MX')}</span>
                  <div className="cashflow-arrow"></div>
                  <span className="cashflow-period">Mes {periodNatalia}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="procedimiento-container">
              <h4 className="procedimiento-title" onClick={() => toggleSteps('ejercicio1')} style={{ cursor: 'pointer' }}>
                Procedimiento Matemático {expandedSteps.ejercicio1 ? "▼" : "▶"}
              </h4>
              {expandedSteps.ejercicio1 && (
                <div className="step-details-list">
                  <p><strong>Fórmula del Valor Presente Neto (VPN):</strong></p>
                  <div className="math-formula-box">
                    VPN = - I<sub>0</sub> + F<sub>n</sub> / (1 + i)<sup>n</sup>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 1:</strong> Identificar variables del flujo de caja y tasa de descuento.
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                      <li>Inversión Inicial (I<sub>0</sub>) = ${invNatalia.toLocaleString('es-MX')}</li>
                      <li>Flujo Futuro en Mes {periodNatalia} (F<sub>{periodNatalia}</sub>) = ${retNatalia.toLocaleString('es-MX')}</li>
                      <li>Tasa Mensual (i) = {rateNatalia}% = {rNataliaDecimal}</li>
                      <li>Número de meses (n) = {periodNatalia}</li>
                    </ul>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 2:</strong> Calcular el valor presente (VP) del retorno futuro.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      VP = {retNatalia.toLocaleString('es-MX')} / (1 + {rNataliaDecimal})<sup>{periodNatalia}</sup> <br />
                      VP = {retNatalia.toLocaleString('es-MX')} / ({ (1 + rNataliaDecimal).toFixed(3) })<sup>{periodNatalia}</sup> <br />
                      VP = {retNatalia.toLocaleString('es-MX')} / {factorNatalia.toFixed(6)} <br />
                      VP = ${vpRetornoNatalia.toLocaleString('es-MX', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                    </div>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 3:</strong> Restar la inversión inicial para obtener el VPN.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      VPN = -{invNatalia.toLocaleString('es-MX')} + {vpRetornoNatalia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br />
                      VPN = ${vpnNatalia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="conclusion-box">
              <h4 className="conclusion-title">Conclusión de Viabilidad</h4>
              <p className="conclusion-text">
                Se recomienda <strong>{esBuenNegocio1 ? "ACEPTAR" : "RECHAZAR"}</strong> este negocio. 
                El VPN obtenido es de <strong>${vpnNatalia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>. 
                {esBuenNegocio1 ? (
                  " Debido a que el VPN es positivo (VPN > 0), el negocio genera un rendimiento superior a la tasa de oportunidad exigida del " + rateNatalia + "% mensual, incrementando la riqueza del inversionista."
                ) : (
                  " Debido a que el VPN es negativo (VPN < 0), significa que el retorno del negocio ($" + retNatalia.toLocaleString('es-MX') + " al final del año) no es suficiente para cubrir la tasa mínima de retorno requerida del " + rateNatalia + "% mensual sobre el capital de $" + invNatalia.toLocaleString('es-MX') + ". Si Natalia invierte aquí, perderá $" + Math.abs(vpnNatalia).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " en valor presente en comparación con su alternativa de inversión."
                )}
              </p>
            </div>

            <div className="excel-tip-box">
              <span className="excel-icon">💡</span>
              <div className="excel-content">
                <strong>Equivalencia en Excel:</strong> Puedes calcular esto usando la fórmula: <br />
                <code>=VNA({rateNatalia}%, {retNatalia}) - {invNatalia}</code> o bien <code>={retNatalia}/(1 + {rateNatalia}%)^{periodNatalia} - {invNatalia}</code>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: EJERCICIO 2 */}
        {activeSection === 'ejercicio2' && (
          <section id="ejercicio2" className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span>Ejercicio 2</span>
                <span className="section-badge">VPN Complejo</span>
              </h2>
            </div>

            <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
              <strong>Problema:</strong> Se va a montar una tienda que requiere una inversión inicial de $40,000,000 y luego inversiones adicionales de $500,000 mensuales desde el final del tercer mes hasta el final del mes décimo. Se espera obtener utilidades mensuales a partir del segundo mes en forma indefinida de $1,000,000. Si la tasa de oportunidades es del 6%, ¿se recomienda el proyecto? Utilice el método del VPN.
            </p>

            <div className="calculator-grid">
              <div className="calculator-panel">
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <h3 className="input-label" style={{ margin: 0 }}>Datos de Simulación</h3>
                  
                  {/* Selector Tasa Mensual vs Anual */}
                  <div className="switch-container">
                    <span className={`switch-label ${tasaTipo2 === 'anual' ? 'active' : ''}`} onClick={() => setTasaTipo2('anual')}>Anual</span>
                    <label className="switch-control">
                      <input type="checkbox" checked={tasaTipo2 === 'mensual'} onChange={(e) => setTasaTipo2(e.target.checked ? 'mensual' : 'anual')} />
                      <span className="switch-slider"></span>
                    </label>
                    <span className={`switch-label ${tasaTipo2 === 'mensual' ? 'active' : ''}`} onClick={() => setTasaTipo2('mensual')}>Mensual</span>
                  </div>
                </div>

                <div className="input-group">
                  <span className="input-label">Inversión Inicial ($)</span>
                  <input type="number" className="input-field" value={invInicial2} onChange={(e) => setInvInicial2(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="input-group">
                  <span className="input-label">Inversiones Adicionales Mensuales ($)</span>
                  <input type="number" className="input-field" value={invMensual2} onChange={(e) => setInvMensual2(parseFloat(e.target.value) || 0)} />
                  <span className="ratio-desc" style={{ marginTop: '-4px' }}>Cobrado de los meses 3 a 10 (8 pagos)</span>
                </div>

                <div className="input-group">
                  <span className="input-label">Utilidades Mensuales Indefinidas ($)</span>
                  <input type="number" className="input-field" value={utilidadMensual2} onChange={(e) => setUtilidadMensual2(parseFloat(e.target.value) || 0)} />
                  <span className="ratio-desc" style={{ marginTop: '-4px' }}>Cobrado a partir del mes 2 (Perpetuidad)</span>
                </div>

                <div className="input-group">
                  <span className="input-label">Tasa de Oportunidad ({tasaTipo2}) (%)</span>
                  <input type="number" step="0.1" className="input-field" value={rateOportunidad2} onChange={(e) => setRateOportunidad2(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div className="results-panel">
                <div className="result-card">
                  <span className="input-label">Tasa de Descuento Mensual Aplicada</span>
                  <div className="result-val" style={{ fontSize: '1.25rem', color: 'var(--brand-color)' }}>
                    {(r2Mensual * 100).toFixed(4)}% mensual
                  </div>
                </div>

                <div className="result-card" style={{ margin: '0.75rem 0' }}>
                  <span className="input-label">Valor Presente Neto (VPN)</span>
                  <div className={`result-val ${esRecomendable2 ? 'positive' : 'negative'}`} style={{ fontSize: '1.75rem' }}>
                    ${vpnEjercicio2.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="result-card">
                  <span className="input-label">Decisión Operativa</span>
                  <div className={`result-val ${esRecomendable2 ? 'positive' : 'negative'}`} style={{ fontSize: '1.25rem' }}>
                    {esRecomendable2 ? "RECOMENDAR PROYECTO" : "RECHAZAR PROYECTO"}
                  </div>
                </div>
              </div>
            </div>

            <div className="cashflow-visualizer" style={{ overflowX: 'auto' }}>
              <h4 className="cashflow-title">Diagrama Temporal de Flujos de Caja (Meses 0 - 10+)</h4>
              <div className="cashflow-timeline" style={{ minWidth: '700px' }}>
                <div className="cashflow-node outflow">
                  <span className="cashflow-val">-${(invInicial2/1000000).toFixed(1)}M</span>
                  <div className="cashflow-arrow"></div>
                  <span className="cashflow-period">Mes 0</span>
                </div>
                <div className="cashflow-node neutral">
                  <span className="cashflow-val">$0</span>
                  <div className="cashflow-arrow"></div>
                  <span className="cashflow-period">Mes 1</span>
                </div>
                <div className="cashflow-node inflow">
                  <span className="cashflow-val">+${(utilidadMensual2/1000).toFixed(0)}k</span>
                  <div className="cashflow-arrow"></div>
                  <span className="cashflow-period">Mes 2</span>
                </div>
                <div className="cashflow-node inflow" style={{ border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
                  <span className="cashflow-val" style={{ color: '#c2410c' }}>Neto +$500k</span>
                  <div className="cashflow-arrow" style={{ backgroundColor: '#c2410c' }}></div>
                  <span className="cashflow-period">Mes 3-10</span>
                </div>
                <div className="cashflow-node inflow">
                  <span className="cashflow-val">+${(utilidadMensual2/1000).toFixed(0)}k</span>
                  <div className="cashflow-arrow"></div>
                  <span className="cashflow-period">Mes 11... ∞</span>
                </div>
              </div>
              <span className="ratio-desc" style={{ display: 'block', textAlign: 'center', marginTop: '0.5rem' }}>Nota: En los meses 3 al 10 se recibe la utilidad de $1M pero se resta la inversión de $500k, quedando un neto de +$500k.</span>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="procedimiento-container">
              <h4 className="procedimiento-title" onClick={() => toggleSteps('ejercicio2')} style={{ cursor: 'pointer' }}>
                Procedimiento Matemático {expandedSteps.ejercicio2 ? "▼" : "▶"}
              </h4>
              {expandedSteps.ejercicio2 && (
                <div className="step-details-list">
                  <div className="step-details-item">
                    <strong>Paso 1:</strong> Establecer la tasa de descuento mensual ($i$).
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{explanationRate2}</p>
                  </div>

                  <div className="step-details-item">
                    <strong>Paso 2:</strong> VP de Egresos (Inversión Inicial + Adicionales).
                    <p>Las inversiones adicionales de ${invMensual2.toLocaleString('es-MX')} mensuales ocurren al final del mes 3 al 10. Son $N = 8$ periodos de flujo constante. Esto constituye una anualidad ordinaria vencida valorada en el Mes 2 y luego descontada al Mes 0:</p>
                    <div className="math-formula-box">
                      VP<sub>adicionales, 2</sub> = R &times; [ 1 - (1 + i)<sup>-N</sup> ] / i
                    </div>
                    <div style={{ fontFamily: 'monospace', paddingLeft: '1rem' }}>
                      VP<sub>adicionales, 2</sub> = {invMensual2.toLocaleString('es-MX')} &times; [ 1 - (1 + {r2Mensual.toFixed(6)})<sup>-8</sup> ] / {r2Mensual.toFixed(6)} <br />
                      VP<sub>adicionales, 2</sub> = {invMensual2.toLocaleString('es-MX')} &times; [ {(1 - Math.pow(1 + r2Mensual, -8)).toFixed(6)} ] / {r2Mensual.toFixed(6)} <br />
                      VP<sub>adicionales, 2</sub> = ${vpInversionesEnMes2.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p style={{ marginTop: '0.5rem' }}>Descontamos este monto 2 meses hacia atrás para traerlo al periodo 0:</p>
                    <div style={{ fontFamily: 'monospace', paddingLeft: '1rem' }}>
                      VP<sub>adicionales, 0</sub> = VP<sub>adicionales, 2</sub> / (1 + i)<sup>2</sup> <br />
                      VP<sub>adicionales, 0</sub> = {vpInversionesEnMes2.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {(Math.pow(1 + r2Mensual, 2)).toFixed(6)} <br />
                      VP<sub>adicionales, 0</sub> = ${vpInversionesAdic0.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p style={{ marginTop: '0.5rem' }}>Por lo tanto, los egresos totales expresados en valor presente son:</p>
                    <div style={{ fontFamily: 'monospace', paddingLeft: '1rem', fontWeight: 'bold' }}>
                      VP<sub>egresos_totales</sub> = ${invInicial2.toLocaleString('es-MX')} + ${vpInversionesAdic0.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${totalEgresosVP.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="step-details-item">
                    <strong>Paso 3:</strong> VP de Ingresos (Utilidades en Perpetuidad).
                    <p>Las utilidades mensuales de ${utilidadMensual2.toLocaleString('es-MX')} inician en el mes 2 en forma indefinida. La fórmula de valor presente de una perpetuidad evalúa el valor total en el periodo anterior a su inicio (Mes 1):</p>
                    <div className="math-formula-box">
                      VP<sub>perpetuidad, 1</sub> = Utilidad / i
                    </div>
                    <div style={{ fontFamily: 'monospace', paddingLeft: '1rem' }}>
                      VP<sub>perpetuidad, 1</sub> = {utilidadMensual2.toLocaleString('es-MX')} / {r2Mensual.toFixed(6)} <br />
                      VP<sub>perpetuidad, 1</sub> = ${vpPerpetuidadEnMes1.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p style={{ marginTop: '0.5rem' }}>Descontamos el valor del Mes 1 hacia el periodo 0:</p>
                    <div style={{ fontFamily: 'monospace', paddingLeft: '1rem' }}>
                      VP<sub>ingresos, 0</sub> = VP<sub>perpetuidad, 1</sub> / (1 + i)<sup>1</sup> <br />
                      VP<sub>ingresos, 0</sub> = {vpPerpetuidadEnMes1.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {(1 + r2Mensual).toFixed(6)} <br />
                      VP<sub>ingresos, 0</sub> = ${vpIngresos0.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="step-details-item">
                    <strong>Paso 4:</strong> Cálculo final del VPN.
                    <div style={{ fontFamily: 'monospace', paddingLeft: '1rem', fontWeight: 'bold' }}>
                      VPN = VP<sub>ingresos, 0</sub> - VP<sub>egresos_totales</sub> <br />
                      VPN = {vpIngresos0.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - {totalEgresosVP.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br />
                      VPN = ${vpnEjercicio2.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="conclusion-box">
              <h4 className="conclusion-title">Análisis y Recomendación</h4>
              <p className="conclusion-text">
                Bajo los supuestos de la simulación, se concluye lo siguiente: <br />
                {esRecomendable2 ? (
                  <>
                    El proyecto es <strong>VIABLE</strong> y se recomienda su implementación. El VPN calculado es de <strong>${vpnEjercicio2.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>. Al ser mayor que cero (VPN &gt; 0), significa que el proyecto generará rendimientos suficientes para cubrir la inversión inicial de ${invInicial2.toLocaleString('es-MX')}, las amortizaciones adicionales mensuales y, además, agregará valor neto patrimonial al negocio ajustado a una tasa de oportunidad del {rateOportunidad2}% {tasaTipo2}.
                  </>
                ) : (
                  <>
                    El proyecto <strong>NO ES RECOMENDABLE</strong> y se debe rechazar. El VPN calculado es negativo y asciende a <strong>${vpnEjercicio2.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>. Esto ocurre porque una tasa de oportunidad del {rateOportunidad2}% {tasaTipo2} mensual castiga fuertemente el valor en el tiempo de los flujos perpetuos futuros. El valor actual de todas las utilidades futuras (${vpIngresos0.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}) no alcanza a compensar el costo financiero de la inversión inicial y las amortizaciones de capital (${totalEgresosVP.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}).
                  </>
                )}
              </p>
            </div>
          </section>
        )}

        {/* SECTION: EJERCICIO 3 */}
        {activeSection === 'ejercicio3' && (
          <section id="ejercicio3" className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span>Ejercicio 3</span>
                <span className="section-badge">TIR e Interpretación</span>
              </h2>
            </div>

            <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
              <strong>Problema:</strong> El señor Sánchez invierte $300,000 y recibe al final del primer año $130,000 y al final del segundo año $130,000. Calcula la TIR usando Excel e indica a manera de conclusión qué significa este resultado para el inversionista.
            </p>

            <div className="calculator-grid">
              <div className="calculator-panel">
                <h3 className="input-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Datos del Ejercicio</h3>
                
                <div className="input-group">
                  <span className="input-label">Inversión (Año 0) ($)</span>
                  <input type="number" className="input-field" value={inv3} onChange={(e) => setInv3(parseFloat(e.target.value) || 0)} />
                </div>
                
                <div className="input-group">
                  <span className="input-label">Flujo Recibido (Año 1) ($)</span>
                  <input type="number" className="input-field" value={ret3_1} onChange={(e) => setRet3_1(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="input-group">
                  <span className="input-label">Flujo Recibido (Año 2) ($)</span>
                  <input type="number" className="input-field" value={ret3_2} onChange={(e) => setRet3_2(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div className="results-panel">
                <div className="result-card">
                  <span className="input-label">Tasa Interna de Retorno (TIR)</span>
                  <div className={`result-val ${tir3Raw > 0 ? 'positive' : 'negative'}`}>
                    {tir3Percent}%
                  </div>
                </div>

                <div className="result-card" style={{ marginTop: '1rem' }}>
                  <span className="input-label">Retorno Total Nominal</span>
                  <div className="result-val" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
                    ${(ret3_1 + ret3_2).toLocaleString('es-MX')} vs ${inv3.toLocaleString('es-MX')}
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="procedimiento-container">
              <h4 className="procedimiento-title" onClick={() => toggleSteps('ejercicio3')} style={{ cursor: 'pointer' }}>
                Procedimiento Matemático {expandedSteps.ejercicio3 ? "▼" : "▶"}
              </h4>
              {expandedSteps.ejercicio3 && (
                <div className="step-details-list">
                  <p>La Tasa Interna de Retorno (TIR) es la tasa de interés que iguala el VPN a cero. Planteamos la ecuación:</p>
                  <div className="math-formula-box">
                    0 = - I<sub>0</sub> + F<sub>1</sub> / (1 + r)<sup>1</sup> + F<sub>2</sub> / (1 + r)<sup>2</sup>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 1:</strong> Sustituir los valores conocidos en la ecuación.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      0 = -{inv3} + {ret3_1} / (1 + r) + {ret3_2} / (1 + r)<sup>2</sup>
                    </div>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 2:</strong> Simplificar sustituyendo variable para resolver ecuación cuadrática. Sea $x = 1 / (1 + r)$:
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      {ret3_2}x<sup>2</sup> + {ret3_1}x - {inv3} = 0 <br />
                      130,000x<sup>2</sup> + 130,000x - 300,000 = 0 <br />
                      13x<sup>2</sup> + 13x - 30 = 0
                    </div>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 3:</strong> Aplicar fórmula cuadrática para hallar la raíz positiva de $x$.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      x = [ -13 &plusmn; &radic;( 13<sup>2</sup> - 4 &times; 13 &times; (-30) ) ] / (2 &times; 13) <br />
                      x = [ -13 &plusmn; &radic;( 169 + 1560 ) ] / 26 <br />
                      x = [ -13 &plusmn; &radic;( 1729 ) ] / 26 <br />
                      x = [ -13 + 41.581245 ] / 26 <br />
                      x = 28.581245 / 26 = 1.099279
                    </div>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 4:</strong> Despejar la tasa $r$ a partir de $x = 1 / (1 + r)$.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      1 + r = 1 / 1.099279 <br />
                      1 + r = 0.909687 <br />
                      r = 0.909687 - 1 = -0.090313 = -9.03%
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="conclusion-box">
              <h4 className="conclusion-title">Significado para el Inversionista</h4>
              <p className="conclusion-text">
                Este resultado de una TIR del <strong>{tir3Percent}%</strong> significa que el proyecto es <strong>completamente inviable y destruye valor</strong>. 
                Una tasa interna de retorno negativa indica que los ingresos recibidos a lo largo de los dos años (suma total nominal de <strong>${(ret3_1 + ret3_2).toLocaleString('es-MX')}</strong>) son inferiores a la inversión inicial (<strong>${inv3.toLocaleString('es-MX')}</strong>). 
                Por ende, el inversionista no solo no obtiene ganancias, sino que <strong>no logra recuperar la totalidad del capital invertido</strong> (pierde nominalmente $40,000 pesos en total, además del costo de oportunidad del dinero en el tiempo). Este proyecto debe ser categóricamente rechazado.
              </p>
            </div>

            <div className="excel-tip-box">
              <span className="excel-icon">📋</span>
              <div className="excel-content">
                <strong>Cómo calcularlo en Excel / Google Sheets:</strong> <br />
                1. Registra los flujos en celdas contiguas (ej. A1:A3). <br />
                2. Celda <code>A1: -300000</code> (inversión en negativo). <br />
                3. Celda <code>A2: 130000</code>, Celda <code>A3: 130000</code>. <br />
                4. Usa la fórmula: <code>=TIR(A1:A3)</code>. El resultado arrojado será <code>-9.03%</code>.
              </div>
            </div>
          </section>
        )}

        {/* SECTION: EJERCICIO 4 */}
        {activeSection === 'ejercicio4' && (
          <section id="ejercicio4" className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span>Ejercicio 4</span>
                <span className="section-badge">TIR Anualidad</span>
              </h2>
            </div>

            <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
              <strong>Problema:</strong> Se invierten $500 con la expectativa de recibir $80 al final de cada uno de los siguientes 8 años, calcula la TIR.
            </p>

            <div className="calculator-grid">
              <div className="calculator-panel">
                <h3 className="input-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Datos del Ejercicio</h3>
                
                <div className="input-group">
                  <span className="input-label">Inversión Inicial ($)</span>
                  <input type="number" className="input-field" value={inv4} onChange={(e) => setInv4(parseFloat(e.target.value) || 0)} />
                </div>
                
                <div className="input-group">
                  <span className="input-label">Anualidad Recibida ($)</span>
                  <input type="number" className="input-field" value={retAnual4} onChange={(e) => setRetAnual4(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="input-group">
                  <span className="input-label">Número de Años</span>
                  <input type="number" className="input-field" value={years4} onChange={(e) => setYears4(parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div className="results-panel">
                <div className="result-card">
                  <span className="input-label">Tasa Interna de Retorno (TIR)</span>
                  <div className={`result-val ${tir4Raw > 0 ? 'positive' : 'negative'}`}>
                    {tir4Percent}%
                  </div>
                </div>

                <div className="result-card" style={{ marginTop: '1rem' }}>
                  <span className="input-label">Rendimiento Total (Sin Descontar)</span>
                  <div className="result-val" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
                    ${(retAnual4 * years4).toLocaleString('es-MX')} en total
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="procedimiento-container">
              <h4 className="procedimiento-title" onClick={() => toggleSteps('ejercicio4')} style={{ cursor: 'pointer' }}>
                Procedimiento Matemático {expandedSteps.ejercicio4 ? "▼" : "▶"}
              </h4>
              {expandedSteps.ejercicio4 && (
                <div className="step-details-list">
                  <p>La ecuación de equivalencia financiera para una anualidad ordinaria vencida igualada al costo de inversión es:</p>
                  <div className="math-formula-box">
                    I<sub>0</sub> = R &times; [ 1 - (1 + r)<sup>-n</sup> ] / r
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 1:</strong> Reemplazar las variables conocidas.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      {inv4} = {retAnual4} &times; [ 1 - (1 + r)<sup>-{years4}</sup> ] / r <br />
                      [ 1 - (1 + r)<sup>-{years4}</sup> ] / r = {inv4} / {retAnual4} = {(inv4/retAnual4).toFixed(4)}
                    </div>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 2:</strong> Probar tasas para aproximar numéricamente (Interpolación Lineal).
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                      <li>
                        Probando con r = 5.0%:<br />
                        [ 1 - (1.05)<sup>-8</sup> ] / 0.05 = 6.46321 (Diferente a {(inv4/retAnual4).toFixed(2)})
                      </li>
                      <li>
                        Probando con r = 6.0%:<br />
                        [ 1 - (1.06)<sup>-8</sup> ] / 0.06 = 6.20979 (Diferente a {(inv4/retAnual4).toFixed(2)})
                      </li>
                    </ul>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 3:</strong> Resolver por aproximaciones sucesivas o Newton-Raphson.
                    <p>La convergencia numérica con alta precisión nos da el valor de:</p>
                    <div style={{ fontFamily: 'monospace', paddingLeft: '1rem', fontWeight: 'bold' }}>
                      r &approx; {(tir4Raw !== null ? tir4Raw : 0).toFixed(6)} = {tir4Percent}% anual.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="conclusion-box">
              <h4 className="conclusion-title">Análisis Financiero</h4>
              <p className="conclusion-text">
                El rendimiento interno del proyecto es del <strong>{tir4Percent}% anual</strong>. 
                Si la tasa de oportunidad exigida por el inversionista es menor a este porcentaje, entonces el proyecto se considera rentable y aceptable. Si la tasa de oportunidad es mayor, entonces se rechaza debido a que el proyecto no rinde lo mínimo solicitado.
              </p>
            </div>

            <div className="excel-tip-box">
              <span className="excel-icon">⚡</span>
              <div className="excel-content">
                <strong>Equivalente en Excel:</strong> Coloca <code>-500</code> en <code>A1</code> y <code>80</code> en el rango <code>A2:A9</code>. Utiliza la fórmula <code>=TIR(A1:A9)</code> para obtener la tasa del <code>5.82%</code>.
              </div>
            </div>
          </section>
        )}

        {/* SECTION: EJERCICIO 5 */}
        {activeSection === 'ejercicio5' && (
          <section id="ejercicio5" className="section-card">
            <div className="section-header">
              <h2 className="section-title">
                <span>Ejercicio 5</span>
                <span className="section-badge">Tasa de Financiación</span>
              </h2>
            </div>

            <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
              <strong>Problema:</strong> Una televisión que tiene un precio de contado de $15,000 se financia con 12 cuotas mensuales iguales anticipadas de $1,536.81 ¿qué tasa de interés le cobraron por la financiación?
            </p>

            <div className="calculator-grid">
              <div className="calculator-panel">
                <h3 className="input-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Datos del Ejercicio</h3>
                
                <div className="input-group">
                  <span className="input-label">Precio de Contado ($)</span>
                  <input type="number" className="input-field" value={precio5} onChange={(e) => setPrecio5(parseFloat(e.target.value) || 0)} />
                </div>
                
                <div className="input-group">
                  <span className="input-label">Valor de Cuota Mensual ($)</span>
                  <input type="number" className="input-field" value={cuota5} onChange={(e) => setCuota5(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="input-group">
                  <span className="input-label">Número de Cuotas Anticipadas</span>
                  <input type="number" className="input-field" value={numCuotas5} onChange={(e) => setNumCuotas5(parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div className="results-panel">
                <div className="result-card">
                  <span className="input-label">Tasa de Interés Cobrada (Mensual)</span>
                  <div className="result-val positive">
                    {tir5Percent}%
                  </div>
                </div>

                <div className="result-card" style={{ marginTop: '1rem' }}>
                  <span className="input-label">Costo Total Financiado</span>
                  <div className="result-val" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
                    ${(cuota5 * numCuotas5).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="procedimiento-container">
              <h4 className="procedimiento-title" onClick={() => toggleSteps('ejercicio5')} style={{ cursor: 'pointer' }}>
                Procedimiento Matemático {expandedSteps.ejercicio5 ? "▼" : "▶"}
              </h4>
              {expandedSteps.ejercicio5 && (
                <div className="step-details-list">
                  <p>Al tratarse de cuotas <strong>anticipadas</strong> (la primera cuota se paga inmediatamente en el Mes 0), aplicamos la fórmula de valor presente de una anualidad anticipada:</p>
                  <div className="math-formula-box">
                    VP = R &times; (1 + i) &times; [ 1 - (1 + i)<sup>-n</sup> ] / i
                  </div>
                  <p>O expresado de forma desglosada separando la primera cuota que no sufre descuento (Mes 0):</p>
                  <div className="math-formula-box">
                    VP = R + R &times; [ 1 - (1 + i)<sup>-(n-1)</sup> ] / i
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 1:</strong> Sustituir los valores conocidos.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      {precio5} = {cuota5} + {cuota5} &times; [ 1 - (1 + i)<sup>-({numCuotas5} - 1)</sup> ] / i <br />
                      {precio5} - {cuota5} = {cuota5} &times; [ 1 - (1 + i)<sup>-11</sup> ] / i <br />
                      { (precio5 - cuota5).toFixed(2) } = {cuota5} &times; [ 1 - (1 + i)<sup>-11</sup> ] / i <br />
                      [ 1 - (1 + i)<sup>-11</sup> ] / i = { (precio5 - cuota5).toFixed(2) } / {cuota5} = { ((precio5 - cuota5)/cuota5).toFixed(6) }
                    </div>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 2:</strong> Probar numéricamente tasas de interés.
                    <p>Si ensayamos con una tasa de interés mensual de <strong>4.0% (i = 0.04)</strong>:</p>
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      Factor = [ 1 - (1.04)<sup>-11</sup> ] / 0.04 <br />
                      Factor = [ 1 - {(Math.pow(1.04, -11)).toFixed(6)} ] / 0.04 <br />
                      Factor = [ {(1 - Math.pow(1.04, -11)).toFixed(6)} ] / 0.04 <br />
                      Factor = { ((1 - Math.pow(1.04, -11)) / 0.04).toFixed(6) }
                    </div>
                    <p>El valor calculado (8.760478) coincide exactamente con el coeficiente requerido.</p>
                  </div>
                  <div className="step-details-item">
                    <strong>Paso 3:</strong> Validar el costo financiero.
                    <div style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      VP<sub>calculado</sub> = {cuota5} + {cuota5} &times; 8.760478 <br />
                      VP<sub>calculado</sub> = {cuota5} + { (cuota5 * 8.760478).toFixed(2) } = { (cuota5 + cuota5 * 8.760478).toFixed(2) } <br />
                      VP<sub>calculado</sub> &approx; ${precio5.toLocaleString('es-MX')} (Coincide perfectamente)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="conclusion-box">
              <h4 className="conclusion-title">Análisis de la Financiación</h4>
              <p className="conclusion-text">
                La tasa de interés cobrada por la financiación de la televisión es exactamente del <strong>{(tir5Raw !== null ? tir5Raw * 100 : 4).toFixed(2)}% mensual</strong>. 
                Financieramente, esta tasa representa el costo del crédito mensual bajo un esquema de pagos anticipados. El costo total nominal que terminará pagando Natalia es de <strong>${(cuota5 * numCuotas5).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>, lo cual representa un sobreprecio por financiamiento de <strong>${(cuota5 * numCuotas5 - precio5).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> con respecto a la adquisición de contado.
              </p>
            </div>

            <div className="excel-tip-box">
              <span className="excel-icon">📈</span>
              <div className="excel-content">
                <strong>Equivalencia en Excel:</strong> <br />
                Puedes usar la fórmula financiera <code>=TASA(nper, pago, va, [vf], [tipo])</code>. <br />
                Para este ejercicio: <code>=TASA({numCuotas5}, -{cuota5}, {precio5}, 0, 1)</code>. <br />
                <em>Nota: El argumento <code>tipo = 1</code> indica que los pagos son anticipados. El resultado dará <code>4.00%</code>.</em>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: REFERENCIAS */}
        {activeSection === 'referencias' && (
          <section id="referencias" className="section-card">
            <div className="section-header">
              <h2 className="section-title">Referencias Bibliográficas</h2>
            </div>
            
            <div className="references-list">
              <div className="reference-item">
                Baca Urbina, G. (2016). <em>Evaluación de Proyectos</em> (8a ed.). McGraw-Hill.
              </div>
              <div className="reference-item">
                García Padilla, V. M. (2015). <em>Matemáticas Financieras</em>. Patria.
              </div>
              <div className="reference-item">
                García, J. (2019). <em>Matemáticas Financieras para la toma de decisiones empresariales</em>. Ecoe Ediciones.
              </div>
              <div className="reference-item">
                Ross, S. A., Westerfield, R. W., & Jordan, B. D. (2018). <em>Fundamentos de Finanzas Corporativas</em> (11a ed.). McGraw-Hill.
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
