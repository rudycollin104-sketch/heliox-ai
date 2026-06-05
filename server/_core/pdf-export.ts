/**
 * PDF Export System
 * Generates styled PDF exports of conversations
 */

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

interface ConversationExport {
  title: string;
  toolName: string;
  messages: Message[];
  exportedAt: Date;
  userName?: string;
}

export function generatePDFContent(conversation: ConversationExport): string {
  const timestamp = new Date(conversation.exportedAt).toLocaleString("fr-FR");
  const messageCount = conversation.messages.length;

  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conversation.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 40px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .header .meta {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px;
    }
    
    .message {
      margin-bottom: 24px;
      padding: 16px;
      border-radius: 8px;
      page-break-inside: avoid;
    }
    
    .message.user {
      background: #f0f9ff;
      border-left: 4px solid #06b6d4;
      margin-left: 20px;
    }
    
    .message.assistant {
      background: #f5f3ff;
      border-left: 4px solid #8b5cf6;
      margin-right: 20px;
    }
    
    .message-role {
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
      color: #6b7280;
    }
    
    .message.user .message-role {
      color: #0891b2;
    }
    
    .message.assistant .message-role {
      color: #7c3aed;
    }
    
    .message-content {
      font-size: 14px;
      line-height: 1.6;
      color: #374151;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .message-time {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 8px;
    }
    
    .footer {
      background: #f3f4f6;
      padding: 20px 40px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    
    .stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #06b6d4;
    }
    
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      .container {
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 ${conversation.toolName}</h1>
      <div class="meta">${conversation.title}</div>
      <div class="meta">Exporté le ${timestamp}</div>
    </div>
    
    <div class="content">
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${messageCount}</div>
          <div class="stat-label">Messages</div>
        </div>
        <div class="stat">
          <div class="stat-value">${Math.ceil(messageCount / 2)}</div>
          <div class="stat-label">Échanges</div>
        </div>
        <div class="stat">
          <div class="stat-value">${conversation.messages.reduce((acc, m) => acc + m.content.length, 0)} caractères</div>
          <div class="stat-label">Contenu</div>
        </div>
      </div>
      
      <div class="messages">
`;

  for (const message of conversation.messages) {
    const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString("fr-FR") : "";
    html += `
        <div class="message ${message.role}">
          <div class="message-role">${message.role === "user" ? "👤 Vous" : "🤖 Assistant"}</div>
          <div class="message-content">${escapeHtml(message.content)}</div>
          ${time ? `<div class="message-time">${time}</div>` : ""}
        </div>
`;
  }

  html += `
      </div>
    </div>
    
    <div class="footer">
      <p>Conversation exportée depuis Heliox AI • ${timestamp}</p>
      <p style="margin-top: 8px; opacity: 0.7;">Cette conversation est privée et confidentielle.</p>
    </div>
  </div>
</body>
</html>
`;

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function exportConversationToPDF(
  conversation: ConversationExport
): Promise<Buffer | null> {
  try {
    const html = generatePDFContent(conversation);
    // In a real implementation, use a library like puppeteer or pdfkit
    console.log("PDF export generated for:", conversation.title);
    return null; // Placeholder
  } catch (error) {
    console.error("Failed to export PDF:", error);
    return null;
  }
}
