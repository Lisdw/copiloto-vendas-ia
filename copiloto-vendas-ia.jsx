import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Você é um Copiloto de Vendas com IA especializado em apoiar vendedores em loja durante atendimentos reais. Você é estratégico, direto e orientado a resultados.

Suas capacidades:
1. **Pitch de Produto**: Gere argumentos de venda persuasivos e personalizados com base no produto e perfil do cliente.
2. **Resposta a Objeções**: Ofereça respostas inteligentes para as objeções mais comuns (preço, concorrência, prazo, necessidade).
3. **Ficha de Produto**: Organize informações técnicas e diferenciais de produtos de forma clara.
4. **Follow-up**: Sugira mensagens de acompanhamento para pós-atendimento, WhatsApp ou e-mail.
5. **Script de Abordagem**: Crie scripts de abertura para abordar clientes que acabam de entrar na loja.

Sempre responda em português brasileiro. Seja objetivo, prático e use linguagem voltada ao contexto comercial. Formate suas respostas com clareza usando emojis estratégicos, listas e destaques quando necessário. Finalize sugerindo o próximo passo comercial.`;

const QUICK_ACTIONS = [
  { id: "pitch", icon: "🎯", label: "Gerar Pitch", prompt: "Crie um pitch de vendas persuasivo para um produto de alto valor. Me pergunte as informações necessárias primeiro." },
  { id: "objecao", icon: "🛡️", label: "Responder Objeção", prompt: "Me ajude a responder objeções de clientes. Quais são as objeções mais comuns que posso receber hoje?" },
  { id: "ficha", icon: "📋", label: "Ficha do Produto", prompt: "Me ajude a montar uma ficha de produto completa para apresentar ao cliente. Me pergunte os detalhes." },
  { id: "followup", icon: "📲", label: "Follow-up", prompt: "Crie uma mensagem de follow-up para WhatsApp para um cliente que visitou a loja mas não fechou hoje." },
  { id: "abordagem", icon: "👋", label: "Script de Abordagem", prompt: "Crie um script de abordagem inicial para quando um cliente entra na loja sem pedir ajuda." },
  { id: "fechamento", icon: "🤝", label: "Técnica de Fechamento", prompt: "Me ensine técnicas de fechamento de vendas para usar agora com um cliente indeciso." },
];

export default function CopiloDeVendas() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState(null);
  const [stats, setStats] = useState({ interactions: 0, pitches: 0, objections: 0 });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "👋 **Olá, vendedor(a)!** Sou seu Copiloto de Vendas com IA.\n\nEstou aqui para turbinar seus atendimentos em tempo real. Use os atalhos rápidos abaixo ou me conte o que você precisa agora:\n\n• 🎯 Criar um pitch matador\n• 🛡️ Responder uma objeção difícil\n• 📲 Montar um follow-up\n• 📋 Organizar informações do produto\n\n**Como posso te ajudar hoje?**",
        timestamp: new Date()
      }]);
    }
  }, []);

  const sendMessage = async (content) => {
    if (!content.trim() || loading) return;

    const userMsg = { role: "user", content, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setStats(s => ({ ...s, interactions: s.interactions + 1 }));

    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const assistantContent = data.content?.map(b => b.text || "").join("") || "Erro ao processar resposta.";

      setMessages(prev => [...prev, {
        role: "assistant",
        content: assistantContent,
        timestamp: new Date()
      }]);

      const lower = content.toLowerCase();
      if (lower.includes("pitch") || lower.includes("argumento")) setStats(s => ({ ...s, pitches: s.pitches + 1 }));
      if (lower.includes("objeç") || lower.includes("caro") || lower.includes("não preciso")) setStats(s => ({ ...s, objections: s.objections + 1 }));

    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Erro de conexão. Verifique sua internet e tente novamente.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (action) => {
    setActiveMode(action.id);
    sendMessage(action.prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setActiveMode(null);
    setTimeout(() => {
      setMessages([{
        role: "assistant",
        content: "🔄 **Nova sessão iniciada!**\n\nPronto para o próximo atendimento. Como posso te ajudar?",
        timestamp: new Date()
      }]);
    }, 100);
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• /gm, '◆ ')
      .replace(/\n/g, '<br/>');
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      color: "#e8eaf6"
    }}>
      {/* Noise texture overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px"
      }} />

      {/* Header */}
      <header style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(64, 196, 255, 0.15)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "12px",
            background: "linear-gradient(135deg, #40c4ff, #1565c0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", boxShadow: "0 0 20px rgba(64,196,255,0.4)"
          }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "17px", letterSpacing: "-0.3px", color: "#fff" }}>
              Copiloto de Vendas
            </div>
            <div style={{ fontSize: "12px", color: "#40c4ff", fontWeight: 500 }}>
              IA · Atendimento em Loja
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {[
            { label: "Interações", value: stats.interactions, color: "#40c4ff" },
            { label: "Pitches", value: stats.pitches, color: "#69f0ae" },
            { label: "Objeções", value: stats.objections, color: "#ff6b6b" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </div>
          ))}
          <button onClick={clearChat} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px", color: "rgba(255,255,255,0.6)", padding: "8px 14px",
            cursor: "pointer", fontSize: "12px", fontWeight: 600,
            transition: "all 0.2s"
          }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.06)"}
          >
            Nova Sessão
          </button>
        </div>
      </header>

      {/* Quick Actions */}
      <div style={{
        padding: "14px 24px",
        display: "flex", gap: "8px", flexWrap: "wrap",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action)}
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              border: activeMode === action.id
                ? "1px solid rgba(64,196,255,0.6)"
                : "1px solid rgba(255,255,255,0.1)",
              background: activeMode === action.id
                ? "rgba(64,196,255,0.15)"
                : "rgba(255,255,255,0.04)",
              color: activeMode === action.id ? "#40c4ff" : "rgba(255,255,255,0.7)",
              opacity: loading ? 0.5 : 1
            }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "24px",
        display: "flex", flexDirection: "column", gap: "16px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeInUp 0.3s ease"
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 32, height: 32, borderRadius: "10px", flexShrink: 0,
                background: "linear-gradient(135deg, #40c4ff, #1565c0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", marginRight: "10px", marginTop: "4px",
                boxShadow: "0 0 12px rgba(64,196,255,0.3)"
              }}>⚡</div>
            )}
            <div style={{ maxWidth: "72%" }}>
              <div style={{
                padding: "14px 18px",
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #1565c0, #0d47a1)"
                  : "rgba(255,255,255,0.06)",
                border: msg.role === "user"
                  ? "1px solid rgba(64,196,255,0.2)"
                  : "1px solid rgba(255,255,255,0.08)",
                fontSize: "14px", lineHeight: "1.65",
                color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.9)",
                boxShadow: msg.role === "user"
                  ? "0 4px 20px rgba(21,101,192,0.3)"
                  : "0 2px 12px rgba(0,0,0,0.3)"
              }}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
              <div style={{
                fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "4px",
                textAlign: msg.role === "user" ? "right" : "left",
                paddingLeft: msg.role === "assistant" ? "4px" : "0"
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
            {msg.role === "user" && (
              <div style={{
                width: 32, height: 32, borderRadius: "10px", flexShrink: 0,
                background: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", marginLeft: "10px", marginTop: "4px"
              }}>👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "10px",
              background: "linear-gradient(135deg, #40c4ff, #1565c0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", boxShadow: "0 0 12px rgba(64,196,255,0.3)"
            }}>⚡</div>
            <div style={{
              padding: "14px 18px", borderRadius: "4px 18px 18px 18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", gap: "6px", alignItems: "center"
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#40c4ff",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "16px 24px",
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)"
      }}>
        <div style={{
          display: "flex", gap: "12px", alignItems: "flex-end",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "12px 16px",
          transition: "border-color 0.2s"
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ex: 'Cliente disse que está caro. Como respondo?' ou 'Crie um pitch para vender um sofá premium...'"
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#fff", fontSize: "14px", lineHeight: "1.5", resize: "none",
              maxHeight: "120px", fontFamily: "inherit",
              "::placeholder": { color: "rgba(255,255,255,0.3)" }
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 40, height: 40, borderRadius: "10px", border: "none",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #40c4ff, #1565c0)"
                : "rgba(255,255,255,0.08)",
              color: "#fff", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", flexShrink: 0, transition: "all 0.2s",
              boxShadow: input.trim() && !loading ? "0 0 16px rgba(64,196,255,0.4)" : "none"
            }}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
        <div style={{
          textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)",
          marginTop: "8px"
        }}>
          Enter para enviar · Shift+Enter para nova linha · Desenvolvido para DIO.me
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(64,196,255,0.2); border-radius: 4px; }
        textarea::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
  }
      
