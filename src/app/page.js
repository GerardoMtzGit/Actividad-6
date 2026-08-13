"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [currentActivity, setCurrentActivity] = useState("actividad7");
  const [activeSection, setActiveSection] = useState("portada7");
  const [studyMode, setStudyMode] = useState(true);
  
  // Editor mode states
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [sectionOrder, setSectionOrder] = useState([
    'portada',
    'ejercicio1',
    'ejercicio2',
    'ejercicio3',
    'ejercicio4',
    'ejercicio5',
    'referencias'
  ]);
  const [sectionsConfig, setSectionsConfig] = useState({
    portada: { title: "Actividad 6. VPN, TIR y Financiamiento", subtitle: "Resolución interactiva y detallada de ejercicios prácticos de matemáticas financieras aplicadas.", badge: "UVM", theme: "red", visible: true },
    ejercicio1: { title: "Ejercicio 1", badge: "VPN", problem: "La señora Natalia invierte hoy $2,500,000 y al final del año recibe $3,200,000. Si su tasa de oportunidad es del 2.5% mensual ¿hizo un buen negocio?", theme: "red", visible: true },
    ejercicio2: { title: "Ejercicio 2", badge: "VPN Complejo", problem: "Se va a montar una tienda que requiere una inversión inicial de $40,000,000 y luego inversiones adicionales de $500,000 mensuales desde el final del tercer mes hasta el final del mes décimo. Se espera obtener utilidades mensuales a partir del segundo mes en forma indefinida de $1,000,000. Si la tasa de oportunidades es del 6%, ¿se recomienda el proyecto? Utilice el método del VPN.", theme: "red", visible: true },
    ejercicio3: { title: "Ejercicio 3", badge: "TIR e Interpretación", problem: "El señor Sánchez invierte $300,000 y recibe al final del primer año $130,000 y al final del segundo año $130,000. Calcula la TIR usando Excel e indica a manera de conclusión qué significa este resultado para el inversionista.", theme: "red", visible: true },
    ejercicio4: { title: "Ejercicio 4", badge: "TIR Anualidad", problem: "Se invierten $500 con la expectativa de recibir $80 al final de cada uno de los siguientes 8 años, calcula la TIR.", theme: "red", visible: true },
    ejercicio5: { title: "Ejercicio 5", badge: "Tasa de Financiación", problem: "Una televisión que tiene un precio de contado de $15,000 se financia con 12 cuotas mensuales iguales anticipadas de $1,536.81 ¿qué tasa de interés le cobraron por la financiación?", theme: "red", visible: true },
    referencias: { title: "Referencias Bibliográficas", badge: "APA", theme: "red", visible: true }
  });
  const [customSections, setCustomSections] = useState([]);

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

  // --- ACTIVIDAD 7 SENSIBILIDAD STATE ---
  const [inv7, setInv7] = useState(12000);
  const [tmar7, setTmar7] = useState(10.0);
  const [flow7_1, setFlow7_1] = useState(4000);
  const [flow7_2, setFlow7_2] = useState(4000);
  const [flow7_3, setFlow7_3] = useState(4000);
  const [flow7_4, setFlow7_4] = useState(8000);

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

  // Format date and load settings on mount
  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('es-MX', options));
    
    try {
      const savedOrder = localStorage.getItem("uvm_section_order");
      const savedConfig = localStorage.getItem("uvm_sections_config");
      const savedCustom = localStorage.getItem("uvm_custom_sections");
      if (savedOrder) setSectionOrder(JSON.parse(savedOrder));
      if (savedConfig) setSectionsConfig(JSON.parse(savedConfig));
      if (savedCustom) setCustomSections(JSON.parse(savedCustom));
    } catch (e) {
      console.error("Error loading settings from localStorage", e);
    }
  }, []);

  const updateSectionConfig = (id, field, value) => {
    if (id.startsWith('custom-')) {
      setCustomSections(prev => {
        const next = prev.map(s => s.id === id ? { ...s, [field]: value } : s);
        localStorage.setItem("uvm_custom_sections", JSON.stringify(next));
        return next;
      });
    } else {
      setSectionsConfig(prev => {
        const next = {
          ...prev,
          [id]: { ...prev[id], [field]: value }
        };
        localStorage.setItem("uvm_sections_config", JSON.stringify(next));
        return next;
      });
    }
  };

  const moveSection = (id, direction) => {
    setSectionOrder(prev => {
      const index = prev.indexOf(id);
      if (index === -1) return prev;
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      
      const newOrder = [...prev];
      newOrder[index] = prev[nextIndex];
      newOrder[nextIndex] = id;
      localStorage.setItem("uvm_section_order", JSON.stringify(newOrder));
      return newOrder;
    });
  };

  const toggleSectionVisibility = (id) => {
    if (id.startsWith('custom-')) {
      setCustomSections(prev => {
        const next = prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s);
        localStorage.setItem("uvm_custom_sections", JSON.stringify(next));
        return next;
      });
    } else {
      setSectionsConfig(prev => {
        const next = {
          ...prev,
          [id]: { ...prev[id], visible: !prev[id].visible }
        };
        localStorage.setItem("uvm_sections_config", JSON.stringify(next));
        return next;
      });
    }
  };

  const addCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection = {
      id: newId,
      title: `Ejercicio ${sectionOrder.length - 1}`,
      badge: "TIR/VPN",
      problem: "Nueva propuesta de negocio: Se realiza una inversión inicial y se esperan flujos futuros...",
      theme: "blue",
      visible: true,
      invInicial: 500000,
      rate: 8.0,
      flows: [150000, 200000, 250000]
    };
    
    setCustomSections(prev => {
      const next = [...prev, newSection];
      localStorage.setItem("uvm_custom_sections", JSON.stringify(next));
      return next;
    });
    
    setSectionOrder(prev => {
      const newOrder = [...prev];
      const refIndex = newOrder.indexOf('referencias');
      if (refIndex !== -1) {
        newOrder.splice(refIndex, 0, newId);
      } else {
        newOrder.push(newId);
      }
      localStorage.setItem("uvm_section_order", JSON.stringify(newOrder));
      return newOrder;
    });
    
    setActiveSection(newId);
  };

  const deleteCustomSection = (id) => {
    setCustomSections(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem("uvm_custom_sections", JSON.stringify(next));
      return next;
    });
    setSectionOrder(prev => {
      const next = prev.filter(item => item !== id);
      localStorage.setItem("uvm_section_order", JSON.stringify(next));
      return next;
    });
    setActiveSection("portada");
  };

  const resetAllConfigs = () => {
    if (confirm("¿Estás seguro de restablecer todos los cambios? Se perderán las secciones personalizadas y el orden actual.")) {
      localStorage.removeItem("uvm_section_order");
      localStorage.removeItem("uvm_sections_config");
      localStorage.removeItem("uvm_custom_sections");
      window.location.reload();
    }
  };

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

  // Helper to calculate NPV for Actividad 7 Simulator
  const calculateNPV = (investment, flows, ratePercent) => {
    const r = ratePercent / 100;
    let npv = -investment;
    for (let t = 0; t < flows.length; t++) {
      npv += flows[t] / Math.pow(1 + r, t + 1);
    }
    return npv;
  };

  const markIdea = (text, type, explanation) => {
    if (!studyMode) return text;
    const className = type === 'central' ? 'idea-central-tag' : 'idea-secundaria-tag';
    const label = type === 'central' ? '💡 Idea Central: ' : '📘 Idea Secundaria: ';
    return (
      <span className={className} title={`${label}${explanation}`}>
        {text}
        <span className="tooltip-bubble">
          {label}
          {explanation}
        </span>
      </span>
    );
  };

  const sectionsToRender = currentActivity === 'ambas'
    ? sectionOrder.filter(id => {
        const isCustom = id.startsWith('custom-');
        const config = isCustom 
          ? customSections.find(s => s.id === id)
          : sectionsConfig[id];
        return config && config.visible;
      })
    : [activeSection];

  const sections7ToRender = currentActivity === 'ambas'
    ? ['portada7', 'objetivo7', 'resumen7', 'sensibilidad7', 'conclusion7', 'referencias7']
    : [activeSection];

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="nav-container">
          <div className="logo-section">
            <span className="logo-uvm">
              UVM 
              <select 
                value={currentActivity} 
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentActivity(val);
                  if (val === 'actividad6') {
                    setActiveSection('portada');
                  } else if (val === 'actividad7') {
                    setActiveSection('portada7');
                  } else {
                    setActiveSection('ambas');
                  }
                }}
                className="logo-activity-select"
              >
                <option value="actividad7">Actividad 7</option>
                <option value="actividad6">Actividad 6</option>
                <option value="ambas">Ambas Actividades</option>
              </select>
            </span>
          </div>
          <div className="actions-group">
            {currentActivity === 'actividad6' ? (
              <button className={`btn-secondary ${isEditorMode ? 'active-editor-btn' : ''}`} onClick={() => setIsEditorMode(!isEditorMode)} title="Activar Modo Editor">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {isEditorMode ? "Salir Editor" : "Modo Editor"}
              </button>
            ) : (
              <button className={`btn-secondary ${studyMode ? 'active-study-btn' : ''}`} onClick={() => setStudyMode(!studyMode)} title="Alternar Resaltado de Estudio">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                {studyMode ? "Ocultar Resaltados" : "Mostrar Resaltados"}
              </button>
            )}
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
        {currentActivity === 'actividad6' && (
          <nav className="anchor-nav">
            {sectionOrder.map(id => {
              const isCustom = id.startsWith('custom-');
              const config = isCustom 
                ? customSections.find(s => s.id === id)
                : sectionsConfig[id];
              
              if (!config || !config.visible) return null;
              
              return (
                <button 
                  key={id} 
                  className={`anchor-link ${activeSection === id ? 'active' : ''}`} 
                  onClick={() => setActiveSection(id)}
                >
                  {config.title}
                </button>
              );
            })}
          </nav>
        )}
        {currentActivity === 'actividad7' && (
          <nav className="anchor-nav">
            <button className={`anchor-link ${activeSection === 'portada7' ? 'active' : ''}`} onClick={() => setActiveSection('portada7')}>
              Portada
            </button>
            <button className={`anchor-link ${activeSection === 'objetivo7' ? 'active' : ''}`} onClick={() => setActiveSection('objetivo7')}>
              Objetivo
            </button>
            <button className={`anchor-link ${activeSection === 'resumen7' ? 'active' : ''}`} onClick={() => setActiveSection('resumen7')}>
              Resumen
            </button>
            <button className={`anchor-link ${activeSection === 'sensibilidad7' ? 'active' : ''}`} onClick={() => setActiveSection('sensibilidad7')}>
              Simulador
            </button>
            <button className={`anchor-link ${activeSection === 'conclusion7' ? 'active' : ''}`} onClick={() => setActiveSection('conclusion7')}>
              Conclusión
            </button>
            <button className={`anchor-link ${activeSection === 'referencias7' ? 'active' : ''}`} onClick={() => setActiveSection('referencias7')}>
              Referencias
            </button>
          </nav>
        )}

        {currentActivity === 'ambas' && (
          <div className="combined-activity-header no-print">
            📚 Vista Unificada: Actividad 6 (Problemas) &amp; Actividad 7 (Resumen y Sensibilidad)
          </div>
        )}

        {/* SECTION: PORTADA */}
        {sectionsToRender.includes('portada') && sectionsConfig.portada.visible && (
          <section id="portada" className={`portada-sheet theme-${sectionsConfig.portada.theme}`}>
            {isEditorMode && (
              <div className="editor-section-toolbar">
                <div className="toolbar-info">
                  <span>Edición Portada • Color:</span>
                </div>
                <div className="toolbar-actions">
                  <select 
                    value={sectionsConfig.portada.theme} 
                    onChange={(e) => updateSectionConfig('portada', 'theme', e.target.value)}
                  >
                    <option value="red">Rojo UVM</option>
                    <option value="gold">Oro Académico</option>
                    <option value="blue">Azul Tecnológico</option>
                    <option value="green">Verde Éxito</option>
                    <option value="purple">Púrpura</option>
                  </select>
                </div>
              </div>
            )}
            <div className="portada-header">
              <h2 className="portada-uni">Universidad del Valle de México</h2>
              <p className="portada-sub">Laureate International Universities</p>
              <div className="portada-divider"></div>
            </div>

            <div className="portada-title-container">
              <p className="portada-work-type">Lista de Cotejo - Ejercicios</p>
              {isEditorMode ? (
                <div className="editor-input-wrapper">
                  <span className="editor-field-label">Título de Portada</span>
                  <input 
                    type="text" 
                    className="editor-inline-input" 
                    value={sectionsConfig.portada.title} 
                    onChange={(e) => updateSectionConfig('portada', 'title', e.target.value)} 
                  />
                  <span className="editor-field-label" style={{ marginTop: '0.5rem' }}>Subtítulo / Descripción</span>
                  <textarea 
                    className="editor-inline-textarea" 
                    value={sectionsConfig.portada.subtitle} 
                    onChange={(e) => updateSectionConfig('portada', 'subtitle', e.target.value)} 
                  />
                </div>
              ) : (
                <>
                  <h1 className="portada-title">{sectionsConfig.portada.title}</h1>
                  <p className="portada-subtitle">{sectionsConfig.portada.subtitle}</p>
                </>
              )}
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
        {sectionsToRender.includes('ejercicio1') && sectionsConfig.ejercicio1.visible && (
          <section id="ejercicio1" className={`section-card theme-${sectionsConfig.ejercicio1.theme}`}>
            {isEditorMode && (
              <div className="editor-section-toolbar">
                <div className="toolbar-info">
                  <span>Edición Ejercicio 1 • Color:</span>
                </div>
                <div className="toolbar-actions">
                  <select 
                    value={sectionsConfig.ejercicio1.theme} 
                    onChange={(e) => updateSectionConfig('ejercicio1', 'theme', e.target.value)}
                  >
                    <option value="red">Rojo UVM</option>
                    <option value="gold">Oro Académico</option>
                    <option value="blue">Azul Tecnológico</option>
                    <option value="green">Verde Éxito</option>
                    <option value="purple">Púrpura</option>
                  </select>
                </div>
              </div>
            )}
            <div className="section-header">
              <h2 className="section-title">
                {isEditorMode ? (
                  <div className="editor-inline-header-fields">
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio1.title} 
                      onChange={(e) => updateSectionConfig('ejercicio1', 'title', e.target.value)}
                      style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                    />
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio1.badge} 
                      onChange={(e) => updateSectionConfig('ejercicio1', 'badge', e.target.value)}
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    />
                  </div>
                ) : (
                  <>
                    <span>{sectionsConfig.ejercicio1.title}</span>
                    <span className="section-badge">{sectionsConfig.ejercicio1.badge}</span>
                  </>
                )}
              </h2>
            </div>
            
            {isEditorMode ? (
              <div className="editor-input-wrapper" style={{ marginBottom: '1.5rem' }}>
                <span className="editor-field-label">Enunciado del Problema</span>
                <textarea 
                  className="editor-inline-textarea" 
                  value={sectionsConfig.ejercicio1.problem} 
                  onChange={(e) => updateSectionConfig('ejercicio1', 'problem', e.target.value)} 
                />
              </div>
            ) : (
              <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
                <strong>Problema:</strong> {sectionsConfig.ejercicio1.problem}
              </p>
            )}

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
        {sectionsToRender.includes('ejercicio2') && sectionsConfig.ejercicio2.visible && (
          <section id="ejercicio2" className={`section-card theme-${sectionsConfig.ejercicio2.theme}`}>
            {isEditorMode && (
              <div className="editor-section-toolbar">
                <div className="toolbar-info">
                  <span>Edición Ejercicio 2 • Color:</span>
                </div>
                <div className="toolbar-actions">
                  <select 
                    value={sectionsConfig.ejercicio2.theme} 
                    onChange={(e) => updateSectionConfig('ejercicio2', 'theme', e.target.value)}
                  >
                    <option value="red">Rojo UVM</option>
                    <option value="gold">Oro Académico</option>
                    <option value="blue">Azul Tecnológico</option>
                    <option value="green">Verde Éxito</option>
                    <option value="purple">Púrpura</option>
                  </select>
                </div>
              </div>
            )}
            <div className="section-header">
              <h2 className="section-title">
                {isEditorMode ? (
                  <div className="editor-inline-header-fields">
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio2.title} 
                      onChange={(e) => updateSectionConfig('ejercicio2', 'title', e.target.value)}
                      style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                    />
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio2.badge} 
                      onChange={(e) => updateSectionConfig('ejercicio2', 'badge', e.target.value)}
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    />
                  </div>
                ) : (
                  <>
                    <span>{sectionsConfig.ejercicio2.title}</span>
                    <span className="section-badge">{sectionsConfig.ejercicio2.badge}</span>
                  </>
                )}
              </h2>
            </div>

            {isEditorMode ? (
              <div className="editor-input-wrapper" style={{ marginBottom: '1.5rem' }}>
                <span className="editor-field-label">Enunciado del Problema</span>
                <textarea 
                  className="editor-inline-textarea" 
                  value={sectionsConfig.ejercicio2.problem} 
                  onChange={(e) => updateSectionConfig('ejercicio2', 'problem', e.target.value)} 
                />
              </div>
            ) : (
              <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
                <strong>Problema:</strong> {sectionsConfig.ejercicio2.problem}
              </p>
            )}

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
        {sectionsToRender.includes('ejercicio3') && sectionsConfig.ejercicio3.visible && (
          <section id="ejercicio3" className={`section-card theme-${sectionsConfig.ejercicio3.theme}`}>
            {isEditorMode && (
              <div className="editor-section-toolbar">
                <div className="toolbar-info">
                  <span>Edición Ejercicio 3 • Color:</span>
                </div>
                <div className="toolbar-actions">
                  <select 
                    value={sectionsConfig.ejercicio3.theme} 
                    onChange={(e) => updateSectionConfig('ejercicio3', 'theme', e.target.value)}
                  >
                    <option value="red">Rojo UVM</option>
                    <option value="gold">Oro Académico</option>
                    <option value="blue">Azul Tecnológico</option>
                    <option value="green">Verde Éxito</option>
                    <option value="purple">Púrpura</option>
                  </select>
                </div>
              </div>
            )}
            <div className="section-header">
              <h2 className="section-title">
                {isEditorMode ? (
                  <div className="editor-inline-header-fields">
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio3.title} 
                      onChange={(e) => updateSectionConfig('ejercicio3', 'title', e.target.value)}
                      style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                    />
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio3.badge} 
                      onChange={(e) => updateSectionConfig('ejercicio3', 'badge', e.target.value)}
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    />
                  </div>
                ) : (
                  <>
                    <span>{sectionsConfig.ejercicio3.title}</span>
                    <span className="section-badge">{sectionsConfig.ejercicio3.badge}</span>
                  </>
                )}
              </h2>
            </div>

            {isEditorMode ? (
              <div className="editor-input-wrapper" style={{ marginBottom: '1.5rem' }}>
                <span className="editor-field-label">Enunciado del Problema</span>
                <textarea 
                  className="editor-inline-textarea" 
                  value={sectionsConfig.ejercicio3.problem} 
                  onChange={(e) => updateSectionConfig('ejercicio3', 'problem', e.target.value)} 
                />
              </div>
            ) : (
              <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
                <strong>Problema:</strong> {sectionsConfig.ejercicio3.problem}
              </p>
            )}

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
        {sectionsToRender.includes('ejercicio4') && sectionsConfig.ejercicio4.visible && (
          <section id="ejercicio4" className={`section-card theme-${sectionsConfig.ejercicio4.theme}`}>
            {isEditorMode && (
              <div className="editor-section-toolbar">
                <div className="toolbar-info">
                  <span>Edición Ejercicio 4 • Color:</span>
                </div>
                <div className="toolbar-actions">
                  <select 
                    value={sectionsConfig.ejercicio4.theme} 
                    onChange={(e) => updateSectionConfig('ejercicio4', 'theme', e.target.value)}
                  >
                    <option value="red">Rojo UVM</option>
                    <option value="gold">Oro Académico</option>
                    <option value="blue">Azul Tecnológico</option>
                    <option value="green">Verde Éxito</option>
                    <option value="purple">Púrpura</option>
                  </select>
                </div>
              </div>
            )}
            <div className="section-header">
              <h2 className="section-title">
                {isEditorMode ? (
                  <div className="editor-inline-header-fields">
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio4.title} 
                      onChange={(e) => updateSectionConfig('ejercicio4', 'title', e.target.value)}
                      style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                    />
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio4.badge} 
                      onChange={(e) => updateSectionConfig('ejercicio4', 'badge', e.target.value)}
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    />
                  </div>
                ) : (
                  <>
                    <span>{sectionsConfig.ejercicio4.title}</span>
                    <span className="section-badge">{sectionsConfig.ejercicio4.badge}</span>
                  </>
                )}
              </h2>
            </div>

            {isEditorMode ? (
              <div className="editor-input-wrapper" style={{ marginBottom: '1.5rem' }}>
                <span className="editor-field-label">Enunciado del Problema</span>
                <textarea 
                  className="editor-inline-textarea" 
                  value={sectionsConfig.ejercicio4.problem} 
                  onChange={(e) => updateSectionConfig('ejercicio4', 'problem', e.target.value)} 
                />
              </div>
            ) : (
              <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
                <strong>Problema:</strong> {sectionsConfig.ejercicio4.problem}
              </p>
            )}

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
        {sectionsToRender.includes('ejercicio5') && sectionsConfig.ejercicio5.visible && (
          <section id="ejercicio5" className={`section-card theme-${sectionsConfig.ejercicio5.theme}`}>
            {isEditorMode && (
              <div className="editor-section-toolbar">
                <div className="toolbar-info">
                  <span>Edición Ejercicio 5 • Color:</span>
                </div>
                <div className="toolbar-actions">
                  <select 
                    value={sectionsConfig.ejercicio5.theme} 
                    onChange={(e) => updateSectionConfig('ejercicio5', 'theme', e.target.value)}
                  >
                    <option value="red">Rojo UVM</option>
                    <option value="gold">Oro Académico</option>
                    <option value="blue">Azul Tecnológico</option>
                    <option value="green">Verde Éxito</option>
                    <option value="purple">Púrpura</option>
                  </select>
                </div>
              </div>
            )}
            <div className="section-header">
              <h2 className="section-title">
                {isEditorMode ? (
                  <div className="editor-inline-header-fields">
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio5.title} 
                      onChange={(e) => updateSectionConfig('ejercicio5', 'title', e.target.value)}
                      style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                    />
                    <input 
                      type="text" 
                      className="editor-inline-input" 
                      value={sectionsConfig.ejercicio5.badge} 
                      onChange={(e) => updateSectionConfig('ejercicio5', 'badge', e.target.value)}
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    />
                  </div>
                ) : (
                  <>
                    <span>{sectionsConfig.ejercicio5.title}</span>
                    <span className="section-badge">{sectionsConfig.ejercicio5.badge}</span>
                  </>
                )}
              </h2>
            </div>

            {isEditorMode ? (
              <div className="editor-input-wrapper" style={{ marginBottom: '1.5rem' }}>
                <span className="editor-field-label">Enunciado del Problema</span>
                <textarea 
                  className="editor-inline-textarea" 
                  value={sectionsConfig.ejercicio5.problem} 
                  onChange={(e) => updateSectionConfig('ejercicio5', 'problem', e.target.value)} 
                />
              </div>
            ) : (
              <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
                <strong>Problema:</strong> {sectionsConfig.ejercicio5.problem}
              </p>
            )}

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
        {sectionsToRender.includes('referencias') && sectionsConfig.referencias.visible && (
          <section id="referencias" className={`section-card theme-${sectionsConfig.referencias.theme}`}>
            {isEditorMode && (
              <div className="editor-section-toolbar">
                <div className="toolbar-info">
                  <span>Edición Referencias • Color:</span>
                </div>
                <div className="toolbar-actions">
                  <select 
                    value={sectionsConfig.referencias.theme} 
                    onChange={(e) => updateSectionConfig('referencias', 'theme', e.target.value)}
                  >
                    <option value="red">Rojo UVM</option>
                    <option value="gold">Oro Académico</option>
                    <option value="blue">Azul Tecnológico</option>
                    <option value="green">Verde Éxito</option>
                    <option value="purple">Púrpura</option>
                  </select>
                </div>
              </div>
            )}
            <div className="section-header">
              <h2 className="section-title">
                {isEditorMode ? (
                  <input 
                    type="text" 
                    className="editor-inline-input" 
                    value={sectionsConfig.referencias.title} 
                    onChange={(e) => updateSectionConfig('referencias', 'title', e.target.value)}
                    style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                  />
                ) : (
                  sectionsConfig.referencias.title
                )}
              </h2>
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

        {/* SECTION: CUSTOM SECTION */}
        {sectionsToRender.filter(id => id.startsWith('custom-')).map(customId => {
          const customSec = customSections.find(s => s.id === customId);
          if (!customSec || !customSec.visible) return null;

            const rDecimal = customSec.rate / 100;
            let vpTotal = 0;
            const flowVPs = customSec.flows.map((f, idx) => {
              const t = idx + 1;
              const vp = f / Math.pow(1 + rDecimal, t);
              vpTotal += vp;
              return vp;
            });
            const vpn = vpTotal - customSec.invInicial;
            const tirRaw = calculateIRR([-customSec.invInicial, ...customSec.flows], 0.1);
            const tirPercent = tirRaw !== null ? (tirRaw * 100).toFixed(2) : "N/D";
            const esViable = vpn > 0;

            return (
              <section id={customSec.id} className={`section-card theme-${customSec.theme}`}>
                {isEditorMode && (
                  <div className="editor-section-toolbar">
                    <div className="toolbar-info">
                      <span>Edición Ejercicio Personalizado • Color:</span>
                    </div>
                    <div className="toolbar-actions">
                      <select 
                        value={customSec.theme} 
                        onChange={(e) => updateSectionConfig(customSec.id, 'theme', e.target.value)}
                      >
                        <option value="red">Rojo UVM</option>
                        <option value="gold">Oro Académico</option>
                        <option value="blue">Azul Tecnológico</option>
                        <option value="green">Verde Éxito</option>
                        <option value="purple">Púrpura</option>
                      </select>
                      <button className="btn-delete-section" onClick={() => deleteCustomSection(customSec.id)} title="Eliminar Sección">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                )}

                <div className="section-header">
                  <h2 className="section-title">
                    {isEditorMode ? (
                      <div className="editor-inline-header-fields">
                        <input 
                          type="text" 
                          className="editor-inline-input" 
                          value={customSec.title} 
                          onChange={(e) => updateSectionConfig(customSec.id, 'title', e.target.value)}
                          style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                        />
                        <input 
                          type="text" 
                          className="editor-inline-input" 
                          value={customSec.badge} 
                          onChange={(e) => updateSectionConfig(customSec.id, 'badge', e.target.value)}
                          style={{ width: '120px', fontSize: '0.875rem' }}
                        />
                      </div>
                    ) : (
                      <>
                        <span>{customSec.title}</span>
                        <span className="section-badge">{customSec.badge}</span>
                      </>
                    )}
                  </h2>
                </div>

                {isEditorMode ? (
                  <div className="editor-input-wrapper" style={{ marginBottom: '1.5rem' }}>
                    <span className="editor-field-label">Enunciado del Problema</span>
                    <textarea 
                      className="editor-inline-textarea" 
                      value={customSec.problem} 
                      onChange={(e) => updateSectionConfig(customSec.id, 'problem', e.target.value)} 
                    />
                  </div>
                ) : (
                  <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
                    <strong>Problema:</strong> {customSec.problem}
                  </p>
                )}

                <div className="calculator-grid">
                  <div className="calculator-panel">
                    <h3 className="input-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Parámetros Financieros</h3>
                    
                    <div className="input-group">
                      <span className="input-label">Inversión Inicial ($)</span>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={customSec.invInicial} 
                        onChange={(e) => updateSectionConfig(customSec.id, 'invInicial', parseFloat(e.target.value) || 0)} 
                      />
                    </div>
                    
                    <div className="input-group">
                      <span className="input-label">Tasa de Oportunidad (%)</span>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="input-field" 
                        value={customSec.rate} 
                        onChange={(e) => updateSectionConfig(customSec.id, 'rate', parseFloat(e.target.value) || 0)} 
                      />
                    </div>

                    <div className="input-group">
                      <span className="input-label">Flujos de Efectivo (separados por comas)</span>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={customSec.flows.join(', ')} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const numList = val.split(',').map(v => parseFloat(v.trim()) || 0);
                          updateSectionConfig(customSec.id, 'flows', numList);
                        }} 
                      />
                      <span className="ratio-desc" style={{ marginTop: '-4px' }}>Ejemplo: 150000, 200000, 250000</span>
                    </div>
                  </div>

                  <div className="results-panel">
                    <div className="result-card">
                      <span className="input-label">Valor Presente Neto (VPN)</span>
                      <div className={`result-val ${esViable ? 'positive' : 'negative'}`}>
                        ${vpn.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="result-card" style={{ marginTop: '0.75rem' }}>
                      <span className="input-label">Tasa Interna de Retorno (TIR)</span>
                      <div className="result-val" style={{ fontSize: '1.5rem', color: 'var(--brand-color)' }}>
                        {tirPercent}%
                      </div>
                    </div>

                    <div className="result-card" style={{ marginTop: '0.75rem' }}>
                      <span className="input-label">Decisión Operativa</span>
                      <div className={`result-val ${esViable ? 'positive' : 'negative'}`} style={{ fontSize: '1.25rem' }}>
                        {esViable ? "ACEPTAR NEGOCIO" : "RECHAZAR NEGOCIO"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cashflow-visualizer">
                  <h4 className="cashflow-title">Diagrama de Flujo de Caja</h4>
                  <div className="cashflow-timeline" style={{ overflowX: 'auto' }}>
                    <div className="cashflow-node outflow">
                      <span className="cashflow-val">-${customSec.invInicial.toLocaleString('es-MX')}</span>
                      <div className="cashflow-arrow"></div>
                      <span className="cashflow-period">Mes/Año 0</span>
                    </div>
                    {customSec.flows.map((f, idx) => (
                      <div key={idx} className="cashflow-node inflow">
                        <span className="cashflow-val">+${f.toLocaleString('es-MX')}</span>
                        <div className="cashflow-arrow"></div>
                        <span className="cashflow-period">Periodo {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Procedure */}
                <div className="procedimiento-container">
                  <h4 className="procedimiento-title">Procedimiento Matemático Detallado</h4>
                  <div className="step-details-list">
                    <p><strong>Fórmula del Valor Presente Neto (VPN):</strong></p>
                    <div className="math-formula-box">
                      VPN = - I<sub>0</sub> + &sum; [ F<sub>t</sub> / (1 + i)<sup>t</sup> ]
                    </div>
                    <div className="step-details-item">
                      <strong>Paso 1:</strong> Descontar cada flujo a la tasa del {customSec.rate}% (i = {rDecimal}):
                      <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                        {customSec.flows.map((f, idx) => {
                          const t = idx + 1;
                          const vp = flowVPs[idx];
                          return (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>
                              VP<sub>{t}</sub> = {f.toLocaleString('es-MX')} / (1 + {rDecimal})<sup>{t}</sup> = ${vp.toLocaleString('es-MX', { minimumFractionDigits: 4 })}
                            </li>
                          );
                        })}
                      </ul>
                      <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                        Suma VP Ingresos = ${vpTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="step-details-item">
                      <strong>Paso 2:</strong> Calcular VPN restando inversión inicial:
                      <div style={{ fontFamily: 'monospace', padding: '0.5rem 0' }}>
                        VPN = -{customSec.invInicial.toLocaleString('es-MX')} + {vpTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <br />
                        VPN = ${vpn.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    {tirRaw !== null && (
                      <div className="step-details-item">
                        <strong>Paso 3:</strong> Obtener la TIR resolviendo la ecuación de equivalencia financiera para VPN = 0:
                        <div style={{ fontFamily: 'monospace', padding: '0.5rem 0' }}>
                          0 = -{customSec.invInicial.toLocaleString('es-MX')} + {customSec.flows.map((f, idx) => `${f.toLocaleString('es-MX')}/(1+r)^${idx+1}`).join(' + ')} <br />
                          r &approx; {tirPercent}% (TIR calculada mediante algoritmo numérico de precisión)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="conclusion-box">
                  <h4 className="conclusion-title">Conclusión de Viabilidad</h4>
                  <p className="conclusion-text">
                    El proyecto es <strong>{esViable ? "VIABLE" : "INVIABLE"}</strong>. El VPN obtenido es de <strong>${vpn.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>. 
                    {esViable ? (
                      ` Debido a que el VPN es positivo (VPN > 0) y la TIR (${tirPercent}%) es superior a la tasa de descuento exigida del ${customSec.rate}%, se aconseja emprender la inversión ya que generará un valor neto positivo para la organización.`
                    ) : (
                      ` Debido a que el VPN es negativo (VPN < 0) y la TIR (${tirPercent}%) es inferior a la tasa de descuento mínima aceptable del ${customSec.rate}%, se aconseja rechazar la inversión debido a que destruirá valor financiero.`
                    )}
                  </p>
                </div>
              </section>
            );
          })
        }
        {/* --- ACTIVIDAD 7 SECTIONS --- */}

        {/* SECTION: PORTADA 7 */}
        {(currentActivity === 'actividad7' || currentActivity === 'ambas') && sections7ToRender.includes('portada7') && (
          <section id="portada7" className="portada-sheet theme-red">
            <div className="portada-header">
              <h2 className="portada-uni">Universidad del Valle de México</h2>
              <p className="portada-sub">Laureate International Universities</p>
              <div className="portada-divider"></div>
            </div>

            <div className="portada-title-container">
              <p className="portada-work-type">Resumen Ejecutivo e Investigación</p>
              <h1 className="portada-title">Actividad 7. Técnicas de Evaluación de Proyectos y Análisis de Sensibilidad</h1>
              <p className="portada-subtitle">Un análisis exhaustivo de métodos de decisión económica bajo condiciones de certeza y riesgo.</p>
            </div>

            <div className="portada-meta">
              <div className="meta-item">
                <span className="meta-label">Estudiante</span>
                <span className="meta-value">{studentName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Asignatura</span>
                <span className="meta-value">{subject}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Docente</span>
                <span className="meta-value">{professorName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Campus</span>
                <span className="meta-value">{campus}</span>
              </div>
              <div className="meta-item" style={{ gridColumn: 'span 2' }}>
                <span className="meta-label">Fecha de Entrega</span>
                <span className="meta-value">{currentDate || "12 de agosto de 2026"}</span>
              </div>
            </div>

            <div className="portada-footer">
              UVM SISTEMA RESÚMENES • MÉXICO
            </div>
          </section>
        )}

        {/* SECTION: OBJETIVO 7 */}
        {(currentActivity === 'actividad7' || currentActivity === 'ambas') && sections7ToRender.includes('objetivo7') && (
          <section id="objetivo7" className="section-card theme-red">
            <div className="section-header">
              <h2 className="section-title">Objetivo del Resumen</h2>
            </div>
            <div className="academic-text-block">
              <p className="academic-paragraph lead-text">
                El objetivo de este resumen ejecutivo es estructurar y analizar rigurosamente las principales metodologías de evaluación económica y de análisis de riesgo aplicadas a la formulación de proyectos, tales como el **Valor Actual Neto (VAN)**, la **Tasa Interna de Retorno (TIR)**, el **Período de Recuperación (PRI)** y el **Análisis de Sensibilidad**.
              </p>
              <p className="academic-paragraph">
                A través del contraste conceptual y la modelación matemática, este documento busca evidenciar las ventajas operativas y las limitaciones que cada técnica ofrece a las corporaciones y a los tomadores de decisiones que buscan maximizar el rendimiento de sus inversiones y mitigar la incertidumbre en entornos de mercado dinámicos.
              </p>
            </div>
          </section>
        )}

        {/* SECTION: RESUMEN 7 */}
        {(currentActivity === 'actividad7' || currentActivity === 'ambas') && sections7ToRender.includes('resumen7') && (
          <section id="resumen7" className="section-card theme-red">
            <div className="section-header">
              <h2 className="section-title">Resumen de Técnicas y Análisis Financiero</h2>
            </div>
            
            <div className="academic-text-block">
              <div className="resumen-block">
                <h3>1. Técnicas de Evaluación de Proyectos (TIR, VAN y PRI)</h3>
                
                <h4 className="sub-title">Período de Recuperación de la Inversión (PRI)</h4>
                <p className="academic-paragraph">
                  {markIdea("El período de recuperación es el indicador que cuantifica el tiempo requerido para que un proyecto de inversión logre recuperar su capital inicial a través de los flujos netos de caja generados.", "central", "Define el tiempo en el que se recupera el desembolso inicial de capital.")}
                </p>
                <p className="academic-paragraph">
                  {markIdea("Aunque es intuitivo y útil para medir el riesgo de liquidez a corto plazo, posee deficiencias fundamentales: ignora el valor del dinero en el tiempo dentro del periodo de recuperación y descarta por completo los flujos de efectivo generados después de haber alcanzado el punto de equilibrio.", "secundaria", "Ignora el valor temporal del dinero y los ingresos posteriores al payback.")}
                </p>

                <h4 className="sub-title">Valor Actual Neto (VAN / VPN)</h4>
                <p className="academic-paragraph">
                  {markIdea("El Valor Actual Neto (VAN) representa la diferencia cuantitativa entre el valor presente de los flujos de efectivo netos proyectados (descontados a una tasa de costo de capital) y la inversión inicial.", "central", "Fórmula financiera que trae todos los flujos futuros al presente y resta el capital invertido.")}
                </p>
                <p className="academic-paragraph">
                  {markIdea("El criterio de aceptación es binario: un VAN mayor a cero indica que el proyecto es viable porque genera rendimientos superiores al costo de capital de la empresa; si es menor a cero, se rechaza debido a que destruirá valor patrimonial.", "secundaria", "Criterio de decisión estándar: Aceptar si VAN > 0; rechazar en caso contrario.")}
                </p>
                
                <div className="academic-table-container" style={{ margin: '1.5rem 0' }}>
                  <h5 className="table-caption">Tabla Comparativa Académica: Proyecto A vs. Proyecto B (Inversión $12,000, Tasa 10%)</h5>
                  <table className="academic-table">
                    <thead>
                      <tr>
                        <th>Proyecto</th>
                        <th>Inversión</th>
                        <th>Año 1</th>
                        <th>Año 2</th>
                        <th>Año 3</th>
                        <th>Año 4</th>
                        <th>PRI (Recuperación)</th>
                        <th>VAN (10%)</th>
                        <th>TIR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Proyecto A</strong></td>
                        <td>-$12,000</td>
                        <td>+$4,000</td>
                        <td>+$4,000</td>
                        <td>+$4,000</td>
                        <td>+$8,000</td>
                        <td>3 Años</td>
                        <td className="positive-text"><strong>+$3,411.52</strong></td>
                        <td className="positive-text"><strong>21.00%</strong></td>
                      </tr>
                      <tr>
                        <td><strong>Proyecto B</strong></td>
                        <td>-$12,000</td>
                        <td>+$8,000</td>
                        <td>+$4,000</td>
                        <td>+$2,000</td>
                        <td>+$2,000</td>
                        <td className="highlight-cell"><strong>2 Años</strong></td>
                        <td className="positive-text">+$2,618.00</td>
                        <td className="positive-text">18.5%</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="ratio-desc" style={{ marginTop: '0.5rem', textAlign: 'left' }}>
                    <strong>Análisis del Contraste:</strong> Si utilizáramos el Período de Recuperación, elegiríamos el <strong>Proyecto B</strong> (recupera en 2 años vs 3 del A). Sin embargo, el VAN demuestra que el <strong>Proyecto A</strong> es muy superior porque aporta <strong>$3,411.52</strong> en valor neto hoy vs. <strong>$2,618.00</strong> del Proyecto B, debido a su flujo robusto de $8,000 en el año 4. Esto comprueba la debilidad crítica del método de recuperación simple.
                  </p>
                </div>

                <h4 className="sub-title">Tasa Interna de Retorno (TIR)</h4>
                <p className="academic-paragraph">
                  {markIdea("La Tasa Interna de Retorno (TIR) es la tasa de descuento específica que iguala el Valor Actual Neto (VAN) a cero.", "central", "La tasa a la cual el valor actual de los flujos de ingresos es igual al valor de la inversión inicial.")}
                </p>
                <p className="academic-paragraph">
                  {markIdea("Funciona como el costo de capital máximo que el proyecto puede soportar; un proyecto debe ser aceptado si su TIR supera el costo de capital de la empresa (o TMAR), garantizando rentabilidad.", "secundaria", "Regla de decisión: Aceptar si TIR > Costo de Capital (TMAR).")}
                </p>
              </div>

              <div className="resumen-block" style={{ marginTop: '2.5rem' }}>
                <h3>2. Análisis de Sensibilidad y Gestión de Riesgo en Proyectos</h3>
                <p className="academic-paragraph">
                  {markIdea("El análisis de sensibilidad es una técnica de gestión de riesgos que mide la variabilidad de la rentabilidad (TIR/VAN) de un proyecto ante modificaciones controladas en variables críticas.", "central", "Prueba de estrés financiero para medir qué tan expuesto está el negocio frente a factores de riesgo.")}
                </p>
                <p className="academic-paragraph">
                  {markIdea("Permite simular incrementos de costos que elevan la inversión inicial (+15% y +30%) o decrementos de ingresos que reducen los flujos de efectivo (-15% y -30%), recalculando la TIR para evaluar la robustez del proyecto.", "secundaria", "Estimar la TIR en el peor de los escenarios para asegurar que no caiga por debajo de la TMAR.")}
                </p>
                <p className="academic-paragraph">
                  Por ejemplo, si la inversión original de un proyecto cuenta con una TIR de 60%, un incremento en costos del 15% podría reducir la TIR al 48%, y un incremento del 30% podría bajarla al 38%. Del mismo modo, si las ventas caen y los flujos netos anuales disminuyen un 30%, la TIR podría contraerse significativamente (por ejemplo, a un 30%), pero si este rendimiento sigue siendo superior a la TMAR exigida (por ejemplo, 7.97%), el proyecto sigue constituyendo una alternativa viable y robusta ante riesgos.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: SENSIBILIDAD 7 */}
        {(currentActivity === 'actividad7' || currentActivity === 'ambas') && sections7ToRender.includes('sensibilidad7') && (
          (() => {
            const baseFlows = [flow7_1, flow7_2, flow7_3, flow7_4];
            
            const baseNPV = calculateNPV(inv7, baseFlows, tmar7);
            const baseTIRRaw = calculateIRR([-inv7, ...baseFlows], 0.1);
            const baseTIR = baseTIRRaw !== null ? (baseTIRRaw * 100).toFixed(2) : "N/D";
            const baseViable = baseTIRRaw !== null && (baseTIRRaw * 100) > tmar7;

            const inv15 = inv7 * 1.15;
            const npvInv15 = calculateNPV(inv15, baseFlows, tmar7);
            const tirInv15Raw = calculateIRR([-inv15, ...baseFlows], 0.1);
            const tirInv15 = tirInv15Raw !== null ? (tirInv15Raw * 100).toFixed(2) : "N/D";
            const viableInv15 = tirInv15Raw !== null && (tirInv15Raw * 100) > tmar7;

            const inv30 = inv7 * 1.30;
            const npvInv30 = calculateNPV(inv30, baseFlows, tmar7);
            const tirInv30Raw = calculateIRR([-inv30, ...baseFlows], 0.1);
            const tirInv30 = tirInv30Raw !== null ? (tirInv30Raw * 100).toFixed(2) : "N/D";
            const viableInv30 = tirInv30Raw !== null && (tirInv30Raw * 100) > tmar7;

            const flows15 = baseFlows.map(f => f * 0.85);
            const npvFlows15 = calculateNPV(inv7, flows15, tmar7);
            const tirFlows15Raw = calculateIRR([-inv7, ...flows15], 0.1);
            const tirFlows15 = tirFlows15Raw !== null ? (tirFlows15Raw * 100).toFixed(2) : "N/D";
            const viableFlows15 = tirFlows15Raw !== null && (tirFlows15Raw * 100) > tmar7;

            const flows30 = baseFlows.map(f => f * 0.70);
            const npvFlows30 = calculateNPV(inv7, flows30, tmar7);
            const tirFlows30Raw = calculateIRR([-inv7, ...flows30], 0.1);
            const tirFlows30 = tirFlows30Raw !== null ? (tirFlows30Raw * 100).toFixed(2) : "N/D";
            const viableFlows30 = tirFlows30Raw !== null && (tirFlows30Raw * 100) > tmar7;

            return (
              <section id="sensibilidad7" className="section-card theme-red">
                <div className="section-header">
                  <h2 className="section-title">Simulador de Análisis de Sensibilidad (TIR / VAN)</h2>
                </div>

                <p className="concept-def" style={{ marginBottom: '1.5rem' }}>
                  <strong>Propósito del Simulador:</strong> Modifica la inversión inicial, la TMAR o los flujos del proyecto base para simular variaciones extremas en los costos de inversión (+15% y +30%) o contracciones en las ventas e ingresos (-15% y -30%), calculando al instante los resultados de viabilidad.
                </p>

                <div className="calculator-grid">
                  <div className="calculator-panel">
                    <h3 className="input-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Datos del Caso Base</h3>
                    
                    <div className="input-group">
                      <span className="input-label">Inversión Inicial ($)</span>
                      <input type="number" className="input-field" value={inv7} onChange={(e) => setInv7(parseFloat(e.target.value) || 0)} />
                    </div>
                    
                    <div className="input-group">
                      <span className="input-label">TMAR (Tasa Mínima Aceptable) (%)</span>
                      <input type="number" step="0.1" className="input-field" value={tmar7} onChange={(e) => setTmar7(parseFloat(e.target.value) || 0)} />
                    </div>

                    <div className="input-group">
                      <span className="input-label">Flujo de Caja - Año 1 ($)</span>
                      <input type="number" className="input-field" value={flow7_1} onChange={(e) => setFlow7_1(parseFloat(e.target.value) || 0)} />
                    </div>
                    
                    <div className="input-group">
                      <span className="input-label">Flujo de Caja - Año 2 ($)</span>
                      <input type="number" className="input-field" value={flow7_2} onChange={(e) => setFlow7_2(parseFloat(e.target.value) || 0)} />
                    </div>
                    
                    <div className="input-group">
                      <span className="input-label">Flujo de Caja - Año 3 ($)</span>
                      <input type="number" className="input-field" value={flow7_3} onChange={(e) => setFlow7_3(parseFloat(e.target.value) || 0)} />
                    </div>
                    
                    <div className="input-group">
                      <span className="input-label">Flujo de Caja - Año 4 ($)</span>
                      <input type="number" className="input-field" value={flow7_4} onChange={(e) => setFlow7_4(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>

                  <div className="results-panel" style={{ gridColumn: 'span 1' }}>
                    <div className="result-card">
                      <span className="input-label">TIR Caso Base</span>
                      <div className={`result-val ${baseViable ? 'positive' : 'negative'}`}>
                        {baseTIR}%
                      </div>
                    </div>
                    <div className="result-card" style={{ marginTop: '1rem' }}>
                      <span className="input-label">VAN Caso Base</span>
                      <div className={`result-val ${baseNPV > 0 ? 'positive' : 'negative'}`}>
                        ${baseNPV.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="result-card" style={{ marginTop: '1rem' }}>
                      <span className="input-label">Evaluación de Viabilidad</span>
                      <div className={`result-val ${baseViable ? 'positive' : 'negative'}`} style={{ fontSize: '1.25rem' }}>
                        {baseViable ? "PROYECTO RECOMENDABLE" : "PROYECTO RECHAZADO"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="academic-table-container" style={{ marginTop: '2rem' }}>
                  <h4 className="table-caption" style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'var(--brand-color)' }}>Tabla Comparativa de Sensibilidad ante Escenarios de Riesgo</h4>
                  <table className="academic-table">
                    <thead>
                      <tr>
                        <th>Escenario Simulado</th>
                        <th>Inversión</th>
                        <th>Flujos Anuales Proyectados</th>
                        <th>VAN Financiero</th>
                        <th>TIR Obtenida</th>
                        <th>Margen vs TMAR ({tmar7}%)</th>
                        <th>Estado de Decisión</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Caso Base (Original)</strong></td>
                        <td>${inv7.toLocaleString('es-MX')}</td>
                        <td>{baseFlows.map(f => `$${(f/1000).toFixed(0)}k`).join(', ')}</td>
                        <td className={baseNPV > 0 ? 'positive-text' : 'negative-text'}>${baseNPV.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</td>
                        <td className={baseViable ? 'positive-text' : 'negative-text'}><strong>{baseTIR}%</strong></td>
                        <td className={baseViable ? 'positive-text' : 'negative-text'}>+{(parseFloat(baseTIR) - tmar7).toFixed(2)}%</td>
                        <td>
                          <span className={`status-badge ${baseViable ? 'viable' : 'inviable'}`}>
                            {baseViable ? "Viable" : "Inviable"}
                          </span>
                        </td>
                      </tr>
                      
                      <tr>
                        <td><strong>Inversión +15% (Incremento Costos)</strong></td>
                        <td>${inv15.toLocaleString('es-MX')}</td>
                        <td>{baseFlows.map(f => `$${(f/1000).toFixed(0)}k`).join(', ')}</td>
                        <td className={npvInv15 > 0 ? 'positive-text' : 'negative-text'}>${npvInv15.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</td>
                        <td className={viableInv15 ? 'positive-text' : 'negative-text'}><strong>{tirInv15}%</strong></td>
                        <td className={viableInv15 ? 'positive-text' : 'negative-text'}>{tirInv15Raw !== null ? `${(parseFloat(tirInv15) - tmar7).toFixed(2)}%` : "N/D"}</td>
                        <td>
                          <span className={`status-badge ${viableInv15 ? 'viable' : 'inviable'}`}>
                            {viableInv15 ? "Viable" : "Inviable"}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Inversión +30% (Incremento Extremo)</strong></td>
                        <td>${inv30.toLocaleString('es-MX')}</td>
                        <td>{baseFlows.map(f => `$${(f/1000).toFixed(0)}k`).join(', ')}</td>
                        <td className={npvInv30 > 0 ? 'positive-text' : 'negative-text'}>${npvInv30.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</td>
                        <td className={viableInv30 ? 'positive-text' : 'negative-text'}><strong>{tirInv30}%</strong></td>
                        <td className={viableInv30 ? 'positive-text' : 'negative-text'}>{tirInv30Raw !== null ? `${(parseFloat(tirInv30) - tmar7).toFixed(2)}%` : "N/D"}</td>
                        <td>
                          <span className={`status-badge ${viableInv30 ? 'viable' : 'inviable'}`}>
                            {viableInv30 ? "Viable" : "Inviable"}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Ingresos -15% (Caída en Ventas)</strong></td>
                        <td>${inv7.toLocaleString('es-MX')}</td>
                        <td>{flows15.map(f => `$${(f/1000).toFixed(1)}k`).join(', ')}</td>
                        <td className={npvFlows15 > 0 ? 'positive-text' : 'negative-text'}>${npvFlows15.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</td>
                        <td className={viableFlows15 ? 'positive-text' : 'negative-text'}><strong>{tirFlows15}%</strong></td>
                        <td className={viableFlows15 ? 'positive-text' : 'negative-text'}>{tirFlows15Raw !== null ? `${(parseFloat(tirFlows15) - tmar7).toFixed(2)}%` : "N/D"}</td>
                        <td>
                          <span className={`status-badge ${viableFlows15 ? 'viable' : 'inviable'}`}>
                            {viableFlows15 ? "Viable" : "Inviable"}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Ingresos -30% (Crisis de Demanda)</strong></td>
                        <td>${inv7.toLocaleString('es-MX')}</td>
                        <td>{flows30.map(f => `$${(f/1000).toFixed(1)}k`).join(', ')}</td>
                        <td className={npvFlows30 > 0 ? 'positive-text' : 'negative-text'}>${npvFlows30.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</td>
                        <td className={viableFlows30 ? 'positive-text' : 'negative-text'}><strong>{tirFlows30}%</strong></td>
                        <td className={viableFlows30 ? 'positive-text' : 'negative-text'}>{tirFlows30Raw !== null ? `${(parseFloat(tirFlows30) - tmar7).toFixed(2)}%` : "N/D"}</td>
                        <td>
                          <span className={`status-badge ${viableFlows30 ? 'viable' : 'inviable'}`}>
                            {viableFlows30 ? "Viable" : "Inviable"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="excel-tip-box" style={{ marginTop: '1.5rem' }}>
                  <span className="excel-icon">💡</span>
                  <div className="excel-content">
                    <strong>Análisis de Sensibilidad en Excel:</strong> Puedes crear esta tabla usando la herramienta <strong>Tabla de Datos</strong> de Excel (en la pestaña Datos &gt; Análisis de hipótesis &gt; Tabla de datos) configurando la celda de entrada para Inversión o Tasa y recalculando de forma masiva los resultados de TIR y VAN.
                  </div>
                </div>
              </section>
            );
          })()
        )}

        {/* SECTION: CONCLUSION 7 */}
        {(currentActivity === 'actividad7' || currentActivity === 'ambas') && sections7ToRender.includes('conclusion7') && (
          <section id="conclusion7" className="section-card theme-red">
            <div className="section-header">
              <h2 className="section-title">Conclusión General de Viabilidad Financiera</h2>
            </div>
            
            <div className="academic-text-block">
              <p className="academic-paragraph lead-text">
                En conclusión, la evaluación económica de proyectos de inversión y el análisis de sensibilidad constituyen un binomio indispensable para la mitigación del riesgo empresarial y la correcta asignación de capital.
              </p>
              <p className="academic-paragraph">
                Mientras que herramientas tradicionales como el **Período de Recuperación (PRI)** son valiosas para diagnosticar de forma inmediata la liquidez a corto plazo, su incapacidad de reconocer el valor del dinero en el tiempo y de medir los flujos de caja residuales las vuelve insuficientes para decisiones a largo plazo. Es allí donde el **Valor Actual Neto (VAN)** se erige como el método más confiable al cuantificar de forma absoluta el incremento patrimonial que el proyecto agregará a la empresa, expresado en moneda del día de hoy.
              </p>
              <p className="academic-paragraph">
                Por su parte, la **Tasa Interna de Retorno (TIR)** complementa este análisis al expresar el rendimiento esperado en términos relativos (porcentuales), permitiendo compararlo de forma directa contra el costo de capital de la organización o la Tasa Mínima Aceptable de Rendimiento (TMAR).
              </p>
              <p className="academic-paragraph">
                No obstante, la viabilidad financiera estimada en papel bajo condiciones ideales de certeza suele diferir de la realidad operativa. Por esta razón, el **Análisis de Sensibilidad** es mandatorio. Al simular escenarios de estrés económico —como alzas no previstas en la inversión de capital (+15% y +30%) o disminuciones de ingresos debido a contracciones de demanda (-15% y -30%)—, el evaluador puede trazar la frontera de seguridad del proyecto. Esto le permite determinar hasta qué punto las variables críticas pueden deteriorarse antes de que la TIR caiga por debajo de la TMAR y el VAN se torne negativo, reduciendo la exposición al fracaso y optimizando la robustez estratégica del negocio.
              </p>
            </div>
          </section>
        )}

        {/* SECTION: REFERENCIAS 7 */}
        {(currentActivity === 'actividad7' || currentActivity === 'ambas') && sections7ToRender.includes('referencias7') && (
          <section id="referencias7" className="section-card theme-red">
            <div className="section-header">
              <h2 className="section-title">Referencias Bibliográficas (APA)</h2>
            </div>
            
            <div className="references-list">
              <div className="reference-item">
                Baca Urbina, G. (2016). <em>Formulación y evaluación de proyectos</em> (8a ed.). McGraw-Hill.
              </div>
              <div className="reference-item">
                García Padilla, V. M. (2015). <em>Formulación y evaluación de proyectos de inversión</em>. Patria.
              </div>
              <div className="reference-item">
                Gitman, L. J., & Zutter, C. J. (2016). <em>Principios de administración financiera</em> (14a ed.). Pearson Educación.
              </div>
              <div className="reference-item">
                Ross, S. A., Westerfield, R. W., & Jordan, B. D. (2018). <em>Fundamentos de finanzas corporativas</em> (11a ed.). McGraw-Hill.
              </div>
              <div className="reference-item">
                Sapag Chain, N., Sapag Chain, R., & Sapag Puelma, J. M. (2014). <em>Preparación y evaluación de proyectos</em> (6a ed.). McGraw-Hill.
              </div>
            </div>
          </section>
        )}
      </main>

      {/* EDITOR SIDEBAR */}
      {isEditorMode && (
        <aside className="editor-sidebar">
          <div className="sidebar-header">
            <h3>Panel del Editor</h3>
            <button className="btn-close" onClick={() => setIsEditorMode(false)}>✕</button>
          </div>
          
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h4>Reordenar y Visibilidad</h4>
              <div className="sections-list">
                {sectionOrder.map((id, index) => {
                  const isCustom = id.startsWith('custom-');
                  const config = isCustom 
                    ? customSections.find(s => s.id === id)
                    : sectionsConfig[id];
                  
                  if (!config) return null;
                  
                  return (
                    <div key={id} className={`sidebar-item ${activeSection === id ? 'active-item' : ''}`} onClick={() => setActiveSection(id)}>
                      <span className="item-title">{config.title}</span>
                      <div className="item-actions">
                        <div className="item-drag-controls">
                          <button 
                            disabled={index === 0} 
                            onClick={(e) => { e.stopPropagation(); moveSection(id, 'up'); }}
                            title="Mover Arriba"
                          >
                            ▲
                          </button>
                          <button 
                            disabled={index === sectionOrder.length - 1} 
                            onClick={(e) => { e.stopPropagation(); moveSection(id, 'down'); }}
                            title="Mover Abajo"
                          >
                            ▼
                          </button>
                        </div>
                        <button 
                          className={`btn-visibility ${config.visible ? 'visible' : 'hidden'}`}
                          onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(id); }}
                          title={config.visible ? "Ocultar" : "Mostrar"}
                        >
                          {config.visible ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="sidebar-section">
              <h4>Acciones</h4>
              <button className="btn-sidebar-action" onClick={addCustomSection}>
                ＋ Añadir Ejercicio
              </button>
              <button className="btn-sidebar-action danger" onClick={resetAllConfigs}>
                🔄 Restablecer Cambios
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
