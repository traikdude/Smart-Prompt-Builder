import React, { useState } from 'react';

// ── Resource Link Data ──────────────────────────────────────────────────
const LAST_UPDATED = '2026-04-12';

interface ResourceLink {
  label: string;
  url: string;
  icon: string;
  description: string;
  ariaLabel: string;
}

interface ResourceGroup {
  title: string;
  icon: string;
  links: ResourceLink[];
}

const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: 'Project',
    icon: '🚀',
    links: [
      {
        label: 'Live Application',
        url: 'https://script.google.com/macros/s/AKfycbwM32r75Aa2mZvnRvS6U6RB1lyNpLklaw_VhHJvpdeC5fELjhjezhJRlSTK6slwCNcV7Q/exec',
        icon: '🌐',
        description: 'Smart Prompt Builder — deployed web app',
        ariaLabel: 'Open the live Smart Prompt Builder application in a new tab',
      },
      {
        label: 'GitHub Repository',
        url: 'https://github.com/traikdude/Smart-Prompt-Builder',
        icon: '🐙',
        description: 'Source code, issues, and releases',
        ariaLabel: 'Open the GitHub repository in a new tab',
      },
    ],
  },
  {
    title: 'Documentation',
    icon: '📚',
    links: [
      {
        label: 'Google Sites',
        url: 'https://script.google.com/macros/s/AKfycbz-AgkBYRkoskpfZVV2UV1Is86-kmrHBi8L55CN-gJ9CJ6UGdp0WV3wZp631ft8N909Rg/exec',
        icon: '🔗',
        description: 'Embedded deployment for Google Sites',
        ariaLabel: 'Open the Google Sites deployment in a new tab',
      },
      {
        label: 'Project Doc',
        url: 'https://docs.google.com/document/d/1fuoaLaI7u4ndUbbq_X-1X1c0d6dXROV0iQmlx570Kz0/edit',
        icon: '📄',
        description: 'Linked Google Doc — prompt log & specs',
        ariaLabel: 'Open the Google Doc in a new tab',
      },
    ],
  },
  {
    title: 'Notebooks',
    icon: '🧠',
    links: [
      {
        label: 'NotebookLM',
        url: 'https://notebooklm.google.com/notebook/3e1537e2-95d4-4bcc-a5d4-957c31f214f6',
        icon: '📓',
        description: 'Knowledge base for architecture & prompts',
        ariaLabel: 'Open the NotebookLM notebook in a new tab',
      },
    ],
  },
];

// ── Copy-to-Clipboard Button ────────────────────────────────────────────
const CopyButton: React.FC<{ url: string }> = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for restricted environments
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy URL"
      aria-label="Copy link URL to clipboard"
      style={{
        background: copied ? 'rgba(52,211,153,0.18)' : 'rgba(255,255,255,0.04)',
        border: copied ? '1px solid rgba(52,211,153,0.35)' : '1px solid rgba(255,255,255,0.08)',
        color: copied ? '#34D399' : 'rgba(148,163,184,0.7)',
        borderRadius: '6px',
        padding: '2px 6px',
        fontSize: '11px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        flexShrink: 0,
      }}
    >
      {copied ? '✓' : '📋'}
      <span style={{ fontSize: '10px' }}>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

// ── Main ResourceFooter Component ───────────────────────────────────────
const ResourceFooter: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <footer
      id="resource-footer"
      style={{
        marginTop: '20px',
        borderTop: '1px solid rgba(168,85,247,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Rainbow divider accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #FF6B9D, #FF8E53, #FBBF24, #34D399, #22D3EE, #6366F1, #A855F7, #FF6B9D)',
          backgroundSize: '400% 100%',
          animation: 'gradientShift 6s linear infinite',
          opacity: 0.6,
        }}
      />

      {/* Toggle header — always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="resource-links-panel"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'transparent',
          border: 'none',
          color: 'rgba(148,163,184,0.8)',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.04em',
          transition: 'color 0.2s ease',
        }}
      >
        <span style={{ fontSize: '14px' }}>🔗</span>
        <span style={{ fontWeight: 500 }}>Project Resources</span>
        <span
          style={{
            display: 'inline-block',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontSize: '10px',
          }}
        >
          ▼
        </span>
      </button>

      {/* Expandable panel */}
      <div
        id="resource-links-panel"
        role="region"
        aria-label="Project resource links"
        style={{
          maxHeight: isExpanded ? '500px' : '0',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          padding: isExpanded ? '0 16px 20px' : '0 16px 0',
        }}
      >
        {/* Resource groups grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {RESOURCE_GROUPS.map((group) => (
            <div
              key={group.title}
              style={{
                flex: '1 1 220px',
                maxWidth: '280px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '14px 16px',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,85,247,0.25)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }}
            >
              {/* Group heading */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                  paddingBottom: '6px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: '14px' }}>{group.icon}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(226,232,240,0.7)',
                  }}
                >
                  {group.title}
                </span>
              </div>

              {/* Links list */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {group.links.map((link) => (
                  <li
                    key={link.label}
                    style={{
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '13px', lineHeight: '20px', flexShrink: 0 }}>
                      {link.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.ariaLabel}
                          title={link.description}
                          style={{
                            color: '#A78BFA',
                            textDecoration: 'none',
                            fontSize: '12.5px',
                            fontWeight: 500,
                            transition: 'color 0.15s ease',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid rgba(168,85,247,0.5)';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#C4B5FD';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#A78BFA';
                          }}
                        >
                          {link.label}
                        </a>
                        <CopyButton url={link.url} />
                      </div>
                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: '10.5px',
                          color: 'rgba(148,163,184,0.55)',
                          lineHeight: '1.35',
                        }}
                      >
                        {link.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Last updated timestamp */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '14px',
            fontSize: '10px',
            color: 'rgba(148,163,184,0.35)',
            letterSpacing: '0.04em',
          }}
        >
          Last updated: {LAST_UPDATED}
        </div>
      </div>
    </footer>
  );
};

export default ResourceFooter;
